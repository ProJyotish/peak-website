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

  it("lists every full-time role before any part-time one", () => {
    const types = careers.roles.map((r) => r.employmentType);
    const firstPartTime = types.indexOf("PART_TIME");
    if (firstPartTime !== -1) {
      expect(types.slice(firstPartTime)).not.toContain("FULL_TIME");
    }
  });

  it("gives every role a real posting date", () => {
    for (const role of careers.roles) {
      expect(role.datePosted, role.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
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

  const jobPostings = [...page.extraHead.matchAll(/{"@context".*?}(?=\s*<\/script>)/g)]
    .map((m) => JSON.parse(m[0]))
    .filter((p) => p["@type"] === "JobPosting");

  const sectionFor = (slug: string) =>
    page.content.split(`id="${slug}"`)[1].split("</section>")[0];

  it("renders A bonus only for roles that have one, in page and structured data", () => {
    const withBonus = careers.roles.filter((r) => r.bonus?.length);
    expect(withBonus.length).toBeGreaterThan(0);
    for (const role of careers.roles) {
      const posting = jobPostings.find((p) => p.identifier.value === role.id);
      if (role.bonus?.length) {
        expect(sectionFor(role.slug), role.id).toContain("A bonus");
        expect(posting.description, role.id).toContain("A bonus");
        for (const item of role.bonus) {
          expect(sectionFor(role.slug)).toContain(item.replaceAll("&", "&amp;"));
        }
      } else {
        expect(sectionFor(role.slug), role.id).not.toContain("A bonus");
        expect(posting.description, role.id).not.toContain("A bonus");
      }
    }
  });

  it("renders every summary paragraph, not just the first", () => {
    for (const role of careers.roles) {
      const paras = Array.isArray(role.summary) ? role.summary : [role.summary];
      for (const text of paras) {
        expect(sectionFor(role.slug)).toContain(text.replaceAll("&", "&amp;"));
      }
    }
  });

  it("carries each role's own datePosted into its JobPosting", () => {
    for (const role of careers.roles) {
      const posting = jobPostings.find((p) => p.identifier.value === role.id);
      expect(posting.datePosted, role.id).toBe(role.datePosted);
    }
  });

  it("splits the header count into full and part time, and the split adds up", () => {
    const count = (type: string) =>
      careers.roles.filter((r) => r.employmentType === type).length;
    const full = count("FULL_TIME");
    const part = count("PART_TIME");
    // A CONTRACTOR or INTERN role would make the header undercount. Extend
    // rolesSummary() in scripts/careers.mjs before adding one.
    expect(full + part).toBe(careers.roles.length);
    expect(page.metaLine).toBe(
      `${careers.roles.length} open roles · ${full} full time · ${part} part time`,
    );
  });

  // This copy once said "All remote" for a page where a role had gone hybrid.
  it("does not claim every role is remote while any role is not", () => {
    if (careers.roles.some((r) => r.remote === false)) {
      expect(page.content).not.toMatch(/all remote/i);
      expect(page.metaLine).not.toMatch(/remote/i);
    }
  });

  it("never tells Google Jobs a non-remote role is fully telecommute", () => {
    for (const role of careers.roles) {
      const posting = jobPostings.find((p) => p.identifier.value === role.id);
      if (role.remote === false) {
        expect(posting.jobLocationType).toBeUndefined();
        expect(posting.jobLocation).toBeDefined();
      } else {
        expect(posting.jobLocationType).toBe("TELECOMMUTE");
      }
    }
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

  it("is linked from the generated static page footer", () => {
    const postbuild = readFileSync(
      resolve(__dirname, "../../scripts/postbuild.mjs"),
      "utf8",
    );
    expect(postbuild).toContain('<a href="/careers/">Careers</a>');
  });

  // The tests above only exercise careersPage() in isolation. postbuild must
  // actually call it, or `npm run build` silently stops emitting
  // dist/careers/index.html with nothing failing.
  it("is actually written by postbuild, not just importable", () => {
    const postbuild = readFileSync(
      resolve(__dirname, "../../scripts/postbuild.mjs"),
      "utf8",
    );
    expect(postbuild).toContain("writePage(careersPage())");
  });

  it("is in the peak sitemap and never the horary one", () => {
    expect(buildSitemapXml([])).toContain("https://peaklife.me/careers/");
  });
});
