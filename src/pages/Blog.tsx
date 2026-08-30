import { SitePageLayout } from "@/components/site/SitePageLayout";
import { PageList } from "@/components/site/PageList";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { breadcrumbsForPath } from "@/lib/pages";
import { ROUTES } from "@/lib/routes";

const Blog = () => {
  const posts = getAllPosts();

  return (
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
  );
};

export default Blog;
