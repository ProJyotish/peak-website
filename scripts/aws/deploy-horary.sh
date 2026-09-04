#!/usr/bin/env bash
# Deploy PeakLife Horary site to its S3 + CloudFront.
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-Peak}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
BUCKET="${S3_HORARY_BUCKET:-peaklife-horary-website-ap-south-1}"
DIST_ID="${CLOUDFRONT_HORARY_DISTRIBUTION_ID:-E2P0N7O9K9QVC1}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

npm run build:horary

aws s3 sync dist/ "s3://${BUCKET}/" --delete --region "$AWS_REGION" --profile "$AWS_PROFILE"

if [[ -z "$DIST_ID" ]]; then
  DIST_ID=$(aws cloudfront list-distributions \
    --profile "$AWS_PROFILE" \
    --query "DistributionList.Items[?Comment=='PeakLife Horary website (S3 ap-south-1)'].Id | [0]" \
    --output text)
fi

if [[ -n "$DIST_ID" && "$DIST_ID" != "None" ]]; then
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*" \
    --profile "$AWS_PROFILE"
  echo "Invalidated CloudFront ${DIST_ID}"
else
  echo "Warning: no CloudFront distribution id found — skipped invalidation"
fi
