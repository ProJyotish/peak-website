import { ChevronDown } from "lucide-react";

/** Collapsible product-page section; `<details>` so it works before hydration. */
export function ProductSection({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}
