import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { SeoHead } from "@/components/site/SeoHead";
import {
  ProductScreenshotCarousel,
  ProductVideoPlaceholder,
  // ProductVideoDemo,
} from "@/components/site/ProductMedia";
import { getProductBySlug, PRODUCT_PAGES, productPath } from "@/lib/product";
import { ROUTES } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import NotFound from "./NotFound";

const fade = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = slug ? getProductBySlug(slug) : undefined;

  if (!product) {
    return <NotFound />;
  }

  const related = PRODUCT_PAGES.filter((p) => p.slug !== product.slug).slice(0, 3);
  const whatsappUrl =
    import.meta.env.VITE_WHATSAPP_URL || "https://wa.me/919560057789?text=Hi";
  const path = ROUTES.productPage(product.slug);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SeoHead
        title={product.seo.title}
        description={product.seo.description}
        keywords={product.seo.keywords}
        path={path}
      />
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={ROUTES.product}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Product
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b border-border py-16 md:py-20">
          <div className="container-peak grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <motion.div {...fade} className="md:col-span-6">
              <p className="eyebrow mb-4">Product · {product.eyebrow}</p>
              <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">
                {product.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-clay">{product.tagline}</p>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-ink text-parchment font-mono text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-ink transition-colors"
                >
                  Start free trial
                </a>
                <Link
                  to={ROUTES.product}
                  className="font-mono text-xs uppercase tracking-[0.18em] text-clay border-b border-border pb-0.5 hover:text-ink hover:border-gold transition-colors"
                >
                  All product pages
                </Link>
              </div>
            </motion.div>

            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.08 }}
              className="md:col-span-6 flex justify-center"
            >
              <ProductScreenshotCarousel slides={product.screenshots} />
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24 border-b border-border">
          <div className="container-peak max-w-3xl">
            <motion.div {...fade}>
              <p className="eyebrow mb-4">How it works</p>
              <h2 className="font-display text-3xl md:text-4xl leading-tight text-ink">
                Functionality, step by step
              </h2>
            </motion.div>
            <div className="mt-12 space-y-10">
              {product.howItWorks.map((step, index) => (
                <motion.div key={step.title} {...fade} transition={{ ...fade.transition, delay: index * 0.05 }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-2xl text-ink">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{step.body}</p>
                  <div className="mt-6 h-px w-12 bg-gold" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-parchment-deep/40 border-b border-border">
          <div className="container-peak max-w-4xl">
            <motion.div {...fade}>
              <p className="eyebrow mb-4">Why it matters</p>
              <h2 className="font-display text-3xl md:text-4xl leading-tight text-ink">
                Key selling points
              </h2>
            </motion.div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {product.sellingPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  {...fade}
                  transition={{ ...fade.transition, delay: index * 0.04 }}
                  className="border border-border bg-background/70 p-6 md:p-7"
                >
                  <h3 className="font-display text-xl text-ink">{point.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 border-b border-border">
          <div className="container-peak max-w-3xl">
            <motion.div {...fade}>
              <p className="eyebrow mb-4">Demo</p>
              <h2 className="font-display text-3xl md:text-4xl leading-tight text-ink mb-8">
                See it in motion
              </h2>
              <ProductVideoPlaceholder title={`${product.eyebrow} walkthrough`} />
              {/*
                Video demo placeholder — uncomment and set src when recording is ready:

                <div className="mt-8">
                  <ProductVideoDemo
                    title={`${product.eyebrow} walkthrough`}
                    src="https://www.youtube.com/embed/VIDEO_ID"
                  />
                </div>
              */}
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container-peak max-w-4xl">
            <motion.div {...fade}>
              <p className="eyebrow mb-4">Keep exploring</p>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-8">Related product pages</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to={productPath(item.slug)}
                    className="group border border-border p-5 transition-colors hover:border-gold"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">{item.eyebrow}</p>
                    <p className="mt-2 font-display text-lg text-ink group-hover:text-gold transition-colors">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ProductPage;
