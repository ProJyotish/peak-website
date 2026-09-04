#!/usr/bin/env bash
# One-time: S3 bucket + OAC + CloudFront for PeakLife Horary (site root).
# Reuses the same CloudFront Function as Peak for directory URL rewrites when available.
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-Peak}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
BUCKET="${S3_HORARY_BUCKET:-peaklife-horary-website-ap-south-1}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_CONFIG="${SCRIPT_DIR}/cloudfront-distribution-horary.json"
OAC_CONFIG="${SCRIPT_DIR}/oac-horary.json"
REWRITE_NAME="${CF_URL_REWRITE_FUNCTION:-peaklife-url-rewrite}"

echo "Setting up PeakLife Horary site → s3://${BUCKET} (profile ${AWS_PROFILE}, ${AWS_REGION})"

# --- S3 bucket ---
if aws s3api head-bucket --bucket "$BUCKET" --profile "$AWS_PROFILE" 2>/dev/null; then
  echo "Bucket already exists: ${BUCKET}"
else
  aws s3api create-bucket \
    --bucket "$BUCKET" \
    --region "$AWS_REGION" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION" \
    --profile "$AWS_PROFILE"
  echo "Created bucket ${BUCKET}"
fi

aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
  --profile "$AWS_PROFILE"

# --- OAC ---
EXISTING_OAC=$(aws cloudfront list-origin-access-controls \
  --profile "$AWS_PROFILE" \
  --query "OriginAccessControlList.Items[?Name=='peaklife-horary-website-oac'].Id | [0]" \
  --output text 2>/dev/null || true)

if [[ -n "${EXISTING_OAC}" && "${EXISTING_OAC}" != "None" ]]; then
  OAC_ID="$EXISTING_OAC"
  echo "Using existing OAC: ${OAC_ID}"
else
  OAC_ID=$(aws cloudfront create-origin-access-control \
    --origin-access-control-config "file://${OAC_CONFIG}" \
    --profile "$AWS_PROFILE" \
    --query 'OriginAccessControl.Id' \
    --output text)
  echo "Created OAC: ${OAC_ID}"
fi

# --- CloudFront Function (reuse Peak rewrite if present) ---
REWRITE_ARN=$(aws cloudfront describe-function \
  --name "$REWRITE_NAME" \
  --profile "$AWS_PROFILE" \
  --query 'FunctionSummary.FunctionMetadata.FunctionARN' \
  --output text 2>/dev/null || true)

# --- Distribution config ---
TMP_DIST=$(mktemp)
python3 - "$DIST_CONFIG" "$OAC_ID" "$REWRITE_ARN" "$TMP_DIST" <<'PY'
import json, sys
src, oac_id, rewrite_arn, dest = sys.argv[1:5]
with open(src, encoding="utf-8") as f:
    cfg = json.load(f)
cfg["Origins"]["Items"][0]["OriginAccessControlId"] = oac_id
if rewrite_arn and rewrite_arn not in ("None", "null", ""):
    cfg["DefaultCacheBehavior"]["FunctionAssociations"] = {
        "Quantity": 1,
        "Items": [{"FunctionARN": rewrite_arn, "EventType": "viewer-request"}],
    }
else:
    cfg["DefaultCacheBehavior"]["FunctionAssociations"] = {"Quantity": 0, "Items": []}
with open(dest, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2)
PY

EXISTING_DIST=$(aws cloudfront list-distributions \
  --profile "$AWS_PROFILE" \
  --query "DistributionList.Items[?Comment=='PeakLife Horary website (S3 ap-south-1)'].Id | [0]" \
  --output text 2>/dev/null || true)

if [[ -n "${EXISTING_DIST}" && "${EXISTING_DIST}" != "None" ]]; then
  DIST_ID="$EXISTING_DIST"
  echo "CloudFront distribution already exists: ${DIST_ID}"
else
  DIST_ID=$(aws cloudfront create-distribution \
    --distribution-config "file://${TMP_DIST}" \
    --profile "$AWS_PROFILE" \
    --query 'Distribution.Id' \
    --output text)
  echo "Created CloudFront distribution: ${DIST_ID}"
fi
rm -f "$TMP_DIST"

DOMAIN=$(aws cloudfront get-distribution \
  --id "$DIST_ID" \
  --profile "$AWS_PROFILE" \
  --query 'Distribution.DomainName' \
  --output text)

ACCOUNT_ID=$(aws sts get-caller-identity --profile "$AWS_PROFILE" --query Account --output text)

# --- Bucket policy (OAC-only) ---
POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalRead",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DIST_ID}"
        }
      }
    }
  ]
}
EOF
)

aws s3api put-bucket-policy \
  --bucket "$BUCKET" \
  --policy "$POLICY" \
  --profile "$AWS_PROFILE"

echo ""
echo "Done."
echo "  Bucket:        s3://${BUCKET}"
echo "  Distribution:  ${DIST_ID}"
echo "  CloudFront URL: https://${DOMAIN}"
echo ""
echo "Next:"
echo "  1. Set GitHub env vars for workflow deploy-horary.yml:"
echo "       S3_BUCKET=${BUCKET}"
echo "       CLOUDFRONT_DISTRIBUTION_ID=${DIST_ID}"
echo "  2. Optional: attach custom domain (ACM us-east-1) + DNS → ${DOMAIN}"
echo "  3. Deploy: npm run build:horary && aws s3 sync dist/ s3://${BUCKET}/ --delete"
