import { afterEach, describe, expect, it } from "vitest";
import {
  androidLink,
  getLandingAttribution,
  installAttributionLinks,
  parseLandingAttribution,
  withUtm,
} from "@/lib/utm";
import { SITE } from "@/lib/site";

describe("parseLandingAttribution", () => {
  it("keeps explicit UTMs from the social post", () => {
    expect(parseLandingAttribution("?utm_source=instagram&utm_medium=bio&utm_campaign=oct", "")).toEqual({
      source: "instagram",
      medium: "bio",
      campaign: "oct",
      content: undefined,
      term: undefined,
    });
  });

  it("falls back to click ids and the referrer", () => {
    expect(parseLandingAttribution("?fbclid=abc", "https://l.instagram.com/")).toEqual({
      source: "instagram",
      medium: "social",
    });
    expect(parseLandingAttribution("", "https://www.reddit.com/r/x")).toEqual({
      source: "reddit",
      medium: "social",
    });
    expect(parseLandingAttribution("", "https://www.google.com/")).toEqual({
      source: "google",
      medium: "organic",
    });
  });

  it("treats direct and internal visits as no signal", () => {
    expect(parseLandingAttribution("", "")).toBeNull();
    expect(parseLandingAttribution("", `https://${SITE.peakDomain}/blog`)).toBeNull();
  });
});

describe("app links", () => {
  afterEach(() => {
    localStorage.clear();
    document.body.innerHTML = "";
  });

  it("puts UTMs in the Play Store install referrer", () => {
    const u = new URL(withUtm(SITE.stores.android, "hero_android"));
    const ref = new URLSearchParams(u.searchParams.get("referrer") ?? "");
    expect(ref.get("utm_source")).toBe("website");
    expect(ref.get("utm_content")).toBe("hero_android");
  });

  it("routes Android CTAs through OneLink with web fallbacks to the app", () => {
    const u = new URL(androidLink("hero_android"));
    expect(u.href.startsWith(SITE.stores.onelink)).toBe(true);
    expect(u.searchParams.get("pid")).toBe("website");
    expect(u.searchParams.get("af_sub1")).toBe("hero_android");
    const web = new URL(u.searchParams.get("af_web_dp") ?? "");
    expect(web.origin).toBe(SITE.app);
    expect(web.searchParams.get("utm_source")).toBe("website");
    expect(u.searchParams.get("af_ios_url")).toBe(web.toString());
  });

  it("rewrites OneLink pid with the visitor's source on click", () => {
    localStorage.setItem(
      "peak_landing_attribution",
      JSON.stringify({ source: "instagram", medium: "social", at: Date.now() }),
    );
    installAttributionLinks();
    const a = document.createElement("a");
    a.href = androidLink("nav");
    document.body.appendChild(a);
    a.addEventListener("click", (e) => e.preventDefault());
    a.click();

    const u = new URL(a.href);
    expect(u.searchParams.get("pid")).toBe("instagram");
    expect(u.searchParams.get("af_sub1")).toBe("nav");
    expect(new URL(u.searchParams.get("af_web_dp") ?? "").searchParams.get("utm_source")).toBe("instagram");
    console.log(`ONELINK_SAMPLE ${a.href}`);
  });

  it("rewrites the baked-in website source with the visitor's source on click", () => {
    localStorage.setItem(
      "peak_landing_attribution",
      JSON.stringify({ source: "instagram", medium: "social", at: Date.now() }),
    );
    expect(getLandingAttribution()?.source).toBe("instagram");

    installAttributionLinks();
    const a = document.createElement("a");
    a.href = withUtm(SITE.stores.android, "nav");
    document.body.appendChild(a);
    a.addEventListener("click", (e) => e.preventDefault());
    a.click();

    const u = new URL(a.href);
    expect(u.searchParams.get("utm_source")).toBe("instagram");
    expect(u.searchParams.get("utm_campaign")).toBeNull();
    expect(u.searchParams.get("utm_content")).toBe("nav");
    expect(new URLSearchParams(u.searchParams.get("referrer") ?? "").get("utm_source")).toBe("instagram");
  });
});
