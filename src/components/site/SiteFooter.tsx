import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";
import { Wordmark } from "./Wordmark";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  { label: "LinkedIn", href: SITE.social.linkedin, icon: Linkedin },
  { label: "Instagram", href: SITE.social.instagram, icon: Instagram },
  { label: "X", href: SITE.social.x, icon: XIcon },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container-peak flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Wordmark />
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.18em] text-clay"
            aria-label="Footer"
          >
            <Link to={ROUTES.contact} className="hover:text-ink transition-colors">
              Contact
            </Link>
            <Link to={ROUTES.privacy} className="hover:text-ink transition-colors">
              Privacy
            </Link>
            <Link to={ROUTES.terms} className="hover:text-ink transition-colors">
              Terms
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Peak on ${label}`}
                className="text-clay hover:text-ink transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
            © Peak {new Date().getFullYear()} · All rights reserved
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
            Built and maintained by{" "}
            <strong className="text-ink">{SITE.legalName}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
