import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { SITE } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

const Contact = () => {
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || "https://wa.me/919560057789?text=Hi";
  const emailSubject = "Peak - Contact";
  const mailtoLink = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(emailSubject)}`;

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
          <p className="eyebrow mb-4">Contact</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">Get in touch</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Questions about Peak, partnerships, press, or support - reach out through email or WhatsApp.
          </p>

          <div className="mt-12 space-y-6">
            <a
              href={mailtoLink}
              className="flex items-center gap-4 p-6 border-2 border-gold bg-gold/5 rounded-sm hover:bg-gold/10 transition-colors group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold mb-1">Email</p>
                <p className="text-ink font-medium">{SITE.contactEmail}</p>
              </div>
              <p className="hidden sm:block font-mono text-xs uppercase tracking-[0.18em] text-clay group-hover:text-ink transition-colors">
                Send →
              </p>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-6 border border-border rounded-sm hover:border-gold transition-colors group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold group-hover:bg-gold group-hover:text-ink transition-colors">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-clay mb-1">WhatsApp</p>
                <p className="text-ink">Chat with us instantly</p>
              </div>
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Contact;
