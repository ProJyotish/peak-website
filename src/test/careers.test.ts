import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  careersPage,
  careersStatusJson,
  isOpen,
  loadCareers,
} from "../../scripts/careers.mjs";
import { buildSitemapXml } from "../../scripts/sitemap.mjs";

const careers = loadCareers();
const openRoles = careers.roles.filter(isOpen);
const closedRoles = careers.roles.filter((r) => !isOpen(r));

const closeEverything = () => ({
  ...careers,
  roles: careers.roles.map((r) => ({ ...r, status: "Closed" })),
});

describe("careers data", () => {
  it("has an entry for every role with the fields the page renders", () => {
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

  it("gives every role a status of exactly Open or Closed", () => {
    // isOpen() compares strictly, so a typo like "open" would silently close a role.
    for (const role of careers.roles) {
      expect(["Open", "Closed"], role.id).toContain(role.status);
    }
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

  const jobPostings = [...page.extraHead.matchAll(/{"@context".*?}(?=\s*<\/script>)/g)]
    .map((m) => JSON.parse(m[0]))
    .filter((p) => p["@type"] === "JobPosting");

  const sectionFor = (slug: string) =>
    page.content.split(`id="${slug}"`)[1].split("</section>")[0];

  const postingFor = (id: string) => jobPostings.find((p) => p.identifier.value === id);

  it("renders every role, open or closed", () => {
    for (const role of careers.roles) {
      expect(page.content).toContain(role.title.replaceAll("&", "&amp;"));
      expect(page.content).toContain(`id="${role.slug}"`);
    }
  });

  it("emits a JobPosting for each open role and none for a closed one", () => {
    expect(jobPostings).toHaveLength(openRoles.length);
    for (const role of closedRoles) {
      expect(postingFor(role.id), role.id).toBeUndefined();
    }
  });

  it("renders A bonus only for roles that have one, in page and structured data", () => {
    expect(careers.roles.some((r) => r.bonus?.length)).toBe(true);
    for (const role of careers.roles) {
      const posting = postingFor(role.id);
      if (role.bonus?.length) {
        expect(sectionFor(role.slug), role.id).toContain("A bonus");
        if (isOpen(role)) expect(posting.description, role.id).toContain("A bonus");
        for (const item of role.bonus) {
          expect(sectionFor(role.slug)).toContain(item.replaceAll("&", "&amp;"));
        }
      } else {
        expect(sectionFor(role.slug), role.id).not.toContain("A bonus");
        if (isOpen(role)) expect(posting.description, role.id).not.toContain("A bonus");
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

  it("carries each open role's own datePosted into its JobPosting", () => {
    for (const role of openRoles) {
      expect(postingFor(role.id).datePosted, role.id).toBe(role.datePosted);
    }
  });

  it("counts only open roles in the header, split into full and part time", () => {
    const count = (type: string) =>
      openRoles.filter((r) => r.employmentType === type).length;
    const full = count("FULL_TIME");
    const part = count("PART_TIME");
    // A CONTRACTOR or INTERN role would make the header undercount. Extend
    // rolesSummary() in scripts/careers.mjs before adding one.
    expect(full + part).toBe(openRoles.length);
    expect(page.metaLine).toBe(
      `${openRoles.length} open roles · ${full} full time · ${part} part time`,
    );
  });

  // This copy once said "All remote" for a page where a role had gone hybrid.
  it("does not claim every role is remote while any open role is not", () => {
    if (openRoles.some((r) => r.remote === false)) {
      expect(page.content).not.toMatch(/all remote/i);
      expect(page.metaLine).not.toMatch(/remote/i);
    }
  });

  it("never tells Google Jobs a non-remote role is fully telecommute", () => {
    for (const role of openRoles) {
      const posting = postingFor(role.id);
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

  it("is in the sitemap", () => {
    expect(buildSitemapXml([])).toContain("https://peaklife.me/careers/");
  });
});

describe("closed roles", () => {
  const page = careersPage({ datePosted: "2026-09-10" });

  const sectionFor = (slug: string) =>
    page.content.split(`id="${slug}"`)[1].split("</section>")[0];

  it("has at least one closed role to exercise, or these tests prove nothing", () => {
    expect(closedRoles.length).toBeGreaterThan(0);
  });

  it("marks a closed role Closed and replaces its apply button with a note", () => {
    for (const role of closedRoles) {
      const section = sectionFor(role.slug);
      // The class sits on the opening tag, which sectionFor() splits off.
      expect(page.content, role.id).toContain(`<section class="role role--closed" id="${role.slug}">`);
      expect(section, role.id).toContain("role-status--closed");
      expect(section, role.id).toContain(">Closed<");
      expect(section, role.id).toContain("Applications for this role are closed.");
      expect(section, role.id).not.toContain("data-role=");
      expect(section, role.id).not.toContain("apply for this role");
    }
    for (const role of openRoles) {
      const section = sectionFor(role.slug);
      expect(page.content, role.id).toContain(`<section class="role" id="${role.slug}">`);
      expect(section, role.id).not.toContain("role-status--closed");
      expect(section, role.id).toContain(`data-role="${role.id}"`);
    }
  });

  it("offers only open roles in the form's dropdown", () => {
    const options = [...page.content.matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);
    expect(options).toEqual(openRoles.map((r) => r.id));
  });

  it("only lets the inline script preselect or title open roles", () => {
    const map = JSON.parse(page.content.match(/var ROLES = (\{.*?\});/s)![1]);
    expect(Object.keys(map)).toEqual(openRoles.map((r) => r.id));
  });

  it("does not hint at a work sample for a closed role", () => {
    for (const role of closedRoles) {
      expect(page.content).not.toContain(`${role.title}: ${role.sampleHint}`);
    }
  });

  it("shows open roles first and closed roles after", () => {
    const order = [...page.content.matchAll(/<section class="role[^"]*" id="([^"]+)"/g)].map(
      (m) => m[1],
    );
    const slugs = (roles: typeof careers.roles) => roles.map((r) => r.slug);
    expect(order).toEqual([...slugs(openRoles), ...slugs(closedRoles)]);
  });

  it("tells the visitor plainly if a role closed after their page loaded", () => {
    expect(page.content).toContain("role_closed");
  });

  it("publishes exactly which roles are open and closed for the Apps Script", () => {
    expect(careersStatusJson()).toEqual({
      open: openRoles.map((r) => r.id),
      closed: closedRoles.map((r) => r.id),
    });
  });

  it("is written to /careers/status.json by postbuild", () => {
    const postbuild = readFileSync(
      resolve(__dirname, "../../scripts/postbuild.mjs"),
      "utf8",
    );
    expect(postbuild).toContain('"careers/status.json"');
    expect(postbuild).toContain("careersStatusJson()");
  });

  it("copes with a single open role", () => {
    const only = {
      ...closeEverything(),
      roles: closeEverything().roles.map((r, i) => (i === 1 ? { ...r, status: "Open" } : r)),
    };
    const single = careersPage({ careers: only });
    expect(single.metaLine).toMatch(/^1 open role · /);
    expect(single.content).toContain("One role is open.");
    expect(single.content).toContain('id="apply-form"');
  });

  it("switches the form off when nothing is open", () => {
    const none = careersPage({ careers: closeEverything() });
    expect(none.metaLine).toBe("No open roles");
    expect(none.content).toContain("No roles are open right now.");
    expect(none.content).toContain("Nothing is open right now.");
    expect(none.content).not.toContain('id="apply-form"');
    expect(none.extraHead).not.toContain('"@type":"JobPosting"');
  });
});
