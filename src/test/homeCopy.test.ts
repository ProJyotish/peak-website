import { describe, expect, it } from "vitest";
import { HOME } from "@/lib/homeCopy";
import { SITE } from "@/lib/site";

describe("homepage copy", () => {
  it("keeps the PDF hero and two founder slots", () => {
    expect(HOME.hero.title).toContain("What Is Meant for You");
    expect(HOME.hero.manualTitle).toContain("Same User Manual");
    expect(HOME.founders.abhimanyu.name).toBe("Abhimanyu Singh Rana");
    expect(HOME.founders.nishant.paragraphs[0]).toBe("Blurb for Nishant to be provided.");
    expect(HOME.faqs.length).toBeGreaterThan(15);
  });

  it("sends the app CTA to the Peak web app", () => {
    expect(SITE.app).toBe("https://app.peaklife.me");
  });
});
