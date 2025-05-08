
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react"; // Importamos React explícitamente
import Index from "./pages/Index";
import LeadPage from "./pages/LeadPage";
import ProspectingPage from "./pages/ProspectingPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import NotFound from "./pages/NotFound";

// Creamos una nueva instancia de QueryClient dentro de la función de componente
const App = () => {
  // Creamos el queryClient dentro del componente funcional
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/lead/:id" element={<LeadPage />} />
            <Route path="/prospecting" element={<ProspectingPage />} />
            <Route path="/email-verification" element={<EmailVerificationPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
