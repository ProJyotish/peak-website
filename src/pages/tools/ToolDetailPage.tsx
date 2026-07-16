import { Link, Navigate, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { AstrocartographyTool } from "@/components/tools/AstrocartographyTool";
import { ToolBirthDetailsPlaceholder } from "@/components/tools/ToolBirthDetailsPlaceholder";
import { ToolFaqList } from "@/components/tools/ToolFaqList";
import { ToolPageShell } from "@/components/tools/ToolPageShell";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { getToolBySlug } from "@/lib/tools";

const ToolDetailPage = () => {
  const { slug = "" } = useParams();
  const tool = getToolBySlug(slug);
  const whatsappUrl = import.meta.env.VITE_WHATSAPP_URL || "https://wa.me/919560057789?text=Hi";
  const isAstrocartography = slug === "astrocartography";

  if (!tool) {
    return <Navigate to={ROUTES.tools} replace />;
  }

  const Icon = tool.icon;

  return (
    <ToolPageShell
      title={tool.title}
      contentMaxWidthClassName={isAstrocartography ? "max-w-5xl" : "max-w-3xl"}
    >
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{tool.description}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {tool.focusAreas.map((area) => (
          <span
            key={area}
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink border border-ink/15 px-3 py-1.5 rounded-full bg-parchment-deep/40"
          >
            {area}
          </span>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold mb-2">
              Welcome
            </p>
            <p className="text-base leading-relaxed text-ink">{tool.welcome}</p>
          </div>
        </div>
      </div>

      {isAstrocartography ? (
        <AstrocartographyTool />
      ) : (
        <ToolBirthDetailsPlaceholder toolName={tool.shortTitle} />
      )}

      {tool.aboutTitle && tool.aboutSections && (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-ink mb-6">{tool.aboutTitle}</h2>
          <div className="space-y-6">
            {tool.aboutSections.map((section) => (
              <div key={section.title} className="border-l-2 border-gold/40 pl-5">
                <h3 className="font-display text-lg text-ink mb-2">{section.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <ToolFaqList faqs={tool.faqs} />

      <div className="mt-16 rounded-sm border border-border p-6 md:flex md:items-center md:justify-between md:gap-6">
        <div>
          <p className="font-display text-xl text-ink">Want a full reading now?</p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Peak on WhatsApp answers personalized questions from your chart — try the free trial.
          </p>
        </div>
        <Button asChild className="mt-4 md:mt-0 shrink-0 bg-gold text-ink hover:bg-gold/90">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" />
            Start on WhatsApp
          </a>
        </Button>
      </div>

      <p className="mt-10 text-center">
        <Link
          to={ROUTES.tools}
          className="font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
        >
          ← Browse all tools
        </Link>
      </p>
    </ToolPageShell>
  );
};

export default ToolDetailPage;
