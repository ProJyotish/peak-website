import { Link } from "react-router-dom";
import { SITE } from "@/lib/site";
import { type Breadcrumb, publicUrl } from "@/lib/pages";

type SiteBreadcrumbsProps = {
  crumbs: Breadcrumb[];
};

export function SiteBreadcrumbs({ crumbs }: SiteBreadcrumbsProps) {
  if (crumbs.length < 2) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: publicUrl(crumb.href, `https://${SITE.domain}`),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
          {crumbs.map((crumb, index) => (
            <li key={`${crumb.href}-${index}`} className="inline-flex items-center gap-2">
              {index > 0 ? <span aria-hidden className="text-clay/50">/</span> : null}
              {crumb.current ? (
                <span className="text-ink" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.href} className="hover:text-ink transition-colors">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
