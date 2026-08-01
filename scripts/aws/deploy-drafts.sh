#!/usr/bin/env bash
# Manual drafts preview deploy: build + sync to S3 website (no CloudFront).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

export AWS_PROFILE="${AWS_PROFILE:-Peak}"
export AWS_REGION="${AWS_REGION:-ap-south-1}"
S3_BUCKET="${S3_DRAFTS_BUCKET:-peaklife-website-drafts-ap-south-1}"

npm ci
npm run build

aws s3 sync dist/ "s3://${S3_BUCKET}/" --delete --region "$AWS_REGION" --profile "$AWS_PROFILE"

echo "Drafts preview â†’ http://${S3_BUCKET}.s3-website.${AWS_REGION}.amazonaws.com"
