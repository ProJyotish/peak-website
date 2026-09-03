import { trackEvent } from "@/lib/tracking";

type StoreDownloadButtonsProps = {
  androidUrl: string | null;
  iosUrl: string | null;
  androidLabel?: string;
  iosLabel?: string;
  androidSoon?: string;
  iosSoon?: string;
  tone?: "light" | "dark";
  className?: string;
};

function StoreButton({
  href,
  label,
  soonLabel,
  platform,
  tone,
}: {
  href: string | null;
  label: string;
  soonLabel: string;
  platform: "android" | "ios";
  tone: "light" | "dark";
}) {
  const enabled = Boolean(href);
  const base =
    tone === "dark"
      ? "border-parchment/30 text-parchment hover:border-gold hover:text-gold"
      : "border-border text-ink hover:border-gold hover:text-gold";
  const disabled =
    tone === "dark"
      ? "border-parchment/15 text-parchment/40 cursor-not-allowed"
      : "border-border/80 text-muted-foreground cursor-not-allowed";

  const content = (
    <span className="flex flex-col items-start gap-1">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-70">
        {platform === "android" ? "Android" : "iOS"}
      </span>
      <span className="font-display text-lg leading-tight">{enabled ? label : soonLabel}</span>
    </span>
  );

  if (!enabled) {
    return (
      <div
        className={`inline-flex min-w-[220px] items-center justify-center border px-6 py-4 ${disabled}`}
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <a
      href={href!}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("prashna_store_click", { platform })}
      className={`inline-flex min-w-[220px] items-center justify-center border px-6 py-4 transition-colors ${base}`}
    >
      {content}
    </a>
  );
}

export function StoreDownloadButtons({
  androidUrl,
  iosUrl,
  androidLabel = "Get it on Google Play",
  iosLabel = "Download on the App Store",
  androidSoon = "Coming soon on Google Play",
  iosSoon = "Coming soon on the App Store",
  tone = "light",
  className = "",
}: StoreDownloadButtonsProps) {
  return (
    <div className={`flex flex-wrap items-stretch gap-4 ${className}`}>
      <StoreButton
        href={androidUrl}
        label={androidLabel}
        soonLabel={androidSoon}
        platform="android"
        tone={tone}
      />
      <StoreButton
        href={iosUrl}
        label={iosLabel}
        soonLabel={iosSoon}
        platform="ios"
        tone={tone}
      />
    </div>
  );
}
