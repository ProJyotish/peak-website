import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { ROUTES } from "@/lib/routes";
import { ContactContent } from "@/content/contact-content";

const Contact = () => {
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
        <div className="container-peak max-w-xl">
          <ContactContent />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Contact;
