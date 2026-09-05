import { describe, expect, it } from "vitest";
import { HOME } from "@/lib/homeCopy";
import { SITE } from "@/lib/site";

describe("homepage copy", () => {
  it("keeps the hero, the three product sections and two founder slots", () => {
    expect(HOME.hero.title).toContain("same user manual");
    expect(HOME.statement.title).toContain("meant for you");
    expect(HOME.features.map((f) => f.id)).toEqual(["today", "ask", "goals"]);
    expect(HOME.founders.people.map((p) => p.name)).toEqual([
      "Abhimanyu Singh Rana",
      "Nishant Kyal",
    ]);
    expect(HOME.founders.people.every((p) => p.paragraphs.length > 0)).toBe(true);
    expect(HOME.faq.items.length).toBeGreaterThan(15);
  });

  it("sends the app CTAs to the store and the Peak web app", () => {
    expect(SITE.app).toBe("https://app.peaklife.me");
    const hrefs = HOME.hero.ctas.map((cta) => cta.href);
    expect(hrefs).toContain(SITE.app);
    expect(hrefs).toContain(SITE.stores.android);
    expect(HOME.nav.cta.href).toBe(SITE.stores.android);
  });

  it("has no duplicate FAQ questions, since they also feed the FAQPage JSON-LD", () => {
    const questions = HOME.faq.items.map((item) => item.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("points every screenshot and portrait at a public asset path", () => {
    const paths = [
      ...HOME.features.map((f) => f.screen.src),
      ...HOME.how.steps.map((s) => s.screen.src),
      ...HOME.founders.people.map((p) => p.portrait.src),
      HOME.footer.lockup.src,
      HOME.seo.ogImage,
    ];
    for (const path of paths) {
      expect(path.startsWith("/assets/img/")).toBe(true);
    }
  });
});
