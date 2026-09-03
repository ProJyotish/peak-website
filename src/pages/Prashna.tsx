import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AppScreenshotPlaceholder } from "@/components/home/AppScreenshotPlaceholder";
import { SeoHead } from "@/components/site/SeoHead";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StoreDownloadButtons } from "@/components/site/StoreDownloadButtons";
import { Wordmark } from "@/components/site/Wordmark";
import prashnaLogo from "@/assets/prashna-logo.svg";
import { PRASHNA } from "@/lib/prashnaCopy";
import { getPrashnaStoreUrls } from "@/lib/prashnaStores";
import { ROUTES } from "@/lib/routes";
import { productSeoKeywords } from "@/lib/seo";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

function PrashnaBrand({
  className = "",
  logoClassName = "h-12 md:h-14",
  subtitleClassName = "text-clay",
}: {
  className?: string;
  logoClassName?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`} aria-label="Prashna from PeakLife">
      <img src={prashnaLogo} alt="Prashna" className={`w-auto ${logoClassName}`} />
      <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${subtitleClassName}`}>
        from PeakLife
      </p>
    </div>
  );
}

const Prashna = () => {
  const stores = getPrashnaStoreUrls();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SeoHead
        title="Prashna — KP Horary Astrology App by Peak"
        description={PRASHNA.description}
        keywords={productSeoKeywords(
          "prashna app",
          "kp horary astrology",
          "prashna kundli",
          "vedic horary",
          "ask one question astrology",
        )}
        path={ROUTES.prashna}
      />

      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Peak
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-border py-16 md:py-24">
          <div className="container-peak grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fade}>
              <PrashnaBrand className="items-start" />
              <p className="eyebrow mb-4">{PRASHNA.hero.eyebrow}</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink">
                {PRASHNA.hero.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-clay">{PRASHNA.hero.lede}</p>
              <div className="mt-10">
                <StoreDownloadButtons
                  androidUrl={stores.android}
                  iosUrl={stores.ios}
                  androidLabel={PRASHNA.download.androidLabel}
                  iosLabel={PRASHNA.download.iosLabel}
                  androidSoon={PRASHNA.download.androidSoon}
                  iosSoon={PRASHNA.download.iosSoon}
                />
              </div>
            </motion.div>
            <motion.div {...fade} transition={{ ...fade.transition, delay: 0.08 }}>
              <AppScreenshotPlaceholder label="Prashna" />
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-28">
          <div className="container-peak">
            <motion.div {...fade} className="max-w-3xl mb-14">
              <div className="mb-6 h-1 w-12 bg-gold" />
              <h2 className="font-display text-3xl md:text-4xl text-ink">Built for one decision at a time</h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{PRASHNA.description}</p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {PRASHNA.pillars.map((pillar, index) => (
                <motion.article
                  key={pillar.title}
                  {...fade}
                  transition={{ ...fade.transition, delay: index * 0.05 }}
                  className="border border-border bg-card/40 p-6 md:p-8"
                >
                  <h3 className="font-display text-xl text-ink">{pillar.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{pillar.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-parchment-deep py-20 md:py-28">
          <div className="container-peak">
            <motion.div {...fade} className="max-w-3xl mx-auto text-center mb-14">
              <p className="eyebrow mb-4">{PRASHNA.stepsEyebrow}</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink">{PRASHNA.stepsHeading}</h2>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-3">
              {PRASHNA.steps.map((step, index) => (
                <motion.div
                  key={step.n}
                  {...fade}
                  transition={{ ...fade.transition, delay: index * 0.06 }}
                  className="text-center md:text-left"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">{step.n}</p>
                  <h3 className="mt-3 font-display text-2xl text-ink">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-clay">{step.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-28">
          <div className="container-peak max-w-3xl text-center">
            <motion.div {...fade}>
              <div className="mx-auto mb-6 h-1 w-12 bg-gold" />
              <h2 className="font-display text-3xl md:text-4xl text-ink">{PRASHNA.pricing.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-clay">{PRASHNA.pricing.body}</p>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-28">
          <div className="container-peak max-w-3xl">
            <motion.h2 {...fade} className="font-display text-3xl md:text-4xl text-ink mb-10">
              Frequently asked questions
            </motion.h2>
            <Accordion type="single" collapsible className="w-full">
              {PRASHNA.faqs.map((item, i) => (
                <AccordionItem key={item.q} value={`prashna-faq-${i}`}>
                  <AccordionTrigger className="text-left font-display text-lg text-ink">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-clay">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="bg-ink py-24 md:py-32">
          <div className="container-peak max-w-3xl text-center">
            <motion.div {...fade}>
              <div className="flex justify-center mb-6">
                <PrashnaBrand subtitleClassName="text-parchment/60" />
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-parchment">{PRASHNA.download.title}</h2>
              <p className="mt-5 text-lg text-parchment/75">{PRASHNA.download.subtitle}</p>
              <div className="mt-10 flex justify-center">
                <StoreDownloadButtons
                  androidUrl={stores.android}
                  iosUrl={stores.ios}
                  androidLabel={PRASHNA.download.androidLabel}
                  iosLabel={PRASHNA.download.iosLabel}
                  androidSoon={PRASHNA.download.androidSoon}
                  iosSoon={PRASHNA.download.iosSoon}
                  tone="dark"
                  className="justify-center"
                />
              </div>
              <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-parchment/50">
                Part of the Peak family ·{" "}
                <Link to={ROUTES.home} className="text-gold hover:text-parchment transition-colors">
                  peaklife.me
                </Link>
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Prashna;
