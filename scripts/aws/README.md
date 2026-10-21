# Peak website — S3 + CloudFront (ap-south-1)

## Peak (main marketing site)

| Resource | Value |
|----------|-------|
| AWS profile | `Peak` |
| Region (S3) | `ap-south-1` |
| Bucket (prod) | `peaklife-website-ap-south-1` |
| OAC (prod) | `E168T203TXSSPJ` |
| CloudFront ID (prod) | `E3JRZB3NUFKIKH` |
| URL (prod) | https://dsdjkb0guxr1r.cloudfront.net |
| Bucket (drafts / staging) | `peaklife-website-drafts-ap-south-1` |
| OAC (drafts) | `E1DVDVE9OV07WX` |
| CloudFront ID (drafts) | `E2F5B3VRK3VTLK` |
| URL (drafts / staging HTTPS) | https://ddotrjb93s4je.cloudfront.net |

S3 website endpoints are **HTTP only** (no trusted SSL). Staging uses CloudFront in front of the drafts bucket, same pattern as prod.

IDs are also in `scripts/aws/drafts-cloudfront.env` (no secrets).

## Deploy (Peak)

| Branch | Pipeline | Target |
|--------|----------|--------|
| `main` | `.github/workflows/deploy.yml` | S3 + CloudFront (Peak prod) |
| `drafts` | `.github/workflows/deploy-drafts.yml` | S3 + CloudFront (Peak staging / preview) |

CMS (peakcms) commits content to **`drafts`**. Promote to `main` for production.

### GitHub environment `staging` variables

| Variable | Value |
|----------|-------|
| `S3_BUCKET` | `peaklife-website-drafts-ap-south-1` |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E2F5B3VRK3VTLK` |

### One-time drafts bucket + CloudFront setup

```bash
chmod +x scripts/aws/setup-drafts-bucket.sh scripts/aws/setup-drafts-cloudfront.sh
AWS_PROFILE=Peak ./scripts/aws/setup-drafts-bucket.sh
AWS_PROFILE=Peak ./scripts/aws/setup-drafts-cloudfront.sh
```

`setup-drafts-cloudfront.sh` creates OAC + distribution, switches the bucket to CloudFront-only (blocks public website access), and writes `drafts-cloudfront.env`.

### Manual drafts deploy

```bash
chmod +x scripts/aws/deploy-drafts.sh
AWS_PROFILE=Peak ./scripts/aws/deploy-drafts.sh
```

### Manual Peak prod deploy

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

For a staging custom host (e.g. `staging.peaklife.me`), request/attach an ACM cert on distribution `E2F5B3VRK3VTLK` the same way.

## Directory URLs (`/blog/` → static HTML)

S3 + OAC does **not** map `/blog/` to `blog/index.html`. Without a rewrite, CloudFront’s
403/404 error page runs instead of the prerendered route HTML.

`/blog/index.html` works; `/blog/` does not, until the CloudFront Function is attached:

```bash
chmod +x scripts/aws/attach-url-rewrite.sh
AWS_PROFILE=Peak ./scripts/aws/attach-url-rewrite.sh
```

Function source: `scripts/aws/cloudfront-url-rewrite.js` (viewer-request).
Drafts distribution is created with `peaklife-url-rewrite` already associated.

Unknown URLs should serve `404.html` (not the homepage). The distribution template in
`cloudfront-distribution.json` maps 403/404 there; apply that on the live
distribution if it still returns `/index.html` with HTTP 200.
