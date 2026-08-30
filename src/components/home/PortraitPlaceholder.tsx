export function PortraitPlaceholder({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={`flex aspect-[3/4] w-full items-center justify-center border-2 border-dashed border-gold/45 bg-gold/5 ${className}`}
      aria-label={`Placeholder portrait of ${name}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
        Photo
        <br />
        {name}
      </p>
    </div>
  );
}
