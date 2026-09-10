import { describe, expect, it } from "vitest";
import { HOME } from "@/lib/homeCopy";
import { SITE } from "@/lib/site";

describe("homepage copy", () => {
  it("keeps the design-system hero and two founder slots", () => {
    expect(HOME.hero.title).toContain("same user manual");
    expect(HOME.statement.title).toContain("meant for you");
    expect(HOME.founders.abhimanyu.name).toBe("Abhimanyu Singh Rana");
    expect(HOME.founders.nishant.name).toBe("Nishant Kyal");
    expect(HOME.founders.nishant.paragraphs[0]).toContain("IIT Delhi");
    expect(HOME.faqs.length).toBeGreaterThan(15);
  });

  it("sends the app CTA to the Peak web app and Play Store", () => {
    expect(SITE.app).toBe("https://app.peaklife.me");
    expect(SITE.stores.android).toContain("play.google.com");
  });
});
