import { SeoHead } from "./SeoHead";

/** Body-only legal layout for in-app WebView (no site chrome or page title). */
export function LegalContentLayout({
  title,
  description,
  path,
  children,
}: {
  title: string;
  description: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SeoHead title={title} description={description} keywords={[]} path={path} noindex />
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-base leading-relaxed text-muted-foreground legal-prose">
          {children}
        </div>
      </main>
    </div>
  );
}
