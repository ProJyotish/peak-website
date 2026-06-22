import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { LEGAL_LAST_UPDATED } from "@/lib/site";
import { SiteFooter } from "./SiteFooter";
import { Wordmark } from "./Wordmark";

type LegalLayoutProps = {
  title: string;
  children: React.ReactNode;
};

export function LegalLayout({ title, children }: LegalLayoutProps) {
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
        <article className="container-peak max-w-3xl">
          <p className="eyebrow mb-4">Legal</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">{title}</h1>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
            Last updated · {LEGAL_LAST_UPDATED}
          </p>
          <div className="mt-12 space-y-8 text-base leading-relaxed text-muted-foreground legal-prose">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSubsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h3 className="font-display text-xl text-ink mb-2">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-2xl text-ink mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
