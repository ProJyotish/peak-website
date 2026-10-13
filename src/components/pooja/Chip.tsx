import { cn } from "@/lib/utils";

type ChipProps = {
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

/** Square, mono-type toggle used across the pooja booking flow. */
export function Chip({ selected, disabled, onClick, children, className }: ChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "border px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors",
        selected
          ? "border-ink bg-ink text-parchment"
          : "border-border text-ink hover:border-gold",
        disabled && "cursor-not-allowed opacity-40 hover:border-border",
        className,
      )}
    >
      {children}
    </button>
  );
}
