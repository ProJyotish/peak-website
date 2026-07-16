import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { ROUTES } from "@/lib/routes";

type ToolPageShellProps = {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  backTo?: { label: string; href: string };
  /** Tailwind max-width class for the content column. */
  contentMaxWidthClassName?: string;
};

export function ToolPageShell({
  eyebrow = "Tools",
  title,
  children,
  backTo = { label: "All tools", href: ROUTES.tools },
  contentMaxWidthClassName = "max-w-3xl",
}: ToolPageShellProps) {
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
        <div className={`container-peak ${contentMaxWidthClassName}`}>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">{title}</h1>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
