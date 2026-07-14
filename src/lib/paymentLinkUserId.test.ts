import { describe, expect, it } from "vitest";
import {
  decodePaymentLinkUserId,
  encodePaymentLinkUserId,
} from "./paymentLinkUserId";

const SAMPLE_UUID = "550e8400-e29b-41d4-a716-446655440000";

describe("paymentLinkUserId", () => {
  it("encodes UUID ids with region digit after first dash", () => {
    expect(encodePaymentLinkUserId(SAMPLE_UUID, "india")).toBe(
      "550e8400-0e29b-41d4-a716-446655440000",
    );
    expect(encodePaymentLinkUserId(SAMPLE_UUID, "international")).toBe(
      "550e8400-1e29b-41d4-a716-446655440000",
    );
  });

  it("decodes UUID ids with region digit after first dash", () => {
    expect(decodePaymentLinkUserId("550e8400-0e29b-41d4-a716-446655440000")).toEqual({
      userId: SAMPLE_UUID,
      region: "india",
    });
    expect(decodePaymentLinkUserId("550e8400-1e29b-41d4-a716-446655440000")).toEqual({
      userId: SAMPLE_UUID,
      region: "international",
    });
  });

  it("round-trips encoded ids", () => {
    for (const userId of [SAMPLE_UUID, "user123", "abc-def"]) {
      for (const region of ["india", "international"] as const) {
        const encoded = encodePaymentLinkUserId(userId, region);
        expect(decodePaymentLinkUserId(encoded)).toEqual({ userId, region });
      }
    }
  });
});
