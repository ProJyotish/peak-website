#!/usr/bin/env bash
# After ACM DNS validation CNAMEs are published, attach peaklifehorary.me to CloudFront E2P0N7O9K9QVC1.
set -euo pipefail

AWS_PROFILE="${AWS_PROFILE:-Peak}"
DIST_ID="${CLOUDFRONT_HORARY_DISTRIBUTION_ID:-E2P0N7O9K9QVC1}"
CERT_ARN="${ACM_HORARY_CERT_ARN:-arn:aws:acm:us-east-1:660878112326:certificate/d4f3ebd9-c9d4-48b8-bfe0-674fc07b66d1}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

STATUS=$(aws acm describe-certificate \
  --certificate-arn "$CERT_ARN" \
  --region us-east-1 \
  --profile "$AWS_PROFILE" \
  --query 'Certificate.Status' \
  --output text)

echo "ACM status: ${STATUS}"
if [[ "$STATUS" != "ISSUED" ]]; then
  echo "Certificate is not ISSUED yet. Add DNS validation CNAMEs from peaklifehorary-acm-validation.json at your registrar, wait for ISSUED, then re-run."
  exit 1
fi

python3 - "$DIST_ID" "$CERT_ARN" "$AWS_PROFILE" "$SCRIPT_DIR/_horary-cf-aliases.json" <<'PY'
import json, subprocess, sys
dist_id, cert_arn, profile, out_path = sys.argv[1:5]
domains = ["peaklifehorary.me"]

def run(args):
    return subprocess.check_output(args, text=True)

cfg_out = json.loads(run([
    "aws", "cloudfront", "get-distribution-config",
    "--id", dist_id, "--profile", profile, "--output", "json",
]))
etag = cfg_out["ETag"]
cfg = cfg_out["DistributionConfig"]
cfg["Aliases"] = {"Quantity": len(domains), "Items": domains}
cfg["ViewerCertificate"] = {
    "ACMCertificateArn": cert_arn,
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "Certificate": cert_arn,
    "CertificateSource": "acm",
}
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(cfg, f, indent=2)

subprocess.check_call([
    "aws", "cloudfront", "update-distribution",
    "--id", dist_id,
    "--if-match", etag,
    "--distribution-config", f"file://{out_path}",
    "--profile", profile,
])
print("Attached aliases:", ", ".join(domains))
print("Point DNS:")
print("  peaklifehorary.me     ALIAS/ANAME/CNAME → d3tqhwmwpt2bt7.cloudfront.net")
print("  www.peaklifehorary.me CNAME → d3tqhwmwpt2bt7.cloudfront.net")
PY
