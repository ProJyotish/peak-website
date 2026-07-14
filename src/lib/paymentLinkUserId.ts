/**
 * Payment link `pid` encoding/decoding.
 *
 * Keep in sync with ProJyotish `apps/api/src/payments/payment-link-user-id.util.ts`.
 *
 * Region digit: `0` = India, `1` = international (resolved server-side from phone).
 * - UUID ids: digit is prefixed to the segment after the first dash.
 * - Other ids: digit is appended at the end.
 */

export type PaymentLinkRegion = "india" | "international";

export type DecodedPaymentLinkUserId = {
  userId: string;
  region: PaymentLinkRegion;
};

export function paymentLinkRegionToDigit(region: PaymentLinkRegion): "0" | "1" {
  return region === "india" ? "0" : "1";
}

export function paymentLinkDigitToRegion(digit: string): PaymentLinkRegion | null {
  if (digit === "0") return "india";
  if (digit === "1") return "international";
  return null;
}

export function encodePaymentLinkUserId(
  userId: string,
  region: PaymentLinkRegion,
): string {
  const regionDigit = paymentLinkRegionToDigit(region);
  if (userId.includes("-")) {
    const parts = userId.split("-");
    parts[1] = `${regionDigit}${parts[1] ?? ""}`;
    return parts.join("-");
  }
  return `${userId}${regionDigit}`;
}

export function decodePaymentLinkUserId(raw: string): DecodedPaymentLinkUserId {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { userId: "", region: "international" };
  }

  if (trimmed.includes("-")) {
    const parts = trimmed.split("-");
    const second = parts[1] ?? "";
    const region = paymentLinkDigitToRegion(second.charAt(0));
    if (region) {
      parts[1] = second.slice(1);
      return { userId: parts.join("-"), region };
    }
    return { userId: trimmed, region: "international" };
  }

  const suffix = trimmed.slice(-1);
  const region = paymentLinkDigitToRegion(suffix);
  if (region) {
    return { userId: trimmed.slice(0, -1), region };
  }
  return { userId: trimmed, region: "international" };
}
