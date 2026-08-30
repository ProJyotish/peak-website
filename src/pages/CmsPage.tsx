import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BlogPostView } from "@/components/site/BlogPostView";
import { PageList } from "@/components/site/PageList";
import { SiteBreadcrumbs } from "@/components/site/SiteBreadcrumbs";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Wordmark } from "@/components/site/Wordmark";
import {
  breadcrumbsForPath,
  folderTitle,
  getListingItems,
  getPageByPath,
} from "@/lib/pages";
import { ROUTES } from "@/lib/routes";
import NotFound from "./NotFound";

const CmsPage = () => {
  const { pathname } = useLocation();
  let page;
  let items;
  try {
    page = getPageByPath(pathname);
    items = getListingItems(pathname);
  } catch {
    return <NotFound />;
  }

  if (!page && items.length === 0) {
    return <NotFound />;
  }

  const title = page?.title ?? folderTitle(pathname);
  const eyebrow = page?.eyebrow || "Peak";
  const description = page?.description;
  const crumbs = breadcrumbsForPath(pathname, title);
  const listItems = items.map((item) => ({
    href: item.path,
    title: item.title,
    excerpt: item.description,
    eyebrow: item.eyebrow || (item.type === "folder" ? "Folder" : undefined),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="container-peak flex items-center justify-between py-6">
          <Wordmark />
          <Link
            to={ROUTES.home}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-clay hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </div>
      </header>
      <main className="flex-1 py-16 md:py-20">
        <div className={`container-peak ${listItems.length ? "max-w-4xl" : "max-w-3xl"}`}>
          <SiteBreadcrumbs crumbs={crumbs} />
          {page?.content ? (
            <BlogPostView title={title} content={page.content} category={eyebrow} />
          ) : (
            <>
              <p className="eyebrow mb-4">{eyebrow}</p>
              <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">{title}</h1>
              {description ? (
                <p className="mt-6 text-base leading-relaxed text-muted-foreground">{description}</p>
              ) : null}
            </>
          )}
          {listItems.length ? (
            <div className="mt-12">
              <PageList items={listItems} />
            </div>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CmsPage;
