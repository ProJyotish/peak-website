#!/usr/bin/env bash
# Manual deploy: build + sync to S3 + invalidate CloudFront
# Requires: AWS CLI profile "Peak", Node 20+
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

export AWS_PROFILE="${AWS_PROFILE:-Peak}"
export AWS_REGION="${AWS_REGION:-ap-south-1}"
S3_BUCKET="${S3_BUCKET:-peaklife-website-ap-south-1}"
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-E3JRZB3NUFKIKH}"

npm ci
npm run build

aws s3 sync dist/ "s3://${S3_BUCKET}/" --delete --region "$AWS_REGION" --profile "$AWS_PROFILE"
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  --profile "$AWS_PROFILE"

echo "Deployed → https://dsdjkb0guxr1r.cloudfront.net"
