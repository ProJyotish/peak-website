import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { PeakMark } from "@/components/home/PeakMark";
import { SeoHead } from "@/components/site/SeoHead";
import { HOME } from "@/lib/homeCopy";
import { ROUTES } from "@/lib/routes";
import { productSeoKeywords } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { withUtm } from "@/lib/utm";
import "@/styles/peak-home.css";

const NAV_SECTIONS = [
  { id: "today", label: "Today" },
  { id: "ask", label: "Ask" },
  { id: "goals", label: "Goals" },
  { id: "how", label: "How it works" },
  { id: "faq", label: "FAQ" },
] as const;

const STAR_SPECS = [
  { width: 2, height: 2, left: "12%", top: "18%", opacity: 0.45 },
  { width: 1.5, height: 1.5, left: "26%", top: "32%", opacity: 0.3 },
  { width: 2.5, height: 2.5, left: "44%", top: "12%", opacity: 0.5 },
  { width: 1.5, height: 1.5, left: "63%", top: "26%", opacity: 0.35 },
  { width: 2, height: 2, left: "78%", top: "15%", opacity: 0.45 },
  { width: 1.5, height: 1.5, left: "88%", top: "34%", opacity: 0.28 },
  { width: 2, height: 2, left: "34%", top: "44%", opacity: 0.22 },
  { width: 1.5, height: 1.5, left: "70%", top: "48%", opacity: 0.2 },
] as const;

function Device({
  src,
  alt,
  label,
  parallax,
  small,
}: {
  src: string;
  alt: string;
  label?: string;
  parallax?: boolean;
  small?: boolean;
}) {
  return (
    <div>
      <div className={small ? "device device--sm" : "device"}>
        <div className="device__screen">
          <img src={src} alt={alt} {...(parallax ? { "data-parallax": true } : {})} loading={parallax ? undefined : "lazy"} />
        </div>
      </div>
      {label ? <p className="device__label">{label}</p> : null}
    </div>
  );
}

function Eyebrow({ children, muted, mark = true }: { children: ReactNode; muted?: boolean; mark?: boolean }) {
  return (
    <span className={muted ? "eyebrow eyebrow--muted" : "eyebrow"}>
      {mark && !muted && <PeakMark />}
      {children}
    </span>
  );
}

function activeSectionId(): string | null {
  const offset = 120;
  let current: string | null = null;
  for (const { id } of NAV_SECTIONS) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top - offset <= 0) current = id;
  }
  return current;
}

const Index = () => {
  const [navStuck, setNavStuck] = useState(false);
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      setNavStuck(window.scrollY > 24);
      setActiveNav(activeSectionId());
      if (reduce || !rootRef.current) return;
      rootRef.current.querySelectorAll<HTMLImageElement>("[data-parallax]").forEach((img) => {
        const frame = img.parentElement;
        if (!frame) return;
        const r = frame.getBoundingClientRect();
        const travel = img.offsetHeight - frame.offsetHeight;
        if (travel <= 0) return;
        const p = Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
        img.style.transform = `translateY(${-travel * p}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
    };
  }, []);

  useEffect(() => {
    const faqLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: HOME.faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
    const appLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Peak",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Android, Web",
      url: SITE.peakUrl + "/",
      publisher: { "@type": "Organization", name: SITE.legalName },
    };
    const scripts = [faqLd, appLd].map((data, i) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.id = `peak-home-ld-${i}`;
      el.text = JSON.stringify(data);
      document.head.appendChild(el);
      return el;
    });
    return () => scripts.forEach((el) => el.remove());
  }, []);

  const androidNav = withUtm(SITE.stores.android, "nav");
  const androidHero = withUtm(SITE.stores.android, "hero_android");
  const webHero = withUtm(SITE.app, "hero_web");
  const androidGet = withUtm(SITE.stores.android, "get_android");
  const webGet = withUtm(SITE.app, "get_web");

  return (
    <div className="peak-home" ref={rootRef}>
      <SeoHead
        title={HOME.seo.title}
        description={HOME.seo.description}
        keywords={productSeoKeywords(
          "peaklife",
          "AI astrology app",
          "vedic astrology",
          "jyotisha",
          "personalized daily horoscope",
        )}
        path={ROUTES.home}
      />
      <header className={navStuck ? "nav is-stuck" : "nav"}>
        <div className="wrap nav__inner">
          <a className="wordmark" href="#top" aria-label="Peak, home">
            <img
              className="wordmark__img wordmark__img--on-ink"
              src="/home/peak-wordmark-on-ink.svg"
              width={718}
              height={73}
              alt=""
            />
            <img
              className="wordmark__img wordmark__img--ink"
              src="/home/peak-wordmark-ink.svg"
              width={718}
              height={73}
              alt=""
            />
          </a>
          <nav className="nav__links" aria-label="Page sections">
            {NAV_SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={activeNav === id ? "is-active" : undefined}
                aria-current={activeNav === id ? "true" : undefined}
              >
                {label}
              </a>
            ))}
          </nav>
          <a className="btn btn--primary" href={androidNav}>
            {HOME.hero.navCta}
          </a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero__stars" aria-hidden="true">
          {STAR_SPECS.map((star, i) => (
            <span
              key={i}
              style={{
                width: star.width,
                height: star.height,
                left: star.left,
                top: star.top,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>
        <div className="wrap hero__inner">
          <PeakMark className="hero__mark" />
          <h1>{HOME.hero.title}</h1>
          <p className="lede">{HOME.hero.lede}</p>
          <div className="btn-row" style={{ justifyContent: "center" }}>
            <a className="btn btn--primary" href={androidHero}>
              {HOME.hero.ctaAndroid}
            </a>
            <a className="btn btn--on-ink" href={webHero}>
              {HOME.hero.ctaWeb}
            </a>
          </div>
          <div className="trustbar">
            {HOME.hero.trust.flatMap((item, i) =>
              i === 0
                ? [<span key={item}>{item}</span>]
                : [
                    <span key={`${item}-dot`} className="dot">
                      &middot;
                    </span>,
                    <span key={item}>{item}</span>,
                  ],
            )}
          </div>
        </div>
      </section>

      <div className="band">
        <div className="wrap band__inner">
          {HOME.band.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="wrap statement">
          <h2>{HOME.statement.title}</h2>
          <p>{HOME.statement.body}</p>
        </div>
      </section>

      {HOME.products.map((product) => (
        <section key={product.id} className="section section--rule" id={product.id}>
          <div className={product.flip ? "wrap feature feature--flip" : "wrap feature"}>
            <div className="feature__copy stack-lg">
              <Eyebrow>{product.name}</Eyebrow>
              <h2>{product.title}</h2>
              <p className="lede">
                Peak&apos;s <span className="serif-italic">{product.name}</span> {product.summary}
              </p>
              <p className="body">{product.detail}</p>
              <div className="btn-row">
                <a className="btn btn--ghost" href={withUtm(SITE.app, `feature_${product.id}`)}>
                  try the app
                </a>
              </div>
            </div>
            <div className="feature__device">
              <Device
                src={product.screen}
                alt={product.screenAlt}
                label={product.label}
                parallax={product.parallax}
              />
            </div>
          </div>
        </section>
      ))}

      <section className="section section--rule">
        <div className="wrap" style={{ textAlign: "center" }}>
          <Eyebrow muted>{HOME.personalize.eyebrow}</Eyebrow>
          <h2 style={{ marginTop: "var(--space-4)", maxWidth: "22ch", marginInline: "auto" }}>
            {HOME.personalize.title}
          </h2>
        </div>
        <div className="wrap radial">
          <div className="radial__col radial__col--left">
            {HOME.personalize.items.slice(0, 2).map((item) => (
              <div key={item.title} className="pill-item radial__item">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
          <div className="radial__hub">
            <PeakMark />
          </div>
          <div className="radial__col radial__col--right">
            {HOME.personalize.items.slice(2).map((item) => (
              <div key={item.title} className="pill-item radial__item">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule" id="how">
        <div className="wrap">
          <Eyebrow>{HOME.stepsEyebrow}</Eyebrow>
          <h2 style={{ marginTop: "var(--space-4)", maxWidth: "20ch" }}>{HOME.stepsHeading}</h2>
          <div className="steps">
            {HOME.steps.map((step) => (
              <div key={step.n} className="step">
                <div className="step__num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <div className="step__shot">
                  <Device src={step.screen} alt={step.screenAlt} small />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule" id="founders" style={{ background: "var(--surface-recessed)" }}>
        <div className="wrap">
          <Eyebrow>{HOME.founders.eyebrow}</Eyebrow>
          <h2 style={{ marginTop: "var(--space-4)" }}>{HOME.founders.title}</h2>
          <div className="grid-2" style={{ marginTop: "clamp(2.5rem,5vw,4rem)" }}>
            {[HOME.founders.abhimanyu, HOME.founders.nishant].map((founder) => (
              <article key={founder.name} className="card founder">
                <img
                  className="founder__portrait founder__portrait--photo"
                  src={founder.photo}
                  width={560}
                  height={560}
                  alt={founder.name}
                  loading="lazy"
                />
                <div className="founder__role">{founder.role}</div>
                <h3>{founder.name}</h3>
                {founder.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)}>{p}</p>
                ))}
                <p style={{ marginTop: "var(--space-6)" }}>
                  <a className="btn btn--link" href={founder.href} target="_blank" rel="noreferrer">
                    {founder.linkLabel}
                  </a>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--rule" id="method">
        <div className="wrap">
          <Eyebrow>{HOME.method.eyebrow}</Eyebrow>
          <h2 style={{ marginTop: "var(--space-4)", maxWidth: "22ch" }}>{HOME.method.title}</h2>
          <p className="method__lead">{HOME.method.lead}</p>
          <div className="grid-4" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }}>
            {HOME.method.cards.map((card) => (
              <article key={card.title} className="card method-card">
                <strong>{card.title}</strong>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
          <p style={{ marginTop: "var(--space-8)" }}>
            <a className="btn btn--link" href="#how">
              {HOME.method.cta}
            </a>
          </p>
        </div>
      </section>

      <section className="section section--rule">
        <div className="wrap">
          <h2 style={{ maxWidth: "24ch" }}>{HOME.testimonialsHeading}</h2>
          <div className="grid-3" style={{ marginTop: "clamp(2.5rem,5vw,3.5rem)" }}>
            {HOME.testimonials.map((item) => (
              <blockquote key={item.quote} className="quote">
                <p>&ldquo;{item.quote}&rdquo;</p>
                <footer>{item.attribution}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark-band">
        <div className="wrap">
          <Eyebrow mark={false}>{HOME.useWhen.eyebrow}</Eyebrow>
          <h2 style={{ marginTop: "var(--space-4)" }}>{HOME.useWhen.title}</h2>
          <p>{HOME.useWhen.body}</p>
        </div>
      </section>

      <section className="section section--rule" id="get">
        <div className="wrap pricing">
          <div>
            <Eyebrow>{HOME.pricing.eyebrow}</Eyebrow>
            <h2 style={{ marginTop: "var(--space-4)", maxWidth: "16ch" }}>{HOME.pricing.title}</h2>
            <p className="body" style={{ marginTop: "var(--space-5)" }}>
              {HOME.pricing.intro}
            </p>
          </div>
          <div>
            <div className="store-row">
              <a className="store-btn" href={androidGet}>
                <img
                  className="store-btn__logo"
                  src="/home/google-play-logo.png"
                  width={600}
                  height={123}
                  alt="Google Play"
                  loading="lazy"
                />
                <span>
                  <span className="k">Android</span>
                  <span className="v">{HOME.pricing.androidLabel}</span>
                </span>
              </a>
              <a className="store-btn" href={webGet}>
                <PeakMark />
                <span>
                  <span className="k">{HOME.pricing.webEyebrow}</span>
                  <span className="v">{HOME.pricing.webLabel}</span>
                </span>
              </a>
            </div>
            <p className="body" style={{ marginTop: "var(--space-5)", fontSize: "var(--fs-web-caption)" }}>
              {HOME.pricing.webNote}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--rule" id="faq">
        <div className="wrap wrap--narrow">
          <h2>Frequently asked questions.</h2>
          <div className="faq">
            {HOME.faqs.map((item, i) => (
              <details key={item.q} open={i === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__inner">
            <div>
              <img
                className="footer__lockup"
                src="/home/peak-lockup-on-ink.png"
                width={1200}
                height={212}
                alt="PEAK. User manual for your life."
              />
            </div>
            <nav className="footer__links">
              <Link to={ROUTES.product}>Product</Link>
              <Link to={ROUTES.contact}>Contact</Link>
              <Link to={ROUTES.privacy}>Privacy</Link>
              <Link to={ROUTES.terms}>Terms</Link>
            </nav>
          </div>
          <div className="footer__legal">
            <span>&copy; Peak {new Date().getFullYear()}. All rights reserved.</span>
            <span>Built and maintained by {SITE.legalName}.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
