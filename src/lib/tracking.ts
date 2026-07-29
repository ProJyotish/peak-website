// Tracking utilities for Peak website

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    posthog?: any;
    rdt?: (...args: any[]) => void;
  }
}

/** Keep in sync with index.html gtag config (used when env is missing in CI builds). */
const GA4_FALLBACK_ID = "G-0E72R2MF9P";

function ga4MeasurementId(): string | undefined {
  const raw = import.meta.env.VITE_GA4_ID as string | undefined;
  const id = raw?.replace(/^["']|["']$/g, "").trim();
  if (id && !id.includes("XXXX")) return id;
  return GA4_FALLBACK_ID;
}

/** Fire a GA4 page_view for the current SPA route (all pages). */
export function trackPageView(path: string = window.location.pathname + window.location.search) {
  const ga4Id = ga4MeasurementId();
  if (!ga4Id || typeof window.gtag !== "function") return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
    send_to: ga4Id,
  });
}

export function initializeTracking() {
  const gtmId = import.meta.env.VITE_GTM_ID;
  const ga4Id = ga4MeasurementId();
  const metaPixelId = import.meta.env.VITE_META_PIXEL_ID;
  const clarityId = import.meta.env.VITE_CLARITY_ID;
  const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
  const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";
  const redditPixelId = import.meta.env.VITE_REDDIT_PIXEL_ID;

  // Google Tag Manager (skip placeholders)
  if (gtmId && !String(gtmId).includes("XXXX")) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s) as HTMLScriptElement;
      const dl = l !== "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode?.insertBefore(j, f);
    })(window, document, "script", "dataLayer", gtmId);
  }

  // Google Analytics 4 — skip script inject if already in index.html
  if (ga4Id && !document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${ga4Id}"]`)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer?.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ga4Id, { send_page_view: false });
  } else if (ga4Id && typeof window.gtag === "function") {
    window.gtag("config", ga4Id, { send_page_view: false });
  }

  // Meta Pixel
  if (metaPixelId) {
    !(function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode?.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq?.("init", metaPixelId);
    window.fbq?.("track", "PageView");
  }

  // Microsoft Clarity
  if (clarityId) {
    (function (c: any, l: Document, a: string, r: string, i: string, t?: any, y?: any) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode?.insertBefore(t, y);
    })(window, document, "clarity", "script", clarityId);
  }

  // PostHog
  if (posthogKey) {
    window.posthog = window.posthog && typeof window.posthog.push === "function" ? window.posthog : [];
    !(function (t: Document, e: any) {
      let o: string, n: number, p: any, r: any;
      if (e.__SV) return;
      window.posthog = e;
      e._i = [];
      e.init = function (i: string, s: any, a?: string) {
        function g(t: any, e: string) {
          const o = e.split(".");
          if (o.length === 2) {
            t = t[o[0]];
            e = o[1];
          }
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        }
        p = t.createElement("script");
        p.type = "text/javascript";
        p.crossOrigin = "anonymous";
        p.async = !0;
        p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js";
        r = t.getElementsByTagName("script")[0];
        r.parentNode?.insertBefore(p, r);
        let u = e;
        if (typeof a !== "undefined") {
          u = e[a] = [];
        } else {
          a = "posthog";
        }
        u.people = u.people || [];
        u.toString = function (t: boolean) {
          let e = "posthog";
          if (a !== "posthog") e += "." + a;
          if (!t) e += " (stub)";
          return e;
        };
        u.people.toString = function () {
          return u.toString(1) + ".people (stub)";
        };
        o =
          "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setGroupPropertiesForFlags resetGroupPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroups setPersonPropertiesForFlags opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug";
        const methods = o.split(" ");
        for (n = 0; n < methods.length; n++) g(u, methods[n]);
        e._i.push([i, s, a]);
      };
      e.__SV = 1;
    })(document, window.posthog);
    window.posthog?.init(posthogKey, {
      api_host: posthogHost,
      ui_host: "https://us.posthog.com",
      person_profiles: "always",
    });
  }

  // Reddit Pixel
  if (redditPixelId) {
    !(function (w: any, d: Document) {
      if (!w.rdt) {
        const p = (w.rdt = function () {
          p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments);
        });
        p.callQueue = [];
        const t = d.createElement("script");
        t.src = "https://www.redditstatic.com/ads/pixel.js?pixel_id=" + redditPixelId;
        t.async = !0;
        const s = d.getElementsByTagName("script")[0];
        s.parentNode?.insertBefore(t, s);
      }
    })(window, document);
    window.rdt?.("init", redditPixelId);
    window.rdt?.("track", "PageVisit");
  }
}

// Helper function for delayed navigation with gtag
export function gtagSendEvent(url: string) {
  const callback = function () {
    if (typeof url === "string") {
      window.open(url, "_blank");
    }
  };
  if (typeof window.gtag === "function") {
    window.gtag("event", "click", { event_callback: callback, event_timeout: 2000 });
  } else {
    callback();
  }
  return false;
}
