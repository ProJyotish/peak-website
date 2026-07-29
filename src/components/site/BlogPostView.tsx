import ReactMarkdown from "react-markdown";
import { formatPostDate } from "@/lib/blog";

type BlogPostViewProps = {
  title: string;
  content: string;
  category: string;
  date: string;
};

export function BlogPostView({ title, content, category, date }: BlogPostViewProps) {
  return (
    <article>
      <header className="mb-10">
        {category ? <p className="eyebrow mb-4">{category}</p> : null}
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-ink">{title}</h1>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-clay">
          {formatPostDate(date)}
        </p>
      </header>
      <div className="blog-prose">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </article>
  );
}
