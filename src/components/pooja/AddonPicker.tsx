import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { formatMoney, trackPooja, type PoojaAddon, type SelectedAddon } from "@/lib/pooja";
import { cn } from "@/lib/utils";
import { Chip } from "./Chip";

type AddonPickerProps = {
  addons: PoojaAddon[];
  /** Puja's Brahmin count — preselects per-Brahmin variants (e.g. Vastra Danam). */
  brahmins: number | null;
  slug: string;
  value: SelectedAddon[];
  onChange: (value: SelectedAddon[]) => void;
};

const MAX_QTY = 20;

function leadingNumber(text: string): number | null {
  const m = /^\s*(\d+)/.exec(text);
  return m ? Number(m[1]) : null;
}

function defaultVariant(addon: PoojaAddon, brahmins: number | null) {
  if (brahmins) {
    const match = addon.variants.find((v) => leadingNumber(v.title) === brahmins);
    if (match) return match;
  }
  return addon.variants[0];
}

const isDefaultTitle = (title: string) => title === "Default Title";

/** Variants that are all counts ("1 Brahman" … "20 Brahmans"), sorted; null when not count-encoded. */
function countVariants(addon: PoojaAddon) {
  const counted = addon.variants.map((v) => ({ variant: v, count: leadingNumber(v.title) }));
  if (counted.length <= 3 || counted.some((c) => c.count === null)) return null;
  return (counted as Array<{ variant: PoojaAddon["variants"][number]; count: number }>).sort(
    (a, b) => a.count - b.count,
  );
}

const stepButton =
  "border border-border p-1.5 hover:border-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border";

function NumberStepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  const commit = () => {
    const n = Number(draft);
    if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, Math.round(n))));
    else setDraft(String(value));
  };
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">{label}</span>
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={stepButton}
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft}
        aria-label={label}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="w-14 border border-border bg-transparent py-1 text-center font-mono text-sm [appearance:textfield] focus:border-gold focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={stepButton}
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function AddonPicker({ addons, brahmins, slug, value, onChange }: AddonPickerProps) {
  const selectedFor = (addonId: string) => value.find((s) => s.addonId === addonId);

  const update = (addonId: string, next: SelectedAddon | null) => {
    const rest = value.filter((s) => s.addonId !== addonId);
    onChange(next ? [...rest, next] : rest);
  };

  const toggle = (addon: PoojaAddon) => {
    if (selectedFor(addon.id)) return update(addon.id, null);
    const variant = defaultVariant(addon, brahmins);
    trackPooja("pooja_addon_selected", { slug, addon: addon.title, variant: variant.title });
    update(addon.id, { addonId: addon.id, variantId: variant.numericId, quantity: 1 });
  };

  if (!addons.length) return null;

  return (
    <div className="space-y-3">
      {addons.map((addon) => {
        const selected = selectedFor(addon.id);
        const variant = selected
          ? addon.variants.find((v) => v.numericId === selected.variantId)
          : defaultVariant(addon, brahmins);
        const counts = countVariants(addon);
        const showVariants = !counts && addon.variants.length > 1 && !isDefaultTitle(addon.variants[0].title);
        // Variants like "5 Brahmans" already encode the count; a quantity would double it.
        const showQuantity = !addon.variants.some((v) => leadingNumber(v.title) !== null);
        return (
          <div
            key={addon.id}
            className={cn(
              "border p-4 transition-colors md:p-5",
              selected ? "border-gold bg-parchment-deep/40" : "border-border",
            )}
          >
            <label className="flex cursor-pointer items-start gap-4">
              <input
                type="checkbox"
                checked={Boolean(selected)}
                onChange={() => toggle(addon)}
                className="mt-1 h-4 w-4 accent-[hsl(var(--gold))]"
              />
              {addon.image ? (
                <img
                  src={addon.image.url}
                  alt={addon.image.altText ?? addon.title}
                  className="h-14 w-14 shrink-0 object-cover"
                  loading="lazy"
                />
              ) : null}
              <span className="flex-1">
                <span className="block font-display text-lg text-ink">{addon.title}</span>
                {addon.titleHi ? <span className="block text-sm text-clay">{addon.titleHi}</span> : null}
              </span>
              {variant ? (
                <span className="font-mono text-sm text-ink">{formatMoney(variant.price, addon.currency)}</span>
              ) : null}
            </label>

            {selected ? (
              <div className="mt-4 space-y-3 pl-8">
                {counts ? (
                  <NumberStepper
                    label={addon.optionName}
                    value={counts.find((c) => c.variant.numericId === selected.variantId)?.count ?? counts[0].count}
                    min={counts[0].count}
                    max={counts[counts.length - 1].count}
                    onChange={(n) => {
                      // Snap to the nearest count Shopify actually offers.
                      const next = counts.reduce((best, c) =>
                        Math.abs(c.count - n) < Math.abs(best.count - n) ? c : best,
                      );
                      update(addon.id, { ...selected, variantId: next.variant.numericId });
                    }}
                  />
                ) : null}
                {showVariants ? (
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">{addon.optionName}</p>
                    <div className="flex flex-wrap gap-2">
                      {addon.variants.map((v) => (
                        <Chip
                          key={v.id}
                          selected={v.numericId === selected.variantId}
                          onClick={() => update(addon.id, { ...selected, variantId: v.numericId })}
                        >
                          {v.title} · {formatMoney(v.price, addon.currency)}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : null}
                {showQuantity ? (
                  <NumberStepper
                    label="Qty"
                    value={selected.quantity}
                    min={1}
                    max={MAX_QTY}
                    onChange={(quantity) => update(addon.id, { ...selected, quantity })}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
