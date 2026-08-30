import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleAnalytics } from "@/components/site/GoogleAnalytics";
import { ROUTES } from "@/lib/routes";
import Index from "./pages/Index.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import AccountDeletion from "./pages/AccountDeletion.tsx";
import TermsEmbed from "./pages/TermsEmbed.tsx";
import PrivacyEmbed from "./pages/PrivacyEmbed.tsx";
import Contact from "./pages/Contact.tsx";
import Checkout from "./pages/Checkout.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import CmsPage from "./pages/CmsPage.tsx";
import Astrocartography from "./pages/Astrocartography.tsx";
import ProductIndex from "./pages/ProductIndex.tsx";
import ProductPage from "./pages/ProductPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GoogleAnalytics />
        <Routes>
          <Route path={ROUTES.home} element={<Index />} />
          <Route path={ROUTES.blog} element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path={ROUTES.product} element={<ProductIndex />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path={ROUTES.terms} element={<Terms />} />
          <Route path={ROUTES.termsEmbed} element={<TermsEmbed />} />
          <Route path={ROUTES.privacy} element={<Privacy />} />
          <Route path={ROUTES.accountDeletion} element={<AccountDeletion />} />
          <Route path={ROUTES.privacyEmbed} element={<PrivacyEmbed />} />
          <Route path={ROUTES.contact} element={<Contact />} />
          <Route path={ROUTES.checkout} element={<Checkout />} />
          <Route path={ROUTES.astrocartography} element={<Astrocartography />} />
          <Route path="*" element={<CmsPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
