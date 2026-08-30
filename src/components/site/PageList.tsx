import { Link } from "react-router-dom";

export type PageListItem = {
  href: string;
  title: string;
  excerpt?: string;
  eyebrow?: string;
  meta?: string;
};

export function PageList({ items }: { items: PageListItem[] }) {
  if (!items.length) return null;

  return (
    <div className="grid gap-6">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className="group block border border-border bg-card/40 p-6 md:p-8 transition-colors hover:border-gold"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
            {item.eyebrow ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                {item.eyebrow}
              </span>
            ) : null}
            {item.meta ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
                {item.meta}
              </span>
            ) : null}
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-ink group-hover:text-gold transition-colors">
            {item.title}
          </h2>
          {item.excerpt ? (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.excerpt}</p>
          ) : null}
          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-clay group-hover:text-ink transition-colors">
            Read →
          </p>
        </Link>
      ))}
    </div>
  );
}
