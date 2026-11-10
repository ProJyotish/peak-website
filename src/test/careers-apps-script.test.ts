import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { careersStatusJson, loadCareers } from "../../scripts/careers.mjs";

/**
 * Runs the real scripts/apps-script/peak-careers-form.gs in a sandbox with the
 * Google services stubbed, so these tests exercise the code that gets pasted
 * into Apps Script rather than a copy of its logic.
 */

const source = readFileSync(
  resolve(__dirname, "../../scripts/apps-script/peak-careers-form.gs"),
  "utf8",
);

type Reply = { ok: boolean; code?: string; error?: string };
type Script = {
  doPost(e: unknown): { body: string };
  SETTINGS: { rolesStatusUrl: string };
};
type SiteReply = { code: number; body: string } | Error;

function loadScript(site: (url: string) => SiteReply) {
  const rows: unknown[][] = [];
  const files: string[] = [];
  const mails: unknown[] = [];
  const cache = new Map<string, string>();
  const state = { fetches: 0 };

  const sheet = {
    getLastRow: () => 1,
    appendRow: (row: unknown[]) => rows.push(row),
    getRange: () => ({ setFontWeight() {} }),
    setFrozenRows() {},
    setColumnWidth() {},
  };
  const folder = {
    getFoldersByName: () => ({ hasNext: () => false }),
    createFolder: () => folder,
    createFile: (blob: { name: string }) => {
      files.push(blob.name);
      return { getUrl: () => `https://drive.example/${blob.name}` };
    },
  };
  const spreadsheet = {
    getSheetByName: () => sheet,
    insertSheet: () => sheet,
    getId: () => "spreadsheet-id",
    getUrl: () => "https://sheet.example",
  };

  const sandbox = {
    console,
    Logger: { log() {} },
    ContentService: {
      createTextOutput: (body: string) => ({
        body,
        setMimeType() {
          return this;
        },
      }),
      MimeType: { JSON: "json" },
    },
    Utilities: {
      base64Decode: (s: string) => Array.from(Buffer.from(s, "base64")),
      newBlob: (_bytes: number[], _type: string, name: string) => ({ name }),
      formatDate: () => "2026-10-22",
    },
    SpreadsheetApp: { getActiveSpreadsheet: () => spreadsheet },
    DriveApp: {
      getFileById: () => ({ getParents: () => ({ hasNext: () => false }) }),
      getRootFolder: () => folder,
    },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    MailApp: { sendEmail: (mail: unknown) => mails.push(mail) },
    CacheService: {
      getScriptCache: () => ({
        get: (key: string) => cache.get(key) ?? null,
        put: (key: string, value: string) => cache.set(key, value),
      }),
    },
    UrlFetchApp: {
      fetch: (url: string) => {
        state.fetches += 1;
        const reply = site(url);
        if (reply instanceof Error) throw reply;
        return { getResponseCode: () => reply.code, getContentText: () => reply.body };
      },
    },
  };

  const context = vm.createContext(sandbox);
  vm.runInContext(source, context);
  const script = context as unknown as Script;

  return {
    script,
    rows,
    files,
    mails,
    state,
    post: (body: object): Reply =>
      JSON.parse(script.doPost({ postData: { contents: JSON.stringify(body) } }).body),
  };
}

const application = (roleId: string, extra: object = {}) => ({
  roleId,
  roleTitle: "Test role",
  name: "Test Person",
  email: "test@example.com",
  about: "A reasonably long paragraph about the applicant and why they fit this role.",
  cv: { name: "cv.pdf", type: "application/pdf", data: Buffer.from("cv").toString("base64") },
  sample: null,
  website: "",
  page: "https://peaklife.me/careers/",
  ...extra,
});

const careers = loadCareers();
const closedId = careers.roles.find((r: { status: string }) => r.status !== "Open").id;
const openId = careers.roles.find((r: { status: string }) => r.status === "Open").id;

// What the site really publishes, so the build and the script cannot drift apart.
const published = () => ({ code: 200, body: JSON.stringify(careersStatusJson()) });

describe("careers Apps Script: closed roles", () => {
  it("refuses a role the site marks closed, before writing anything", () => {
    const run = loadScript(published);
    const reply = run.post(application(closedId));
    expect(reply).toMatchObject({ ok: false, code: "role_closed" });
    expect(run.rows).toHaveLength(0);
    expect(run.files).toHaveLength(0);
    expect(run.mails).toHaveLength(0);
  });

  it("refuses a closed role even when the rest of the form is invalid", () => {
    // Lets a live probe be sent safely: a closed role is refused before any
    // validation or write, and an old script would reject the email instead.
    const run = loadScript(published);
    const reply = run.post(application(closedId, { email: "not-an-email" }));
    expect(reply.code).toBe("role_closed");
  });

  it("still accepts an open role", () => {
    const run = loadScript(published);
    expect(run.post(application(openId))).toEqual({ ok: true });
    expect(run.rows).toHaveLength(1);
    expect(run.files).toHaveLength(1);
    expect(run.mails).toHaveLength(1);
  });

  it("accepts a role the site does not list at all, so a brand-new role is never refused", () => {
    const run = loadScript(published);
    expect(run.post(application("PEAK-NEW-99"))).toEqual({ ok: true });
  });

  it("asks the site once and then uses its cache", () => {
    const run = loadScript(published);
    run.post(application(openId));
    run.post(application(closedId));
    run.post(application(openId));
    expect(run.state.fetches).toBe(1);
  });

  it("reads the file the build actually publishes", () => {
    const { script } = loadScript(published);
    expect(new URL(script.SETTINGS.rolesStatusUrl).pathname).toBe("/careers/status.json");
  });

  it("never spends a fetch on a bot that fills the honeypot", () => {
    const run = loadScript(published);
    expect(run.post(application(closedId, { website: "http://spam.example" }))).toEqual({
      ok: true,
    });
    expect(run.state.fetches).toBe(0);
    expect(run.rows).toHaveLength(0);
  });

  describe("fails open, so an outage on the site cannot block real applicants", () => {
    const cases: [string, (url: string) => SiteReply][] = [
      ["the site is unreachable", () => new Error("DNS failure")],
      ["the site returns an error page", () => ({ code: 503, body: "down" })],
      ["the file is not JSON", () => ({ code: 200, body: "<html>oops</html>" })],
      ["the file has no closed list", () => ({ code: 200, body: "{}" })],
    ];
    for (const [name, site] of cases) {
      it(`when ${name}`, () => {
        const run = loadScript(site);
        expect(run.post(application(closedId))).toEqual({ ok: true });
        expect(run.rows).toHaveLength(1);
      });
    }
  });
});
