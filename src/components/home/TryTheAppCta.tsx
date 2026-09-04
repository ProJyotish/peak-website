import { HOME } from "@/lib/homeCopy";
import { SITE } from "@/lib/site";
import { withUtm } from "@/lib/utm";

export function TryTheAppCta({
  className = "",
  tone = "light",
  utmContent = "try_the_app",
}: {
  className?: string;
  tone?: "light" | "dark";
  utmContent?: string;
}) {
  const colors =
    tone === "dark"
      ? "bg-gold text-ink hover:bg-parchment"
      : "bg-ink text-parchment hover:bg-gold hover:text-ink";

  return (
    <a
      href={withUtm(SITE.app, utmContent)}
      className={`inline-flex items-center justify-center px-10 py-4 font-mono text-xs uppercase tracking-[0.18em] shadow-[0_10px_30px_-12px_hsl(24_15%_9%_/_0.45)] transition-all duration-300 hover:-translate-y-0.5 ${colors} ${className}`}
    >
      {HOME.hero.navCta}
    </a>
  );
}
