import { HOME } from "@/lib/homeCopy";
import { PhoneStack } from "@/components/home/PhoneStack";
import { TryTheAppCta } from "@/components/home/TryTheAppCta";

export function StoryBand({
  title,
  body,
  showCta = false,
  first = false,
  graphic = false,
  tone = "light",
}: {
  title: string;
  body: string;
  showCta?: boolean;
  first?: boolean;
  graphic?: boolean;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const Heading = first ? "h1" : "h2";
  const copy = (
    <div className="max-w-xl">
      <div className="mb-6 h-1 w-12 bg-gold" />
      <Heading
        className={`font-display text-3xl leading-[1.15] md:text-4xl lg:text-5xl ${dark ? "text-parchment" : "text-ink"}`}
      >
        {title}
      </Heading>
      <p
        className={`mt-6 text-base leading-relaxed md:text-lg ${dark ? "text-parchment/80" : "text-clay"}`}
      >
        {body}
      </p>
      {showCta && (
        <>
          <TryTheAppCta className="mt-10" />
          <p className="mt-6 text-sm text-clay">
            <span className="text-gold">{HOME.hero.trust.join("  ·  ")}</span>
          </p>
        </>
      )}
    </div>
  );

  return (
    <section
      className={`${first ? "pt-32 md:pt-40" : "border-t border-border pt-20 md:pt-24"} pb-20 md:pb-24 ${dark ? "bg-ink" : ""}`}
    >
      <div
        className={
          graphic
            ? "container-peak grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16"
            : "container-peak"
        }
      >
        {copy}
        {graphic && (
          <div className="flex justify-center text-ink lg:justify-end">
            <PhoneStack />
          </div>
        )}
      </div>
    </section>
  );
}
