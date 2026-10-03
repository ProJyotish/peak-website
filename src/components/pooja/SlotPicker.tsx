import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  fetchPoojaSlots,
  PREFERRED_WINDOWS,
  type PoojaSchedule,
  type PreferredWindow,
} from "@/lib/pooja";
import { Chip } from "./Chip";

type SlotPickerProps = {
  slug: string;
  /** Validated pandit code: slots come from that pandit's calendar. */
  code?: string | null;
  panditName?: string | null;
  value: PoojaSchedule | null;
  onChange: (value: PoojaSchedule | null) => void;
};

const IST = "Asia/Kolkata";
const MAX_PREFERRED_DAYS = 180;

function istDate(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: IST }).format(d);
}

/** `YYYY-MM-DD` (an IST calendar day) as a local-midnight Date for the day picker, and back. */
function toPickerDate(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function fromPickerDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function longDayLabel(ymd: string) {
  return new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(
    toPickerDate(ymd),
  );
}

function timeLabel(iso: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone }).format(
    new Date(iso),
  );
}

const calendarClassNames = {
  day_selected: "bg-ink text-parchment hover:bg-ink hover:text-parchment focus:bg-ink focus:text-parchment",
  day_today: "border border-gold",
};

function PickerFrame({ children }: { children: React.ReactNode }) {
  return <div className="w-fit border border-border bg-background">{children}</div>;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">{children}</p>;
}

/** Live Appointo slots when the puja is bookable; otherwise a preferred date + time window. */
export function SlotPicker({ slug, code = null, panditName = null, value, onChange }: SlotPickerProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["pooja-slots", slug, code],
    queryFn: () => fetchPoojaSlots(slug, code),
    staleTime: 60_000,
  });

  const days = useMemo(
    () => (data?.days ?? []).filter((d) => d.slots.some((s) => s.available)),
    [data],
  );
  const [activeDay, setActiveDay] = useState<string | null>(null);
  useEffect(() => {
    if (!activeDay || !days.some((d) => d.date === activeDay)) setActiveDay(days[0]?.date ?? null);
  }, [days, activeDay]);

  const [preferredDate, setPreferredDate] = useState("");
  const [preferredWindow, setPreferredWindow] = useState<PreferredWindow | null>(null);
  useEffect(() => {
    if (data?.mode !== "manual") return;
    onChange(preferredDate && preferredWindow ? { mode: "manual", preferredDate, preferredWindow } : null);
    // onChange is a stable setter from the parent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.mode, preferredDate, preferredWindow]);

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking availability…
      </p>
    );
  }
  if (isError || !data) {
    return (
      <p className="text-sm text-muted-foreground">
        Couldn't load availability.{" "}
        <button type="button" className="underline hover:text-ink" onClick={() => refetch()}>
          Try again
        </button>
      </p>
    );
  }

  if (data.mode === "manual") {
    const today = toPickerDate(istDate(new Date()));
    const max = toPickerDate(istDate(new Date(Date.now() + MAX_PREFERRED_DAYS * 86400_000)));
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Pick a preferred date and time of day. Our team will confirm the exact muhurat with you.
        </p>
        <div className="flex flex-col gap-8 sm:flex-row">
          <div>
            <FieldLabel>Preferred date</FieldLabel>
            <PickerFrame>
              <Calendar
                mode="single"
                selected={preferredDate ? toPickerDate(preferredDate) : undefined}
                onSelect={(d) => setPreferredDate(d ? fromPickerDate(d) : "")}
                disabled={[{ before: today }, { after: max }]}
                fromMonth={today}
                toMonth={max}
                classNames={calendarClassNames}
              />
            </PickerFrame>
          </div>
          <div>
            <FieldLabel>Time of day</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {PREFERRED_WINDOWS.map((w) => (
                <Chip key={w} selected={preferredWindow === w} onClick={() => setPreferredWindow(w)}>
                  {w}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!days.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {panditName
          ? `${panditName} has no open slots in the next two weeks. Remove the code to see all pandits' slots.`
          : "No slots are open in the next two weeks. Please check back soon."}
      </p>
    );
  }

  const openDates = new Set(days.map((d) => d.date));
  const selectedStart = value?.mode === "appointo" ? value.startTime : null;
  const slots = days.find((d) => d.date === activeDay)?.slots ?? [];
  const first = toPickerDate(days[0].date);
  const last = toPickerDate(days[days.length - 1].date);

  return (
    <div className="flex flex-col gap-8 sm:flex-row">
      <div>
        <FieldLabel>Date</FieldLabel>
        <PickerFrame>
          <Calendar
            mode="single"
            required
            selected={activeDay ? toPickerDate(activeDay) : undefined}
            onSelect={(d) => d && setActiveDay(fromPickerDate(d))}
            disabled={(d) => !openDates.has(fromPickerDate(d))}
            defaultMonth={first}
            fromMonth={first}
            toMonth={last}
            classNames={calendarClassNames}
          />
        </PickerFrame>
      </div>
      <div className="min-w-0 flex-1">
        <FieldLabel>{activeDay ? longDayLabel(activeDay) : "Time"}</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {slots.map((s) => (
            <Chip
              key={s.startTime}
              disabled={!s.available}
              selected={selectedStart === s.startTime}
              onClick={() => onChange({ mode: "appointo", startTime: s.startTime })}
            >
              {timeLabel(s.startTime, IST)}
            </Chip>
          ))}
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          Times shown in IST
        </p>
      </div>
    </div>
  );
}
