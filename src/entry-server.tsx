import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { dehydrate, QueryClient, QueryClientProvider, type DehydratedState } from "@tanstack/react-query";
import { StaticRouter } from "react-router-dom/server";
import { TooltipProvider } from "@/components/ui/tooltip";
import { seedPoojaQueries, type PoojaCatalog } from "@/lib/pooja";
import App from "./App";

export { collectPrerenderRoutes } from "@/lib/prerender-routes";

type HelmetContext = { helmet?: HelmetServerState };

export type RenderData = {
  /** Build-time Shopify catalog snapshot; seeds `/pooja` and `/pooja/:slug`. */
  poojaCatalog?: PoojaCatalog;
};

export type RenderResult = {
  html: string;
  head: string;
  /** Seeded query cache to embed in the page (null when nothing was seeded). */
  state: DehydratedState | null;
};

export function render(url: string, data: RenderData = {}): RenderResult {
  const helmetContext: HelmetContext = {};
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false },
    },
  });
  if (data.poojaCatalog) seedPoojaQueries(queryClient, data.poojaCatalog, url);

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>,
  );

  const helmet = helmetContext.helmet;
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.priority.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ]
        .filter((chunk) => chunk.trim().length > 0)
        .join("\n    ")
    : "";

  const dehydrated = dehydrate(queryClient);
  queryClient.clear();
  return { html, head, state: dehydrated.queries.length ? dehydrated : null };
}
