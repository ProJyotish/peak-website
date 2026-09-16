import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "./App.tsx";
import "./index.css";
import { initializeTracking } from "./lib/tracking";

initializeTracking();

if (typeof window !== "undefined") {
  const { pathname, search, hash } = window.location;
  if (pathname.length > 1 && pathname.endsWith("/")) {
    window.history.replaceState(null, "", `${pathname.slice(0, -1)}${search}${hash}`);
  }
}

const queryClient = new QueryClient();

const app = (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

const root = document.getElementById("root")!;
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
