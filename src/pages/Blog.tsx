import { Link } from "react-router-dom";
import { SitePageLayout } from "@/components/site/SitePageLayout";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";

const Blog = () => {
  const posts = getAllPosts();

  return (
    <SitePageLayout
      eyebrow="Blog"
      title="Vedic Insights"
      description="Explore planetary wisdom, timing, and how Peak reads the chart for real decisions."
      wide
    >
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={ROUTES.blogPost(post.slug)}
            className="group block border border-border bg-card/40 p-6 md:p-8 transition-colors hover:border-gold"
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
              {post.category ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold">
                  {post.category}
                </span>
              ) : null}
              <time className="font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
                {formatPostDate(post.date)}
              </time>
            </div>
            <h2 className="font-display text-2xl md:text-3xl text-ink group-hover:text-gold transition-colors">
              {post.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-clay group-hover:text-ink transition-colors">
              Read →
            </p>
          </Link>
        ))}
      </div>
    </SitePageLayout>
  );
};

export default Blog;
