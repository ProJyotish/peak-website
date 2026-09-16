import { SitePageLayout } from "@/components/site/SitePageLayout";
import { PageList } from "@/components/site/PageList";
import { SeoHead } from "@/components/site/SeoHead";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { breadcrumbsForPath } from "@/lib/pages";
import { ROUTES } from "@/lib/routes";
import { productSeoKeywords } from "@/lib/seo";

const Blog = () => {
  const posts = getAllPosts();

  return (
    <>
      <SeoHead
        title="Blog - Peak"
        description="Vedic insights from Peak — planetary wisdom and timing for real decisions."
        keywords={productSeoKeywords("vedic blog", "jyotisha insights")}
        path={ROUTES.blog}
      />
      <SitePageLayout
        eyebrow="Blog"
        title="Vedic Insights"
        description="Explore planetary wisdom, timing, and how Peak reads the chart for real decisions."
        breadcrumbs={breadcrumbsForPath(ROUTES.blog, "Blog")}
        wide
      >
        <PageList
          items={posts.map((post) => ({
            href: ROUTES.blogPost(post.slug),
            title: post.title,
            excerpt: post.excerpt,
            eyebrow: post.category,
            meta: formatPostDate(post.date),
          }))}
        />
      </SitePageLayout>
    </>
  );
};

export default Blog;
