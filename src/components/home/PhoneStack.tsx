/** Three outlined phone frames, stacked as in the PDF hero. */
export function PhoneStack({
  className = "",
}: {
  className?: string;
}) {
  const frames = [
    "border-ink/40 bg-parchment-deep/80",
    "border-gold bg-gold/10 border-2",
    "border-ink bg-parchment",
  ];

  return (
    <div
      className={`relative mx-auto h-[340px] w-[260px] md:h-[400px] md:w-[300px] ${className}`}
      aria-hidden
    >
      {frames.map((tone, i) => (
        <div
          key={i}
          className={`absolute h-[260px] w-[128px] rounded-[28px] md:h-[300px] md:w-[148px] ${tone}`}
          style={{
            top: `${i * 28}px`,
            left: `${i * 40}px`,
          }}
        />
      ))}
    </div>
  );
}
