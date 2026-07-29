import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { SiteFooter } from "./SiteFooter";
import { Wordmark } from "./Wordmark";

type SitePageLayoutProps = {
  eyebrow: string;
  title: string;
  description?: string;
  backTo?: { href: string; label: string };
  children: React.ReactNode;
  /** Wider content column for listings */
  wide?: boolean;
};

export function SitePageLayout({
  eyebrow,
  title,
  description,
  backTo = { href: ROUTES.home, label: "Home" },
  children,
  wide = false,
}: SitePageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={backTo.href}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backTo.label}
          </Link>
        </div>
      </header>
      <main className="flex-1 py-16 md:py-20">
        <div className={`container-peak ${wide ? "max-w-4xl" : "max-w-3xl"}`}>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">{title}</h1>
          {description ? (
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
          <div className="mt-12">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
