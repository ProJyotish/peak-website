import { useEffect, useId, useRef, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  fetchLocationAutocomplete,
  type LocationPrediction,
} from "@/lib/astroApi";
import { cn } from "@/lib/utils";

type LocationAutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (prediction: LocationPrediction) => void;
  /** Fired when user presses Enter with free text (no suggestion pick). */
  onSubmitText?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  /** Clear the field after a suggestion is chosen (chip workflows). */
  clearOnSelect?: boolean;
  /** Keep the menu open after a pick (multi-city flows). */
  keepOpenOnSelect?: boolean;
};

export function LocationAutocompleteInput({
  value,
  onChange,
  onSelect,
  onSubmitText,
  placeholder = "Start typing a city…",
  required,
  className,
  inputClassName,
  clearOnSelect = false,
  keepOpenOnSelect = false,
}: LocationAutocompleteInputProps) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  /** Skip the next autocomplete fetch (right after a pick). */
  const suppressFetchRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);

  useEffect(() => {
    if (suppressFetchRef.current) {
      suppressFetchRef.current = false;
      setPredictions([]);
      setLoading(false);
      return;
    }

    const q = value.trim();
    if (q.length < 2) {
      setPredictions([]);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    setLoading(true);
    const timer = window.setTimeout(() => {
      void fetchLocationAutocomplete(q)
        .then((list) => {
          if (requestId !== requestIdRef.current) return;
          setPredictions(list);
          setOpen(list.length > 0);
        })
        .catch(() => {
          if (requestId !== requestIdRef.current) return;
          setPredictions([]);
        })
        .finally(() => {
          if (requestId === requestIdRef.current) setLoading(false);
        });
    }, 280);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value]);

  useEffect(() => {
    const onDocPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, []);

  const pick = (p: LocationPrediction) => {
    suppressFetchRef.current = true;
    requestIdRef.current += 1; // invalidate in-flight fetches
    onSelect?.(p);
    if (clearOnSelect) {
      onChange("");
      setPredictions([]);
      if (keepOpenOnSelect) {
        setOpen(false);
        queueMicrotask(() => inputRef.current?.focus());
      } else {
        setOpen(false);
      }
    } else {
      onChange(p.description);
      setPredictions([]);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            suppressFetchRef.current = false;
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (predictions.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (predictions[0] && open) {
                pick(predictions[0]);
                return;
              }
              const text = value.trim();
              if (text) {
                suppressFetchRef.current = clearOnSelect;
                onSubmitText?.(text);
                if (clearOnSelect) {
                  onChange("");
                  setPredictions([]);
                  setOpen(false);
                  queueMicrotask(() => inputRef.current?.focus());
                }
              }
            }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className={cn(
            "w-full border border-border bg-card px-3 py-2 pr-9 text-sm",
            inputClassName,
          )}
        />
        {loading ? (
          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink/40" />
        ) : null}
      </div>
      {open && predictions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-40 mt-1 max-h-56 w-full overflow-auto border border-border bg-card shadow-md"
        >
          {predictions.map((p) => (
            <li key={p.placeId || p.description} role="option">
              <button
                type="button"
                className="w-full px-3 py-2.5 text-left text-sm hover:bg-gold/15"
                onPointerDown={(e) => {
                  // Commit on pointerdown so blur/outside handlers can't steal the pick.
                  e.preventDefault();
                  e.stopPropagation();
                  pick(p);
                }}
              >
                {p.description}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

type PreferredPlacesFieldProps = {
  places: string[];
  onChange: (places: string[]) => void;
};

export function PreferredPlacesField({
  places,
  onChange,
}: PreferredPlacesFieldProps) {
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const name = raw.trim();
    if (!name) return;
    const exists = places.some((p) => p.toLowerCase() === name.toLowerCase());
    if (!exists) onChange([...places, name]);
    setDraft("");
  };

  const remove = (name: string) => {
    onChange(places.filter((p) => p !== name));
  };

  return (
    <div className="space-y-2">
      {places.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {places.map((p) => (
            <li
              key={p}
              className="inline-flex max-w-full items-center gap-1 border border-border bg-card px-2 py-1 text-sm"
            >
              <span className="truncate">{p}</span>
              <button
                type="button"
                aria-label={`Remove ${p}`}
                className="shrink-0 text-ink/45 hover:text-ink"
                onClick={() => remove(p)}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <LocationAutocompleteInput
        value={draft}
        onChange={setDraft}
        clearOnSelect
        keepOpenOnSelect
        placeholder="Search and add cities…"
        onSelect={(p) => add(p.description)}
        onSubmitText={add}
      />
      <p className="text-xs text-ink/50">
        Select from the dropdown to add each city. Add as many as you like.
      </p>
    </div>
  );
}
