# Peak website — S3 + CloudFront (ap-south-1)

## Peak (main marketing site)

| Resource | Value |
|----------|-------|
| AWS profile | `Peak` |
| Region (S3) | `ap-south-1` |
| Bucket (prod) | `peaklife-website-ap-south-1` |
| OAC | `E168T203TXSSPJ` |
| CloudFront ID | `E3JRZB3NUFKIKH` |
| URL (prod) | https://dsdjkb0guxr1r.cloudfront.net |
| Bucket (drafts) | `peaklife-website-drafts-ap-south-1` |
| URL (drafts) | http://peaklife-website-drafts-ap-south-1.s3-website.ap-south-1.amazonaws.com |

## PeakLife Horary (separate website at `/`)

Same repo, separate build (`npm run build:horary`) and CloudFront distribution.
Landing page is the site root; shared Contact / Privacy / Terms / account-deletion pages.

| Resource | Value |
|----------|-------|
| Bucket | `peaklife-horary-website-ap-south-1` |
| OAC | `E37PMMPSXXU48Y` |
| CloudFront ID | `E2P0N7O9K9QVC1` |
| URL (prod) | https://d3tqhwmwpt2bt7.cloudfront.net |
| Suggested domain | `horary.peaklife.me` |

### One-time Horary CloudFront setup

```bash
chmod +x scripts/aws/setup-horary-cloudfront.sh
AWS_PROFILE=Peak ./scripts/aws/setup-horary-cloudfront.sh
```

Then create a GitHub Environment `horary` with:

- `S3_BUCKET` = `peaklife-horary-website-ap-south-1`
- `CLOUDFRONT_DISTRIBUTION_ID` = *(printed by setup script)*
- optional `VITE_SITE_DOMAIN`, store URL vars

### Manual Horary deploy

```bash
chmod +x scripts/aws/deploy-horary.sh
AWS_PROFILE=Peak ./scripts/aws/deploy-horary.sh
```

Or push to `main` → `.github/workflows/deploy-horary.yml` (environment `horary`).

## Deploy (Peak)

| Branch | Pipeline | Target |
|--------|----------|--------|
| `main` | `.github/workflows/deploy.yml` | S3 + CloudFront (Peak prod) |
| `main` | `.github/workflows/deploy-horary.yml` | S3 + CloudFront (Horary) |
| `drafts` | `.github/workflows/deploy-drafts.yml` | S3 **website** only (Peak preview, no CloudFront) |

CMS (peakcms) commits content to **`drafts`**. Promote to `main` for production.

### One-time drafts bucket setup

```bash
chmod +x scripts/aws/setup-drafts-bucket.sh
AWS_PROFILE=Peak ./scripts/aws/setup-drafts-bucket.sh
```

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

Same pattern for Horary (`horary.peaklife.me` → Horary distribution domain).

## Directory URLs (`/blog/` → static HTML)

S3 + OAC does **not** map `/blog/` to `blog/index.html`. Without a rewrite, CloudFront’s
403/404 → `/index.html` SPA fallback runs — you see an empty `<div id="root">`.

`/blog/index.html` works; `/blog/` does not, until the CloudFront Function is attached:

```bash
chmod +x scripts/aws/attach-url-rewrite.sh
AWS_PROFILE=Peak ./scripts/aws/attach-url-rewrite.sh
```

Function source: `scripts/aws/cloudfront-url-rewrite.js` (viewer-request).
Horary setup reuses the same function when it already exists.
