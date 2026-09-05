export function AppScreenshotPlaceholder({
  label,
  className = "",
  tone = "light",
}: {
  label: string;
  className?: string;
  tone?: "light" | "dark";
}) {
  const shell =
    tone === "dark"
      ? "border-gold/70 bg-ink/40 text-gold"
      : "border-gold/50 bg-gold/5 text-gold";

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`mx-auto flex h-[420px] w-[210px] items-center justify-center rounded-[36px] border-2 border-dashed px-6 text-center ${shell}`}
        aria-label={`Placeholder for ${label} app screenshot`}
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em]">
          App screenshot
          <br />
          {label}
        </p>
      </div>
    </div>
  );
}
