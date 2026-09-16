import { Helmet } from "react-helmet-async";
import type { PageSeo } from "@/lib/seo";
import { absoluteImageUrl, absoluteUrl, keywordsToString } from "@/lib/seo";

export type SeoHeadProps = PageSeo & {
  noindex?: boolean;
  jsonLd?: unknown[];
};

/** Title, canonical, Open Graph, and optional JSON-LD — works in SSR and the client. */
export function SeoHead({
  title,
  description,
  keywords,
  path,
  type = "website",
  image,
  noindex = false,
  jsonLd,
}: SeoHeadProps) {
  const keywordsCsv = keywordsToString(keywords);
  const imageUrl = absoluteImageUrl(image);
  const pageUrl = absoluteUrl(path);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywordsCsv ? <meta name="keywords" content={keywordsCsv} /> : null}
        {noindex ? <meta name="robots" content="noindex, follow" /> : <meta name="robots" content="index, follow" />}
        {noindex ? null : <link rel="canonical" href={pageUrl} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />
      </Helmet>
      {jsonLd?.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
