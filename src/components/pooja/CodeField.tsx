import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { normalizePoojaCode, type PoojaCodeResult } from "@/lib/pooja";

type CodeFieldProps = {
  /** Code currently being checked or applied. */
  code: string | null;
  result: PoojaCodeResult | undefined;
  checking: boolean;
  error: string | null;
  onApply: (code: string) => void;
  onRemove: () => void;
};

/** Pandit / discount code entry. A pandit code also narrows the slots to that pandit's calendar. */
export function CodeField({ code, result, checking, error, onApply, onRemove }: CodeFieldProps) {
  const [draft, setDraft] = useState(code ?? "");
  useEffect(() => setDraft(code ?? ""), [code]);

  const applied = result && result.code === code;
  if (applied) {
    return (
      <div className="flex items-start justify-between gap-4 border border-gold bg-parchment-deep/40 px-4 py-3">
        <div className="flex items-start gap-3">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink">{result.code}</p>
            {result.panditName ? (
              <p className="mt-1 text-sm text-ink">
                Your pooja will be performed by <span className="font-medium">{result.panditName}</span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Code applied</p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove code"
          className="text-clay transition-colors hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const normalized = normalizePoojaCode(draft);
  const shownError = normalized === code ? error : null;
  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (normalized) onApply(normalized);
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value.toUpperCase())}
          placeholder="Pandit or discount code"
          aria-label="Pandit or discount code"
          aria-invalid={Boolean(shownError)}
          className="max-w-xs rounded-none font-mono uppercase tracking-[0.12em]"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!normalized || checking}
          className="inline-flex items-center gap-2 border border-ink px-4 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-parchment disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          {checking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          Apply
        </button>
      </form>
      {shownError ? <p className="mt-2 text-sm text-destructive">{shownError}</p> : null}
    </div>
  );
}
