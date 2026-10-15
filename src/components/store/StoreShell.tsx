import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";

type StoreShellProps = {
  backTo: { href: string; label: string };
  children: React.ReactNode;
  /** Room at the bottom for a fixed action bar on phones. */
  bottomBarSpace?: boolean;
};

/** Page frame for the store; in the app's WebView the app draws the header and back arrow. */
export function StoreShell({ backTo, children, bottomBarSpace }: StoreShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border app:hidden">
        <div className="container-peak flex items-center justify-between py-5">
          <Wordmark />
          <Link
            to={backTo.href}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {backTo.label}
          </Link>
        </div>
      </header>
      <main className={`flex-1 ${bottomBarSpace ? "pb-28 lg:pb-0" : ""}`}>{children}</main>
      <SiteFooter />
    </div>
  );
}
