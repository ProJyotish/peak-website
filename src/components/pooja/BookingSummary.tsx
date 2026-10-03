import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  createPoojaCheckout,
  formatMoney,
  trackPooja,
  type Pooja,
  type PoojaAddon,
  type PoojaCodeResult,
  type PoojaSchedule,
  type SelectedAddon,
} from "@/lib/pooja";

type BookingSummaryProps = {
  puja: Pooja;
  addons: PoojaAddon[];
  selectedAddons: SelectedAddon[];
  schedule: PoojaSchedule | null;
  /** Applied pandit/discount code; its discount is priced by Shopify for this cart. */
  code?: PoojaCodeResult | null;
};

const PHONE_RE = /^\+?[\d\s()-]{10,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function scheduleLabel(schedule: PoojaSchedule | null): string {
  if (!schedule) return "Not selected";
  if (schedule.mode === "manual") {
    const d = new Date(`${schedule.preferredDate}T00:00:00Z`);
    const day = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(d);
    return `${day} · ${schedule.preferredWindow} (to be confirmed)`;
  }
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(schedule.startTime));
}

/** Contact capture + order summary; hands off to Shopify checkout (draft-order invoice). */
export function BookingSummary({ puja, addons, selectedAddons, schedule, code = null }: BookingSummaryProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const lines = selectedAddons.flatMap((s) => {
    const addon = addons.find((a) => a.id === s.addonId);
    const variant = addon?.variants.find((v) => v.numericId === s.variantId);
    if (!addon || !variant) return [];
    const variantLabel =
      variant.title === "Default Title" || addon.variants.length === 1 ? "" : ` · ${variant.title}`;
    return [{ key: addon.id, label: `${addon.title}${variantLabel}`, quantity: s.quantity, amount: variant.price * s.quantity }];
  });
  const subtotal = puja.price + lines.reduce((sum, l) => sum + l.amount, 0);
  const discount = Math.min(code?.discountAmount ?? 0, subtotal);
  const total = subtotal - discount;

  const phoneValid = PHONE_RE.test(phone.trim()) && phone.replace(/\D/g, "").length >= 10;
  const emailValid = !email.trim() || EMAIL_RE.test(email.trim());
  const ready = Boolean(schedule) && phoneValid && emailValid;

  const checkout = useMutation({
    mutationFn: () =>
      createPoojaCheckout({
        slug: puja.slug,
        ...(schedule?.mode === "appointo" ? { startTime: schedule.startTime } : {}),
        ...(schedule?.mode === "manual"
          ? { preferredDate: schedule.preferredDate, preferredWindow: schedule.preferredWindow }
          : {}),
        addons: selectedAddons.map((s) => ({ variantId: s.variantId, quantity: s.quantity })),
        phone: phone.trim(),
        ...(email.trim() ? { email: email.trim() } : {}),
        ...(name.trim() ? { name: name.trim() } : {}),
        ...(code ? { code: code.code } : {}),
      }),
    onSuccess: (res) => {
      trackPooja("pooja_checkout_started", {
        slug: puja.slug,
        value: res.total.amount,
        currency: res.total.currency,
        addons: selectedAddons.length,
        schedule_mode: schedule?.mode,
      });
      window.location.assign(res.invoiceUrl);
    },
  });

  return (
    <div className="border border-border bg-background p-6 md:p-7">
      <p className="eyebrow mb-5">Your booking</p>

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-ink">{puja.title}</dt>
          <dd className="font-mono">{formatMoney(puja.price, puja.currency)}</dd>
        </div>
        {lines.map((l) => (
          <div key={l.key} className="flex justify-between gap-4 text-muted-foreground">
            <dt>
              {l.label}
              {l.quantity > 1 ? ` × ${l.quantity}` : ""}
            </dt>
            <dd className="font-mono">{formatMoney(l.amount, puja.currency)}</dd>
          </div>
        ))}
        {code && discount > 0 ? (
          <div className="flex justify-between gap-4 text-gold">
            <dt>Code {code.code}</dt>
            <dd className="font-mono">−{formatMoney(discount, puja.currency)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-border pt-3">
          <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">Schedule</dt>
          <dd className="text-right text-ink">{scheduleLabel(schedule)}</dd>
        </div>
        {code?.panditName ? (
          <div className="flex justify-between gap-4">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">Pandit</dt>
            <dd className="text-right text-ink">{code.panditName}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4 border-t border-border pt-3 text-base">
          <dt className="font-display text-ink">Total</dt>
          <dd className="font-mono text-ink">{formatMoney(total, puja.currency)}</dd>
        </div>
      </dl>

      <div className="mt-6 space-y-3">
        <Input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-none" autoComplete="name" />
        <Input
          placeholder="WhatsApp number *"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-none"
          autoComplete="tel"
          aria-invalid={Boolean(phone) && !phoneValid}
        />
        <Input
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-none"
          autoComplete="email"
          aria-invalid={!emailValid}
        />
        <p className="text-xs text-muted-foreground">
          We'll send the pooja link and instructions on WhatsApp.
        </p>
      </div>

      {checkout.isError ? (
        <p className="mt-4 text-sm text-destructive">{(checkout.error as Error).message}</p>
      ) : null}

      <button
        type="button"
        disabled={!ready || checkout.isPending || checkout.isSuccess}
        onClick={() => checkout.mutate()}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-parchment transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink disabled:hover:text-parchment"
      >
        {checkout.isPending || checkout.isSuccess ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Lock className="h-3.5 w-3.5" />
        )}
        Proceed to payment
      </button>
      {!schedule ? (
        <p className="mt-3 text-center text-xs text-muted-foreground">Choose a date and time to continue.</p>
      ) : null}
    </div>
  );
}
