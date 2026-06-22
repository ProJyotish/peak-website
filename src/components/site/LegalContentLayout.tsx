/** Body-only legal layout for in-app WebView (no site chrome or page title). */
export function LegalContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-base leading-relaxed text-muted-foreground legal-prose">
          {children}
        </div>
      </main>
    </div>
  );
}
