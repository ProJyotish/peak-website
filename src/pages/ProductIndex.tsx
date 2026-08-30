import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { SeoHead } from "@/components/site/SeoHead";
import { PRODUCT_PAGES, productPath } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import { productSeoKeywords } from "@/lib/seo";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const ProductIndex = () => {
  return (
    <>
      <SeoHead
        title="Peak App Features — Daily Horoscope, Kundali & Astrology Chat"
        description="Explore Peak: personalized daily horoscope, interactive kundali and rashi charts, hora timing, goals, family profiles, and AI astrology chat."
        keywords={productSeoKeywords(
          "peak astrology app",
          "vedic astrology features",
          "online kundali app",
          "personalized daily horoscope app",
        )}
        path={ROUTES.product}
      />
      <SitePageLayout
        eyebrow="Product"
        title="Inside the Peak app"
        description="Personalized Vedic guidance for today, timing, questions, goals, and the people you care about — daily horoscope, kundali, rashi charts, and astrology chat from your birth chart."
        wide
        backTo={{ href: ROUTES.home, label: "Home" }}
      >
        <div className="grid gap-5">
          {PRODUCT_PAGES.map((product, index) => (
            <motion.div key={product.slug} {...fade} transition={{ ...fade.transition, delay: index * 0.04 }}>
              <Link
                to={productPath(product.slug)}
                className="group block border border-border bg-card/40 p-6 md:p-8 transition-colors hover:border-gold"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                    {product.eyebrow}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
                    /product/{product.slug}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-ink group-hover:text-gold transition-colors">
                  {product.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">{product.summary}</p>
                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-clay group-hover:text-ink transition-colors">
                  Explore →
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </SitePageLayout>
    </>
  );
};

export default ProductIndex;
