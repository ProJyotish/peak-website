import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { careersPage, loadCareers } from "../../scripts/careers.mjs";
import { buildSitemapXml } from "../../scripts/sitemap.mjs";

const careers = loadCareers();

describe("careers data", () => {
  it("has an entry for every open role with the fields the page renders", () => {
    expect(careers.roles.length).toBeGreaterThan(0);
    for (const role of careers.roles) {
      expect(role.id).toMatch(/^PEAK-/);
      expect(role.slug).toMatch(/^[a-z0-9-]+$/);
      expect(role.title.length).toBeGreaterThan(3);
      expect(role.responsibilities.length).toBeGreaterThan(0);
      expect(role.lookingFor.length).toBeGreaterThan(0);
      expect(role.whatYouGet.length).toBeGreaterThan(0);
    }
  });

  it("leads with the full-time role", () => {
    expect(careers.roles[0].id).toBe("PEAK-FT-01");
    expect(careers.roles[0].employmentType).toBe("FULL_TIME");
  });

  it("uses employment types Google Jobs understands", () => {
    for (const role of careers.roles) {
      expect(["FULL_TIME", "PART_TIME", "CONTRACTOR", "INTERN"]).toContain(
        role.employmentType,
      );
    }
  });

  it("keeps role ids and slugs unique", () => {
    expect(new Set(careers.roles.map((r) => r.id)).size).toBe(careers.roles.length);
    expect(new Set(careers.roles.map((r) => r.slug)).size).toBe(careers.roles.length);
  });

  it("keeps the file size caps in step with the Apps Script receiver", () => {
    const gs = readFileSync(
      resolve(__dirname, "../../scripts/apps-script/peak-careers-form.gs"),
      "utf8",
    );
    expect(gs).toContain(`maxCvBytes: ${careers.maxCvBytes / 1048576} * 1024 * 1024`);
    expect(gs).toContain(`maxSampleBytes: ${careers.maxSampleBytes / 1048576} * 1024 * 1024`);
  });
});

describe("careers page", () => {
  const page = careersPage({ datePosted: "2026-09-10" });

  it("renders every role", () => {
    for (const role of careers.roles) {
      expect(page.content).toContain(role.title.replaceAll("&", "&amp;"));
      expect(page.content).toContain(`id="${role.slug}"`);
    }
  });

  it("emits one JobPosting per role", () => {
    expect([...page.extraHead.matchAll(/"@type":"JobPosting"/g)]).toHaveLength(
      careers.roles.length,
    );
  });

  it("renders the apply form once an endpoint is configured", () => {
    expect(careers.applyEndpoint).toMatch(/^https:\/\/script\.google\.com\//);
    expect(page.content).toContain('id="apply-form"');
    expect(page.content).toContain('name="website"'); // spam honeypot
  });

  // The homepage has its own inline footer and does not use SiteFooter, so a
  // link added to one of them silently misses the other. Check every footer.
  it("is linked from every footer nav in the app", () => {
    const footers = ["src/pages/Index.tsx", "src/components/site/SiteFooter.tsx"];
    for (const rel of footers) {
      const source = readFileSync(resolve(__dirname, "../..", rel), "utf8");
      expect(source, `${rel} lists Privacy but not Careers`).toContain("ROUTES.careers");
    }
  });

  it("is linked from the generated static page footer, but not on horary", () => {
    const postbuild = readFileSync(
      resolve(__dirname, "../../scripts/postbuild.mjs"),
      "utf8",
    );
    expect(postbuild).toContain('isHorary ? "" : \'<a href="/careers/">Careers</a>\'');
  });

  it("is in the peak sitemap and never the horary one", () => {
    expect(buildSitemapXml([])).toContain("https://peaklife.me/careers/");
    expect(buildSitemapXml([], { site: "horary" })).not.toContain("/careers/");
  });
});
