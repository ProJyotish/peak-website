import { describe, expect, it } from "vitest";
import { HORARY } from "@/lib/horaryCopy";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";
import { SITE_ID } from "@/lib/siteMode";

describe("PeakLife Horary landing", () => {
  it("defaults to peak site mode in tests", () => {
    expect(SITE_ID).toBe("peak");
  });

  it("serves horary marketing at site root (horary build)", () => {
    expect(ROUTES.home).toBe("/");
  });

  it("ships core marketing copy under PeakLife Horary", () => {
    expect(HORARY.name).toBe("PeakLife Horary");
    expect(HORARY.tagline).toContain("One question");
    expect(HORARY.steps).toHaveLength(3);
    expect(HORARY.faqs.length).toBeGreaterThan(3);
  });

  it("defaults android store url for horary app", () => {
    expect(SITE.horary.stores.android).toContain("play.google.com");
    expect(SITE.horary.stores.android).toContain("me.peaklife.prashna");
  });
});
