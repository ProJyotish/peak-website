import { describe, expect, it } from "vitest";
import { PRASHNA } from "@/lib/prashnaCopy";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

describe("prashna landing page", () => {
  it("exposes the /prashna route", () => {
    expect(ROUTES.prashna).toBe("/prashna");
  });

  it("ships core marketing copy", () => {
    expect(PRASHNA.tagline).toContain("One question");
    expect(PRASHNA.steps).toHaveLength(3);
    expect(PRASHNA.faqs.length).toBeGreaterThan(3);
  });

  it("defaults android store url for prashna", () => {
    expect(SITE.prashna.stores.android).toContain("play.google.com");
    expect(SITE.prashna.stores.android).toContain("me.peaklife.prashna");
  });
});
