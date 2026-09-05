import { Fragment, useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import { Link } from "react-router-dom";
import { SeoHead } from "@/components/site/SeoHead";
import { HOME } from "@/lib/homeCopy";
import { PRODUCT_SEO_KEYWORDS } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";
import "@/styles/peak-home.css";

/** The navigator mark, defined once and referenced everywhere below. */
function MarkSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <symbol id="peak-mark" viewBox="0 0 90.778 79.611">
        <g transform="translate(-115.172,3.964)">
          <path d="M162.494,53.951c-9.5-.6-18.552,3.046-23.79,10.731-2.2,3.234-4.756,6.08-8.933,6.531a9.5,9.5,0,0,1-7.964-2.541c-4.025-4.082-3.037-9.718.267-14.985L152.913,4.493a9.277,9.277,0,0,1,15.836-.029l31.63,52.387c2.44,4.038,2.071,9.241-1.337,12.4-4.247,3.926-11.395,2.875-14.625-2.049-4.991-7.608-12.157-12.634-21.922-13.247" />
        </g>
      </symbol>
    </svg>
  );
}

function Mark({ className }: { className?: string }) {
  return (
    <span className={className ? `mark ${className}` : "mark"}>
      <svg viewBox="0 0 90.778 79.611">
        <use href="#peak-mark" />
      </svg>
    </span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <Mark />
      {children}
    </span>
  );
}

const HERO_STARS = [
  { width: "2px", height: "2px", left: "12%", top: "18%", opacity: 0.45 },
  { width: "1.5px", height: "1.5px", left: "26%", top: "32%", opacity: 0.3 },
  { width: "2.5px", height: "2.5px", left: "44%", top: "12%", opacity: 0.5 },
  { width: "1.5px", height: "1.5px", left: "63%", top: "26%", opacity: 0.35 },
  { width: "2px", height: "2px", left: "78%", top: "15%", opacity: 0.45 },
  { width: "1.5px", height: "1.5px", left: "88%", top: "34%", opacity: 0.28 },
  { width: "2px", height: "2px", left: "34%", top: "44%", opacity: 0.22 },
  { width: "1.5px", height: "1.5px", left: "70%", top: "48%", opacity: 0.2 },
];

function Nav({ navRef }: { navRef: RefObject<HTMLElement> }) {
  return (
    <header className="nav" ref={navRef}>
      <div className="wrap nav__inner">
        <a className="wordmark" href="#top" aria-label="Peak, home">
          <img
            className="wordmark__img wordmark__img--on-ink"
            src="/assets/img/peak-wordmark-on-ink.svg"
            width={718}
            height={73}
            alt=""
          />
          <img
            className="wordmark__img wordmark__img--ink"
            src="/assets/img/peak-wordmark-ink.svg"
            width={718}
            height={73}
            alt=""
          />
        </a>
        <nav className="nav__links">
          {HOME.nav.links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn--primary" href={HOME.nav.cta.href}>
          {HOME.nav.cta.label}
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__stars" aria-hidden="true">
        {HERO_STARS.map((star, i) => (
          <span key={i} style={star} />
        ))}
      </div>
      <div className="wrap hero__inner">
        <Mark className="hero__mark" />
        <h1>{HOME.hero.title}</h1>
        <p className="lede">{HOME.hero.lede}</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          {HOME.hero.ctas.map((cta) => (
            <a key={cta.href} className={`btn btn--${cta.tone}`} href={cta.href}>
              {cta.label}
            </a>
          ))}
        </div>
        <div className="trustbar">
          {HOME.hero.trust.map((item, i) => (
            <Fragment key={item}>
              {i > 0 && <span className="dot">·</span>}
              <span>{item}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function Band() {
  return (
    <div className="band">
      <div className="wrap band__inner">
        {HOME.band.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function Statement() {
  return (
    <section className="section">
      <div className="wrap statement">
        <h2>{HOME.statement.title}</h2>
        <p>{HOME.statement.body}</p>
      </div>
    </section>
  );
}

function Feature({ feature }: { feature: (typeof HOME.features)[number] }) {
  return (
    <section className="section section--rule" id={feature.id}>
      <div className={`wrap feature${feature.flip ? " feature--flip" : ""}`}>
        <div className="feature__copy stack-lg">
          <Eyebrow>{feature.eyebrow}</Eyebrow>
          <h2>{feature.title}</h2>
          <p className="lede">
            {feature.lede.before}
            <span className="serif-italic">{feature.lede.em}</span>
            {feature.lede.after}
          </p>
          <p className="body">{feature.body}</p>
          <div className="btn-row">
            <a className="btn btn--ghost" href={feature.cta.href}>
              {feature.cta.label}
            </a>
          </div>
        </div>
        <div className="feature__device">
          <div className="device">
            <div className="device__screen">
              <img
                src={feature.screen.src}
                alt={feature.screen.alt}
                {...(feature.parallax ? { "data-parallax": "true" } : {})}
              />
            </div>
          </div>
          <p className="device__label">{feature.screen.label}</p>
        </div>
      </div>
    </section>
  );
}

function Personalization() {
  const { eyebrow, title, left, right } = HOME.personalization;
  return (
    <section className="section section--rule">
      <div className="wrap" style={{ textAlign: "center" }}>
        <span className="eyebrow eyebrow--muted">{eyebrow}</span>
        <h2 style={{ marginTop: "var(--space-4)", maxWidth: "22ch", marginInline: "auto" }}>
          {title}
        </h2>
      </div>
      <div className="wrap radial">
        <div className="radial__col radial__col--left">
          {left.map((item) => (
            <div className="pill-item radial__item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
        <div className="radial__hub">
          <Mark />
        </div>
        <div className="radial__col radial__col--right">
          {right.map((item) => (
            <div className="pill-item radial__item" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="section section--rule" id="how">
      <div className="wrap">
        <Eyebrow>{HOME.how.eyebrow}</Eyebrow>
        <h2 style={{ marginTop: "var(--space-4)", maxWidth: "20ch" }}>{HOME.how.title}</h2>
        <div className="steps">
          {HOME.how.steps.map((step) => (
            <div className="step" key={step.num}>
              <div className="step__num">{step.num}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
              <div className="step__shot">
                <div className="device device--sm">
                  <div className="device__screen">
                    <img src={step.screen.src} alt={step.screen.alt} loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Founders() {
  return (
    <section
      className="section section--rule"
      id="founders"
      style={{ background: "var(--surface-recessed)" }}
    >
      <div className="wrap">
        <Eyebrow>{HOME.founders.eyebrow}</Eyebrow>
        <h2 style={{ marginTop: "var(--space-4)" }}>{HOME.founders.title}</h2>
        <div className="grid-2" style={{ marginTop: "clamp(2.5rem,5vw,4rem)" }}>
          {HOME.founders.people.map((person) => (
            <article className="card founder" key={person.name}>
              <img
                className="founder__portrait founder__portrait--photo"
                src={person.portrait.src}
                width={560}
                height={560}
                alt={person.portrait.alt}
                loading="lazy"
              />
              <div className="founder__role">{person.role}</div>
              <h3>{person.name}</h3>
              {person.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
              <p style={{ marginTop: "var(--space-6)" }}>
                <a className="btn btn--link" href={person.link.href}>
                  {person.link.label}
                </a>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section className="section section--rule" id="method">
      <div className="wrap">
        <Eyebrow>{HOME.method.eyebrow}</Eyebrow>
        <h2 style={{ marginTop: "var(--space-4)", maxWidth: "22ch" }}>{HOME.method.title}</h2>
        <p className="method__lead">{HOME.method.lead}</p>
        <div className="grid-4" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }}>
          {HOME.method.cards.map((card) => (
            <article className="card method-card" key={card.title}>
              <strong>{card.title}</strong>
              <p>{card.body}</p>
            </article>
          ))}
        </div>
        <p style={{ marginTop: "var(--space-8)" }}>
          <a className="btn btn--link" href={HOME.method.link.href}>
            {HOME.method.link.label}
          </a>
        </p>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section section--rule">
      <div className="wrap">
        <h2 style={{ maxWidth: "24ch" }}>{HOME.testimonials.title}</h2>
        <div className="grid-3" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }}>
          {HOME.testimonials.quotes.map((item) => (
            <blockquote className="quote" key={item.quote.slice(0, 32)}>
              <p>{`“${item.quote}”`}</p>
              <footer>{item.attribution}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhenToUse() {
  return (
    <section className="section dark-band">
      <div className="wrap">
        <span className="eyebrow">{HOME.whenToUse.eyebrow}</span>
        <h2 style={{ marginTop: "var(--space-4)" }}>{HOME.whenToUse.title}</h2>
        <p>{HOME.whenToUse.body}</p>
      </div>
    </section>
  );
}

function Pricing() {
  const { eyebrow, title, intro, free, price, stores, note } = HOME.pricing;
  return (
    <section className="section section--rule" id="get">
      <div className="wrap pricing">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 style={{ marginTop: "var(--space-4)", maxWidth: "16ch" }}>{title}</h2>
          <p className="body" style={{ marginTop: "var(--space-5)" }}>
            {intro}
          </p>
          <ul className="freelist">
            {free.map((item) => (
              <li key={item}>
                <Mark />
                {item}
              </li>
            ))}
          </ul>
          <p className="price">
            {price.before}
            <b>{price.india}</b>
            {price.middle}
            <b>{price.us}</b>
            {price.after}
          </p>
        </div>
        <div>
          <div className="store-row">
            {stores.map((store) => (
              <a className="store-btn" href={store.href} key={store.kind}>
                {store.logo ? (
                  <img
                    className="store-btn__logo"
                    src={store.logo.src}
                    width={600}
                    height={123}
                    alt={store.logo.alt}
                    loading="lazy"
                  />
                ) : (
                  <Mark />
                )}
                <span>
                  <span className="k">{store.kind}</span>
                  <span className="v">{store.label}</span>
                </span>
              </a>
            ))}
          </div>
          <p
            className="body"
            style={{ marginTop: "var(--space-5)", fontSize: "var(--fs-web-caption)" }}
          >
            {note}
          </p>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section section--rule" id="faq">
      <div className="wrap wrap--narrow">
        <h2>{HOME.faq.title}</h2>
        <div className="faq">
          {HOME.faq.items.map((item, i) => (
            <details key={item.question} open={i === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__inner">
          <div>
            <img
              className="footer__lockup"
              src={HOME.footer.lockup.src}
              width={1200}
              height={212}
              alt={HOME.footer.lockup.alt}
            />
          </div>
          <nav className="footer__links">
            {HOME.footer.links.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer__legal">
          {HOME.footer.legal.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}

function StructuredData() {
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const app = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Android, Web",
    url: `https://${SITE.domain}/`,
    offers: { "@type": "Offer", price: "499", priceCurrency: "INR" },
    publisher: { "@type": "Organization", name: SITE.legalName },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(app) }} />
    </>
  );
}

/** Scroll behaviour carried over from the static build: the nav gains a solid
 *  background once you leave the hero, and the Today capture, which is taller
 *  than its frame, eases through as the section passes. */
function useHomeScrollEffects(navRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const shots = Array.from(document.querySelectorAll<HTMLImageElement>("[data-parallax]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function parallax() {
      if (reduce) return;
      shots.forEach((img) => {
        const frame = img.parentElement;
        if (!frame) return;
        const rect = frame.getBoundingClientRect();
        const travel = img.offsetHeight - frame.offsetHeight;
        if (travel <= 0) return;
        let p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        p = Math.max(0, Math.min(1, p));
        img.style.transform = `translateY(${-travel * p}px)`;
      });
    }

    function onScroll() {
      navRef.current?.classList.toggle("is-stuck", window.scrollY > 24);
      parallax();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // The capture's height is only known once it has decoded.
    shots.forEach((img) => img.addEventListener("load", onScroll));
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      shots.forEach((img) => img.removeEventListener("load", onScroll));
    };
  }, [navRef]);
}

export default function Index() {
  const navRef = useRef<HTMLElement>(null);
  useHomeScrollEffects(navRef);

  return (
    <div className="peak-home">
      <SeoHead
        title={HOME.seo.title}
        description={HOME.seo.description}
        keywords={[...PRODUCT_SEO_KEYWORDS]}
        path={ROUTES.home}
        image={HOME.seo.ogImage}
      />
      <StructuredData />
      <MarkSprite />
      <Nav navRef={navRef} />
      <Hero />
      <Band />
      <Statement />
      {HOME.features.map((feature) => (
        <Feature feature={feature} key={feature.id} />
      ))}
      <Personalization />
      <HowItWorks />
      <Founders />
      <Method />
      <Testimonials />
      <WhenToUse />
      <Pricing />
      <Faq />
      <Footer />
    </div>
  );
}
