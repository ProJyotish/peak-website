import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { formatMoney, type PoojaVariant } from "@/lib/pooja";
import { Chip } from "./Chip";

type VariantPickerProps = {
  optionName: string;
  variants: PoojaVariant[];
  value: string;
  currency: string;
  onChange: (variantId: string) => void;
};

const stepButton =
  "border border-border p-1.5 hover:border-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border";

export function NumberStepper({
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

/** Mantra / package chips for multi-variant pujas. */
export function VariantPicker({ optionName, variants, value, currency, onChange }: VariantPickerProps) {
  if (variants.length <= 1) return null;
  const showPrices = new Set(variants.map((v) => v.price)).size > 1;
  return (
    <div>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">{optionName}</p>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <Chip key={v.id} selected={v.id === value || v.numericId === value} onClick={() => onChange(v.id)}>
            {v.title}
            {showPrices ? (
              <span className="ml-2 opacity-70 normal-case tracking-normal">
                {formatMoney(v.price, currency)}
              </span>
            ) : null}
          </Chip>
        ))}
      </div>
    </div>
  );
}
