import { describe, expect, it } from "vitest";
import {
  isReservedPagePath,
  normalizePagePath,
  urlPathFromPageRel,
} from "../../scripts/cms-paths.mjs";

describe("urlPathFromPageRel", () => {
  it("maps a root file to /slug", () => {
    expect(urlPathFromPageRel("about.md")).toBe("/about");
  });

  it("maps nested folders to nested URLs", () => {
    expect(urlPathFromPageRel("guides/saturn.md")).toBe("/guides/saturn");
  });

  it("treats index.md as the folder URL", () => {
    expect(urlPathFromPageRel("guides/index.md")).toBe("/guides");
    expect(urlPathFromPageRel("index.md")).toBe("/");
  });
});

describe("isReservedPagePath", () => {
  it("blocks app-owned routes", () => {
    expect(isReservedPagePath("/blog")).toBe(true);
    expect(isReservedPagePath("/blog/mars")).toBe(true);
    expect(isReservedPagePath("/checkout")).toBe(true);
    expect(isReservedPagePath("/tools/astrocartography")).toBe(true);
  });

  it("allows other paths", () => {
    expect(isReservedPagePath("/about")).toBe(false);
    expect(isReservedPagePath("/guides/saturn")).toBe(false);
    expect(isReservedPagePath("/tools/new-guide")).toBe(false);
  });
});

describe("normalizePagePath", () => {
  it("strips a trailing slash", () => {
    expect(normalizePagePath("/about/")).toBe("/about");
  });
});
