import { Link, useParams } from "react-router-dom";
import { BlogPostView } from "@/components/site/BlogPostView";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import { getPostBySlug } from "@/lib/blog";
import { ROUTES } from "@/lib/routes";
import { ArrowLeft } from "lucide-react";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={ROUTES.blog}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Blog
          </Link>
        </div>
      </header>
      <main className="flex-1 py-16 md:py-20">
        <div className="container-peak max-w-3xl">
          <BlogPostView
            title={post.title}
            content={post.content}
            category={post.category}
            date={post.date}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default BlogPost;
