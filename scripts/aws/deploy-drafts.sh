#!/usr/bin/env bash
# Manual drafts / staging deploy → S3 + CloudFront invalidation.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
AWS_PROFILE="${AWS_PROFILE:-Peak}"
AWS_REGION="${AWS_REGION:-ap-south-1}"
BUCKET="${S3_DRAFTS_BUCKET:-peaklife-website-drafts-ap-south-1}"

ENV_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/drafts-cloudfront.env"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$ENV_FILE"
fi
DIST_ID="${CLOUDFRONT_DRAFTS_DISTRIBUTION_ID:-${CLOUDFRONT_DISTRIBUTION_ID:-}}"

cd "$ROOT"
npm ci
npm run build

aws s3 sync dist/ "s3://${BUCKET}/" --delete --region "$AWS_REGION" --profile "$AWS_PROFILE"

if [[ -n "$DIST_ID" ]]; then
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*" \
    --profile "$AWS_PROFILE"
  echo "Drafts preview → https://${CLOUDFRONT_DRAFTS_DOMAIN:-${DIST_ID}.cloudfront.net}"
else
  echo "WARN: CLOUDFRONT_DRAFTS_DISTRIBUTION_ID unset — synced S3 only (no HTTPS CDN invalidation)."
  echo "Run scripts/aws/setup-drafts-cloudfront.sh once."
fi
