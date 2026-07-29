import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { ROUTES } from "@/lib/routes";
import { TOOLS } from "@/lib/tools";

const Tools = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>

      <main className="flex-1 py-16 md:py-20">
        <div className="container-peak max-w-5xl">
          <p className="eyebrow mb-4">Free tools</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink max-w-2xl">
            Place-based astrology
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Explore where your chart favors travel and relocation. Full map calculations are coming
            soon to Peak.
          </p>

          <ul className="mt-14 grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <li key={tool.slug}>
                  <Link
                    to={ROUTES.toolDetail(tool.slug)}
                    className="group flex h-full flex-col rounded-sm border border-border p-6 transition-colors hover:border-gold/50 hover:bg-gold/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/10 text-gold">
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-clay transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                    </div>
                    <h2 className="mt-5 font-display text-xl text-ink">{tool.shortTitle}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {tool.tagline}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {tool.focusAreas.slice(0, 3).map((area) => (
                        <li
                          key={area}
                          className="font-mono text-[9px] uppercase tracking-[0.16em] text-clay border border-border px-2 py-1 rounded-full"
                        >
                          {area}
                        </li>
                      ))}
                    </ul>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Tools;
