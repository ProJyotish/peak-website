import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import { isHorarySite } from "@/lib/siteMode";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";
import { Wordmark } from "./Wordmark";

const socialLinks = [
  { label: "LinkedIn", href: SITE.social.linkedin, icon: Linkedin },
  { label: "Instagram", href: SITE.social.instagram, icon: Instagram },
] as const;

export function SiteFooter() {
  const brand = isHorarySite ? "PeakLife Horary" : "Peak";

  return (
    <footer className="border-t border-ink bg-ink py-10 text-parchment">
      <div className="container-peak flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Wordmark className="brightness-0 invert" />
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-parchment/70"
            aria-label="Footer"
          >
            {!isHorarySite && (
              <Link to={ROUTES.product} className="hover:text-gold transition-colors">
                Product
              </Link>
            )}
            <Link to={ROUTES.contact} className="hover:text-gold transition-colors">
              Contact
            </Link>
            <Link to={ROUTES.privacy} className="hover:text-gold transition-colors">
              Privacy
            </Link>
            <Link to={ROUTES.terms} className="hover:text-gold transition-colors">
              Terms
            </Link>
          </nav>
          {!isHorarySite && (
            <div className="flex items-center gap-4">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${brand} on ${label}`}
                  className="text-parchment/70 hover:text-gold transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-parchment/60">
            © {brand} {new Date().getFullYear()} · All rights reserved
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-parchment/60">
            Built and maintained by{" "}
            <strong className="text-gold">{SITE.legalName}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
