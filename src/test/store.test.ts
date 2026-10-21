import { describe, expect, it } from "vitest";
import { filterStoreItems, storeTags, type StoreItem } from "@/lib/store";

const item = (id: string, title: string, tags: string[], subtitle: string | null = null): StoreItem => ({
  id,
  category: "pooja",
  href: `/store/pooja/${id}`,
  title,
  subtitle,
  image: null,
  price: "₹1,100",
  meta: null,
  tags,
});

const items = [
  item("rudra", "Rudrabhishek Puja", ["shravan", "shiva"], "रुद्राभिषेक"),
  item("lakshmi", "Lakshmi Puja", ["diwali"]),
  item("mundan", "Mundan Sanskar Puja", ["sanskar"]),
  item("satya", "Satyanarayan Katha", ["purnima", "shravan"]),
];

describe("filterStoreItems", () => {
  it("matches every search word across title, Hindi title and tags", () => {
    expect(filterStoreItems(items, { q: "puja shiva" }).map((i) => i.id)).toEqual(["rudra"]);
    expect(filterStoreItems(items, { q: "रुद्र" }).map((i) => i.id)).toEqual(["rudra"]);
    expect(filterStoreItems(items, { q: "  LAKSHMI " }).map((i) => i.id)).toEqual(["lakshmi"]);
  });

  it("narrows by tag and search together", () => {
    expect(filterStoreItems(items, { tag: "shravan" }).map((i) => i.id)).toEqual(["rudra", "satya"]);
    expect(filterStoreItems(items, { tag: "shravan", q: "katha" }).map((i) => i.id)).toEqual(["satya"]);
    expect(filterStoreItems(items, {})).toHaveLength(4);
  });
});

describe("storeTags", () => {
  it("orders tags by how many items carry them", () => {
    expect(storeTags(items)[0]).toBe("shravan");
    expect(storeTags(items)).toHaveLength(5);
  });
});
