# Peak website — S3 + CloudFront (ap-south-1)

| Resource | Value |
|----------|-------|
| AWS profile | `Peak` |
| Region (S3) | `ap-south-1` |
| Bucket | `peaklife-website-ap-south-1` |
| OAC | `E168T203TXSSPJ` |
| CloudFront ID | `E3JRZB3NUFKIKH` |
| URL | https://dsdjkb0guxr1r.cloudfront.net |

## Deploy

GitHub Actions (self-hosted): push to `main` → `.github/workflows/deploy.yml`

Manual:

```bash
# bash
./scripts/aws/deploy.sh

# or PowerShell
$env:AWS_PROFILE='Peak'; $env:AWS_REGION='ap-south-1'
npm run build
aws s3 sync dist/ s3://peaklife-website-ap-south-1/ --delete --region ap-south-1 --profile Peak
aws cloudfront create-invalidation --distribution-id E3JRZB3NUFKIKH --paths "/*" --profile Peak
```

## Custom domain (peaklife.me)

CloudFront custom certs must be in **us-east-1** (AWS requirement), even when the S3 origin is ap-south-1:

1. Request ACM cert in `us-east-1` for `peaklife.me` (+ `www`)
2. Add alternate domain + cert on distribution `E3JRZB3NUFKIKH`
3. Point DNS (Route 53 or registrar) CNAME/ALIAS → `dsdjkb0guxr1r.cloudfront.net`

## Directory URLs (`/blog/` → static HTML)

S3 + OAC does **not** map `/blog/` to `blog/index.html`. Without a rewrite, CloudFront’s
403/404 → `/index.html` SPA fallback runs — you see an empty `<div id="root">`.

`/blog/index.html` works; `/blog/` does not, until the CloudFront Function is attached:

```bash
chmod +x scripts/aws/attach-url-rewrite.sh
AWS_PROFILE=Peak ./scripts/aws/attach-url-rewrite.sh
```

Function source: `scripts/aws/cloudfront-url-rewrite.js` (viewer-request).
