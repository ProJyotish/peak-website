import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/lib/routes";
import { Wordmark } from "@/components/site/Wordmark";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Wordmark className="mb-12" />
      <div className="text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="font-display text-4xl text-ink mb-4">Page not found</h1>
        <p className="mb-8 text-muted-foreground">That route does not exist on peaklife.me.</p>
        <Link
          to={ROUTES.home}
          className="font-mono text-xs uppercase tracking-[0.18em] text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors"
        >
          Return home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
