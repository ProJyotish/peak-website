import { motion } from "framer-motion";
import { ArrowRight, Quote } from "lucide-react";
import { AppScreenshotPlaceholder } from "@/components/home/AppScreenshotPlaceholder";
import { PortraitPlaceholder } from "@/components/home/PortraitPlaceholder";
import { StoryBand } from "@/components/home/StoryBand";
import { TryTheAppCta } from "@/components/home/TryTheAppCta";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HOME } from "@/lib/homeCopy";
import { SITE } from "@/lib/site";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Nav() {
  return (
    <header className="absolute top-0 left-0 right-0 z-30">
      <div className="container-peak flex items-center justify-between py-6">
        <Wordmark />
        <nav className="flex items-center gap-8">
          <a href="#how" className="hidden md:inline text-sm text-clay hover:text-gold transition-colors">
            How it works
          </a>
          <a href="#faq" className="hidden md:inline text-sm text-clay hover:text-gold transition-colors">
            FAQ
          </a>
          <a
            href={SITE.app}
            className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-parchment hover:bg-gold hover:text-ink transition-colors"
          >
            Try The App
          </a>
        </nav>
      </div>
    </header>
  );
}

function Opening() {
  return (
    <>
      <StoryBand
        first
        showCta
        graphic
        title={HOME.hero.manualTitle}
        body={HOME.hero.manualBody}
      />
      <StoryBand tone="dark" title={HOME.hero.title} body={HOME.hero.lede} />
    </>
  );
}

function Products() {
  return (
    <section id="product" className="border-t border-border">
      {HOME.products.map((product, i) => {
        const dark = i % 2 === 1;
        const phonesLeft = dark;
        const copy = (
          <div className="max-w-xl">
            <p className="eyebrow mb-3">{product.name}</p>
            <h3 className={`font-display text-2xl md:text-4xl leading-tight ${dark ? "text-parchment" : "text-ink"}`}>
              {product.title}
            </h3>
            <p className={`mt-4 text-base leading-relaxed md:text-lg ${dark ? "text-parchment/75" : "text-clay"}`}>
              {product.summary}
            </p>
            <p className={`mt-3 text-sm leading-relaxed ${dark ? "text-parchment/60" : "text-muted-foreground"}`}>
              {product.detail}
            </p>
            <div className="mt-6">
              <TryTheAppCta tone={dark ? "dark" : "light"} />
            </div>
          </div>
        );
        const art = (
          <div className="flex justify-center">
            <AppScreenshotPlaceholder label={product.name} tone={dark ? "dark" : "light"} />
          </div>
        );
        return (
          <motion.article
            key={product.id}
            {...fade}
            transition={{ duration: 0.6, delay: i * 0.06 }}
            className={`py-20 md:py-28 ${dark ? "bg-ink" : ""} ${i > 0 ? "border-t border-border" : ""}`}
          >
            <div className="container-peak grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {phonesLeft ? (
                <>
                  {art}
                  {copy}
                </>
              ) : (
                <>
                  {copy}
                  {art}
                </>
              )}
            </div>
          </motion.article>
        );
      })}
    </section>
  );
}

function Steps() {
  return (
    <section id="how" className="py-28 md:py-36 bg-parchment-deep border-t border-border">
      <div className="container-peak">
        <motion.div {...fade} className="max-w-3xl mx-auto text-center mb-16">
          <div className="mx-auto mb-6 h-1 w-12 bg-gold" />
          <p className="eyebrow mb-4">{HOME.stepsEyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight text-ink">{HOME.stepsHeading}</h2>
        </motion.div>
        <div className="grid gap-12 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4 items-start">
          {HOME.steps.map((step, i) => (
            <div key={step.n} className="contents">
              <motion.div {...fade} transition={{ duration: 0.6, delay: i * 0.08 }} className="text-center">
                <AppScreenshotPlaceholder label={`Step ${step.n}`} />
                <p className="eyebrow mt-6 mb-3">{step.n}</p>
                <h3 className="font-display text-2xl leading-tight text-ink">{step.title}</h3>
                <p className="mt-4 text-base leading-relaxed text-clay">{step.body}</p>
              </motion.div>
              {i < HOME.steps.length - 1 && (
                <p className="hidden md:flex items-center justify-center font-mono text-2xl text-gold pt-40" aria-hidden>
                  →
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Personalize() {
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-peak">
        <motion.h2 {...fade} className="font-display text-3xl md:text-5xl leading-tight text-ink max-w-3xl mb-14">
          {HOME.personalize.title}
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-px bg-border border border-border">
          {HOME.personalize.items.map((item, i) => (
            <motion.div
              key={item.title}
              {...fade}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className={`${i % 2 === 0 ? "bg-parchment" : "bg-gold/10"} px-6 py-10 md:px-10`}
            >
              <h3 className="font-display text-2xl text-ink">{item.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-clay">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Expert() {
  return (
    <section id="expert" className="py-28 md:py-36 border-t border-border bg-ink">
      <div className="container-peak grid lg:grid-cols-12 gap-12 items-start">
        <motion.div {...fade} className="lg:col-span-6">
          <div className="mb-6 h-1 w-12 bg-gold" />
          <p className="eyebrow mb-4">{HOME.expert.eyebrow}</p>
          <h2 className="font-display text-3xl md:text-5xl leading-tight text-parchment">{HOME.expert.title}</h2>
          <p className="mt-6 text-lg leading-relaxed text-parchment/75">{HOME.expert.body}</p>
          <a
            href="#how"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors"
          >
            {HOME.expert.cta}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </motion.div>
        <div className="lg:col-span-6 space-y-8">
          <AppScreenshotPlaceholder label="App" />
          <ul className="space-y-5">
            {HOME.expert.points.map((point) => (
              <li key={point} className="text-base leading-relaxed text-ink border-l border-gold pl-4">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-24 bg-parchment-deep/30 border-t border-border">
      <div className="container-peak">
        <motion.div {...fade} className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-5xl text-ink">{HOME.testimonialsHeading}</h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {HOME.testimonials.map((quote, index) => (
            <motion.div
              key={quote}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-parchment rounded-2xl p-6 shadow-md border border-border relative flex flex-col"
            >
              <Quote className="w-8 h-8 text-gold/30 absolute top-4 right-4" />
              <p className="text-ink leading-relaxed italic flex-1 mb-6">&ldquo;{quote}&rdquo;</p>
              <p className="text-xs text-clay italic border-t border-border/50 pt-4">Verified user</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseWhen() {
  return (
    <section className="py-28 md:py-32 border-t border-border">
      <div className="container-peak max-w-3xl">
        <motion.h2 {...fade} className="font-display text-3xl md:text-5xl leading-tight text-ink">
          {HOME.useWhen.title}
        </motion.h2>
        <motion.p {...fade} className="mt-6 text-lg leading-relaxed text-clay">
          {HOME.useWhen.body}
        </motion.p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="download" className="py-28 md:py-36 border-t border-border bg-parchment-deep/40">
      <div className="container-peak max-w-3xl text-center">
        <motion.h2 {...fade} className="font-display text-3xl md:text-5xl text-ink">
          {HOME.pricing.title}
        </motion.h2>
        <motion.p {...fade} className="mt-6 text-lg text-clay">
          {HOME.pricing.intro}
        </motion.p>
        <ul className="mt-8 space-y-2">
          {HOME.pricing.perks.map((perk) => (
            <li key={perk} className="font-mono text-sm uppercase tracking-[0.16em] text-ink">
              {perk}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-base text-clay">{HOME.pricing.after}</p>
        <div className="mt-10">
          <TryTheAppCta />
        </div>
      </div>
    </section>
  );
}

function FounderCard({
  name,
  role,
  paragraphs,
  href,
  linkLabel,
  delay = 0,
}: {
  name: string;
  role: string;
  paragraphs: readonly string[];
  href: string;
  linkLabel: string;
  delay?: number;
}) {
  return (
    <motion.article
      {...fade}
      transition={{ duration: 0.8, delay }}
      className="flex h-full flex-col rounded-sm border border-border bg-parchment p-6 sm:p-7 md:p-8"
    >
      <PortraitPlaceholder name={name} className="mb-6" />
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-clay">{role}</p>
      <h3 className="mt-3 font-display text-2xl md:text-3xl leading-tight text-gold">{name}</h3>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground flex-1">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-[0.18em] text-ink border-b border-gold pb-0.5 hover:text-gold transition-colors"
      >
        {linkLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </motion.article>
  );
}

function Founders() {
  return (
    <section id="founder" className="py-28 md:py-36 border-t border-border">
      <div className="container-peak">
        <motion.div {...fade} className="mb-12 md:mb-16">
          <p className="eyebrow mb-4">{HOME.founders.eyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl leading-[1.05] text-ink">{HOME.founders.title}</h2>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <FounderCard {...HOME.founders.abhimanyu} />
          <FounderCard {...HOME.founders.nishant} delay={0.1} />
        </div>
      </div>
    </section>
  );
}

function Faqs() {
  return (
    <section id="faq" className="py-28 md:py-36 border-t border-border bg-parchment-deep/30">
      <div className="container-peak max-w-3xl">
        <motion.h2 {...fade} className="font-display text-3xl md:text-5xl text-ink mb-10">
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {HOME.faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`}>
              <AccordionTrigger className="text-left font-display text-lg text-ink">{item.q}</AccordionTrigger>
              <AccordionContent className="text-base leading-relaxed text-clay">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="py-32 md:py-40 border-t border-border">
      <div className="container-peak max-w-3xl text-center">
        <motion.h2 {...fade} className="font-display text-4xl md:text-6xl leading-[1.05] text-ink">
          {HOME.hero.cta}
        </motion.h2>
        <motion.p {...fade} className="mt-6 text-lg text-clay">
          {HOME.pricing.after}
        </motion.p>
        <div className="mt-12">
          <TryTheAppCta />
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Nav />
      <Opening />
      <Products />
      <Steps />
      <Personalize />
      <Expert />
      <Testimonials />
      <UseWhen />
      <Pricing />
      <Founders />
      <Faqs />
      <FinalCta />
      <SiteFooter />
    </main>
  );
};

export default Index;
