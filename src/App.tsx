import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ROUTES } from "@/lib/routes";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Terms from "./pages/Terms.tsx";
import Privacy from "./pages/Privacy.tsx";
import AccountDeletion from "./pages/AccountDeletion.tsx";
import TermsEmbed from "./pages/TermsEmbed.tsx";
import PrivacyEmbed from "./pages/PrivacyEmbed.tsx";
import Contact from "./pages/Contact.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.home} element={<Index />} />
          <Route path={ROUTES.terms} element={<Terms />} />
          <Route path={ROUTES.termsEmbed} element={<TermsEmbed />} />
          <Route path={ROUTES.privacy} element={<Privacy />} />
          <Route path={ROUTES.accountDeletion} element={<AccountDeletion />} />
          <Route path={ROUTES.privacyEmbed} element={<PrivacyEmbed />} />
          <Route path={ROUTES.contact} element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
