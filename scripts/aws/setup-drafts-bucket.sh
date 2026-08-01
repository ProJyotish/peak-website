#!/usr/bin/env bash
# One-time: create public S3 website bucket for drafts preview (no CloudFront).
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-Peak}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
BUCKET="${S3_DRAFTS_BUCKET:-peaklife-website-drafts-ap-south-1}"

echo "Creating ${BUCKET} in ${AWS_REGION} (profile ${AWS_PROFILE})â€¦"

if aws s3api head-bucket --bucket "$BUCKET" --profile "$AWS_PROFILE" 2>/dev/null; then
  echo "Bucket already exists."
else
  aws s3api create-bucket \
    --bucket "$BUCKET" \
    --region "$AWS_REGION" \
    --create-bucket-configuration LocationConstraint="$AWS_REGION" \
    --profile "$AWS_PROFILE"
fi

# Public website hosting requires disabling Block Public Access for this bucket.
aws s3api put-public-access-block \
  --bucket "$BUCKET" \
  --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
  --profile "$AWS_PROFILE"

aws s3api put-bucket-ownership-controls \
  --bucket "$BUCKET" \
  --ownership-controls 'Rules=[{ObjectOwnership=BucketOwnerPreferred}]' \
  --profile "$AWS_PROFILE" || true

aws s3 website "s3://${BUCKET}/" \
  --index-document index.html \
  --error-document index.html \
  --profile "$AWS_PROFILE"

POLICY=$(cat <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET}/*"
    }
  ]
}
EOF
)

aws s3api put-bucket-policy \
  --bucket "$BUCKET" \
  --policy "$POLICY" \
  --profile "$AWS_PROFILE"

echo "Done. Website endpoint:"
echo "  http://${BUCKET}.s3-website.${AWS_REGION}.amazonaws.com"
