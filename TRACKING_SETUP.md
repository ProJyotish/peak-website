# Peak Website - Tracking Setup

This document describes the tracking and analytics implementation for the Peak website, adapted from ProJyotish.

## Overview

The website integrates multiple tracking and analytics platforms to monitor user behavior, conversion events, and site performance.

## Tracking Platforms

### 1. Google Tag Manager (GTM)
- **Purpose**: Central tag management system
- **Environment Variable**: `VITE_GTM_ID`
- **Example**: `GTM-PRVMWX5W`

### 2. Google Analytics 4 (GA4)
- **Purpose**: Website analytics and user behavior tracking
- **Environment Variable**: `VITE_GA4_ID`
- **Example**: `G-MSRSJ04P4T`

### 3. Meta Pixel (Facebook)
- **Purpose**: Facebook/Instagram ad conversion tracking
- **Environment Variable**: `VITE_META_PIXEL_ID`
- **Example**: `4447268778893377`

### 4. Microsoft Clarity
- **Purpose**: Session recordings and heatmaps
- **Environment Variable**: `VITE_CLARITY_ID`
- **Example**: `v9f9xqikhz`

### 5. PostHog
- **Purpose**: Product analytics and feature flags
- **Environment Variables**:
  - `VITE_POSTHOG_KEY` - API key (e.g., `phc_N5p2DVRO6BXcEIKv86kabRWxa1l7wywFIrpgNQbsMic`)
  - `VITE_POSTHOG_HOST` - API host (default: `https://app.posthog.com`)
- **Note**: PostHog is configured with `person_profiles: 'always'` for user identification

### 6. Reddit Pixel
- **Purpose**: Reddit ad conversion tracking
- **Environment Variable**: `VITE_REDDIT_PIXEL_ID`
- **Example**: `a2_inhxatfmgann`

## Implementation

### Files Modified

1. **`src/lib/tracking.ts`** (NEW)
   - Contains `initializeTracking()` function that dynamically loads all tracking scripts
   - Uses environment variables for configuration
   - Provides helper functions like `gtagSendEvent()`

2. **`src/main.tsx`**
   - Calls `initializeTracking()` on app initialization
   - Ensures tracking is loaded before React app renders

3. **`src/pages/Index.tsx`**
   - Added `FloatingWhatsAppCta` component (mobile-only floating button)
   - Uses `VITE_WHATSAPP_URL` environment variable

4. **`.env`**
   - Contains all tracking IDs (keep this file private)

5. **`.env.example`**
   - Template for required environment variables

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the actual tracking IDs in `.env`:
   - Replace placeholder values with real tracking IDs
   - **Never commit `.env` to version control**

3. Restart the development server to pick up environment variables:
   ```bash
   npm run dev
   ```

## How It Works

1. When the app starts, `main.tsx` imports and calls `initializeTracking()`
2. The function checks each environment variable
3. If a tracking ID is present, the corresponding tracking script is dynamically injected into the page
4. Each platform starts tracking page views and events automatically

## Testing

To verify tracking is working:

1. **Check Browser Console**: No JavaScript errors related to tracking
2. **Check Network Tab**: Look for requests to:
   - `googletagmanager.com`
   - `google-analytics.com`
   - `facebook.net/fbevents.js`
   - `clarity.ms`
   - PostHog host (e.g., `app.posthog.com`)
   - `redditstatic.com/ads/pixel.js`

3. **Use Browser Extensions**:
   - Google Tag Assistant (for GTM/GA4)
   - Facebook Pixel Helper
   - Reddit Pixel Helper

## Environment Variables Reference

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_GTM_ID` | No | Google Tag Manager container ID |
| `VITE_GA4_ID` | No | Google Analytics 4 measurement ID |
| `VITE_META_PIXEL_ID` | No | Facebook/Meta Pixel ID |
| `VITE_CLARITY_ID` | No | Microsoft Clarity project ID |
| `VITE_POSTHOG_KEY` | No | PostHog API key |
| `VITE_POSTHOG_HOST` | No | PostHog API host (defaults to app.posthog.com) |
| `VITE_REDDIT_PIXEL_ID` | No | Reddit Pixel ID |
| `VITE_WHATSAPP_URL` | No | WhatsApp link for floating CTA |

**Note**: All tracking variables are optional. If not provided, the corresponding tracking platform will not be loaded.

## Privacy Considerations

- Ensure compliance with GDPR, CCPA, and other privacy regulations
- Consider implementing a cookie consent banner
- Document tracking in your privacy policy
- Consider anonymizing IP addresses in GA4

## Helper Functions

### `gtagSendEvent(url)`
Opens a URL in a new tab with gtag event tracking:

```typescript
import { gtagSendEvent } from '@/lib/tracking';

// In your component:
<a onClick={() => gtagSendEvent('https://example.com')}>
  External Link
</a>
```

## Troubleshooting

### Tracking not working?
1. Check `.env` file exists and has correct values
2. Restart dev server after changing `.env`
3. Check browser console for errors
4. Verify tracking IDs are correct format

### PostHog not identifying users?
Ensure `person_profiles: 'always'` is set in the PostHog initialization (already configured).

## Migration from ProJyotish

This tracking setup is adapted from the ProJyotish website with the following changes:
- Converted from Next.js `Script` components to dynamic script injection
- Uses Vite environment variables (`VITE_*`) instead of Next.js `process.env`
- All tracking IDs moved to environment variables for easy management
- Added `.env.example` for documentation

## Support

For issues with specific tracking platforms, consult their documentation:
- [Google Tag Manager](https://tagmanager.google.com/)
- [Google Analytics 4](https://analytics.google.com/)
- [Meta Pixel](https://www.facebook.com/business/tools/meta-pixel)
- [Microsoft Clarity](https://clarity.microsoft.com/)
- [PostHog](https://posthog.com/docs)
- [Reddit Pixel](https://ads.reddit.com/help/en/categories/account-administration/conversion-tracking)
