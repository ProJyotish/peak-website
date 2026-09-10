import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { IphoneFrame } from "@/components/site/IphoneFrame";
import { SeoHead } from "@/components/site/SeoHead";
import { SiteFooter } from "@/components/site/SiteFooter";
import { StoreDownloadButtons } from "@/components/site/StoreDownloadButtons";
import { Wordmark } from "@/components/site/Wordmark";
import peakLogo from "@/assets/peak-logo.svg";
import { HORARY } from "@/lib/horaryCopy";
import { getHoraryStoreUrls } from "@/lib/horaryStores";
import { ROUTES } from "@/lib/routes";
import { productSeoKeywords } from "@/lib/seo";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const Horary = () => {
  const stores = getHoraryStoreUrls();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SeoHead
        title="PeakLife Horary - KP Horary Astrology App"
        description={HORARY.description}
        keywords={productSeoKeywords(
          "peaklife horary",
          "kp horary astrology",
          "prashna kundli",
          "vedic horary",
          "ask one question astrology",
          "no birth chart needed",
        )}
        path={ROUTES.home}
      />

      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-border py-16 md:py-24">
          <div className="container-peak grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div {...fade}>
              
              <p className="font-display text-2xl md:text-3xl text-ink tracking-tight mb-4">
                PeakLife Horary
              </p>
              <p className="eyebrow mb-4">{HORARY.hero.eyebrow}</p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink">
                {HORARY.hero.title}
              </h1>
              <p className="mt-5 inline-flex font-mono text-xs uppercase tracking-[0.18em] text-gold border border-gold/40 bg-gold/5 px-3 py-2">
                {HORARY.hero.highlight}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-clay">{HORARY.hero.lede}</p>
              <div className="mt-10">
                <StoreDownloadButtons
                  iosUrl={stores.ios}
                  iosLabel={HORARY.download.iosLabel}
                  iosSoon={HORARY.download.iosSoon}
                  showAndroid={false}
                />
              </div>
            </motion.div>
            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.08 }}
              className="flex justify-center"
            >
              <IphoneFrame
                src="/horary/ask-screen.jpg"
                alt="PeakLife Horary app: ask a question and pick a number from 1 to 249"
              />
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-28">
          <div className="container-peak">
            <motion.div {...fade} className="max-w-3xl mb-14">
              <div className="mb-6 h-1 w-12 bg-gold" />
              <h2 className="font-display text-3xl md:text-4xl text-ink">Built for one decision at a time</h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{HORARY.description}</p>
            </motion.div>
            <div className="grid gap-6 md:grid-cols-3">
              {HORARY.pillars.map((pillar, index) => (
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
              <p className="eyebrow mb-4">{HORARY.stepsEyebrow}</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink">{HORARY.stepsHeading}</h2>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-3">
              {HORARY.steps.map((step, index) => (
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
              <h2 className="font-display text-3xl md:text-4xl text-ink">{HORARY.pricing.title}</h2>
              <p className="mt-5 text-lg leading-relaxed text-clay">{HORARY.pricing.body}</p>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border py-20 md:py-28">
          <div className="container-peak max-w-3xl">
            <motion.h2 {...fade} className="font-display text-3xl md:text-4xl text-ink mb-10">
              Frequently asked questions
            </motion.h2>
            <Accordion type="single" collapsible className="w-full">
              {HORARY.faqs.map((item, i) => (
                <AccordionItem key={item.q} value={`horary-faq-${i}`}>
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
                <img
                  src={peakLogo}
                  alt="PeakLife Horary"
                  className="h-10 w-auto brightness-0 invert"
                  width={192}
                  height={18}
                />
              </div>
              <p className="font-display text-2xl text-parchment mb-6">PeakLife Horary</p>
              <h2 className="font-display text-3xl md:text-5xl text-parchment">{HORARY.download.title}</h2>
              <p className="mt-5 text-lg text-parchment/75">{HORARY.download.subtitle}</p>
              <div className="mt-10 flex justify-center">
                <StoreDownloadButtons
                  iosUrl={stores.ios}
                  iosLabel={HORARY.download.iosLabel}
                  iosSoon={HORARY.download.iosSoon}
                  showAndroid={false}
                  tone="dark"
                  className="justify-center"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Horary;
