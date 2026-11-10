import { formatMoney, type PoojaVariant } from "@/lib/pooja";
import { Chip } from "./Chip";

type VariantPickerProps = {
  optionName: string;
  variants: PoojaVariant[];
  value: string;
  currency: string;
  onChange: (variantId: string) => void;
};

/** Mantra / package chips for multi-variant pujas (japa, Rudrabhishek, …). */
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
