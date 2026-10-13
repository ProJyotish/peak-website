import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import type { Breadcrumb } from "@/lib/pages";
import { ROUTES } from "@/lib/routes";
import { SiteBreadcrumbs } from "./SiteBreadcrumbs";
import { SiteFooter } from "./SiteFooter";
import { Wordmark } from "./Wordmark";

type SitePageLayoutProps = {
  eyebrow: string;
  title: string;
  description?: string;
  backTo?: { href: string; label: string };
  breadcrumbs?: Breadcrumb[];
  children: React.ReactNode;
  /** Wider content column for listings */
  wide?: boolean;
};

export function SitePageLayout({
  eyebrow,
  title,
  description,
  backTo = { href: ROUTES.home, label: "Home" },
  breadcrumbs,
  children,
  wide = false,
}: SitePageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* In the app's WebView the app owns navigation chrome. */}
      <header className="border-b border-border app:hidden">
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
      <main className="flex-1 py-16 md:py-20 app:py-6">
        <div className={`container-peak ${wide ? "max-w-4xl" : "max-w-3xl"}`}>
          {breadcrumbs ? (
            <div className="app:hidden">
              <SiteBreadcrumbs crumbs={breadcrumbs} />
            </div>
          ) : null}
          <p className="eyebrow mb-4 app:mb-2">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink app:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-6 text-base leading-relaxed text-muted-foreground app:mt-3">{description}</p>
          ) : null}
          <div className="mt-12 app:mt-8">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
