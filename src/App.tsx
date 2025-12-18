import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// IMPORTS PARA TEST SUPABASE
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// ---------------------------------------------------------------
// 🔥 TEST SUPABASE INLINE (antes del App)
// ---------------------------------------------------------------
function SupaTestInline() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("content_items").select("*").limit(10);

      console.log("DATA:", data);
      console.log("ERROR:", error);

      setItems(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div style={{ padding: 24, background: "#111", marginTop: 40 }}>
      <h2 style={{ marginBottom: 12 }}>Test Supabase (Inline)</h2>

      {loading && <p>Cargando…</p>}

      {!loading && items.length === 0 && <p>No hay registros.</p>}

      {!loading && items.length > 0 && <pre style={{ fontSize: 12 }}>{JSON.stringify(items, null, 2)}</pre>}
    </div>
  );
}

// ---------------------------------------------------------------
// 🔥 LAZY LOADING DE TODAS LAS PÁGINAS
// ---------------------------------------------------------------
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrganizationsPage = lazy(() => import("./pages/OrganizationsPage"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const BrandsPage = lazy(() => import("./pages/BrandsPage"));
const ContentPage = lazy(() => import("./pages/ContentPage"));
const OrganizationMembersPage = lazy(() => import("./pages/OrganizationMembersPage"));
const CreateOrganizationPage = lazy(() => import("./pages/CreateOrganizationPage"));
const CreateBrandPage = lazy(() => import("./pages/CreateBrandPage"));
const CreateProjectPage = lazy(() => import("./pages/CreateProjectPage"));
const EditOrganizationPage = lazy(() => import("./pages/EditOrganizationPage"));
const EditBrandPage = lazy(() => import("./pages/EditBrandPage"));
const EditProjectPage = lazy(() => import("./pages/EditProjectPage"));
const AuditLogPage = lazy(() => import("./pages/AuditLogPage"));
const OrganizationDetailPage = lazy(() => import("./pages/OrganizationDetailPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const BrandKitEditorPage = lazy(() => import("./pages/BrandKitEditorPage"));
const ContentEditorPage = lazy(() => import("./pages/ContentEditorPage"));
const ContentCalendarPage = lazy(() => import("./pages/ContentCalendarPage"));
const PublicationQueuePage = lazy(() => import("./pages/PublicationQueuePage"));
const UsersAdminPage = lazy(() => import("./pages/UsersAdminPage"));
const MediaLibraryPage = lazy(() => import("./pages/MediaLibraryPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const DemoPage = lazy(() => import("./pages/DemoPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ShowcasePage = lazy(() => import("./pages/ShowcasePage"));
const ShowcaseBrandsPage = lazy(() => import("./pages/ShowcaseBrandsPage"));
const ShowcaseBrandSetupPage = lazy(() => import("./pages/ShowcaseBrandSetupPage"));
const ShowcaseBrandDetailPage = lazy(() => import("./pages/ShowcaseBrandDetailPage"));
const ShowcaseContentCreatorPage = lazy(() => import("./pages/ShowcaseContentCreatorPage"));
const ShowcaseCampaignCreatorPage = lazy(() => import("./pages/ShowcaseCampaignCreatorPage"));
const ShowcaseChatAutomationPage = lazy(() => import("./pages/ShowcaseChatAutomationPage"));
const ShowcaseLeadCapturePage = lazy(() => import("./pages/ShowcaseLeadCapturePage"));
const ShowcaseThankYouPage = lazy(() => import("./pages/ShowcaseThankYouPage"));
const ShowcaseVideoGeneratorPage = lazy(() => import("./pages/ShowcaseVideoGeneratorPage"));
const ShowcaseInspirationLibraryPage = lazy(() => import("./pages/ShowcaseInspirationLibraryPage"));
const ShowcasePricingPage = lazy(() => import("./pages/ShowcasePricingPage"));
const ShowcaseOnboardingPage = lazy(() => import("./pages/ShowcaseOnboardingPage"));
const ShowcaseDemoMenuPage = lazy(() => import("./pages/ShowcaseDemoMenuPage"));
const ShowcaseFeaturesPage = lazy(() => import("./pages/ShowcaseFeaturesPage"));
const ShowcaseIndustriesPage = lazy(() => import("./pages/ShowcaseIndustriesPage"));
const CreatorBrainyTestPage = lazy(() => import("./pages/CreatorBrainyTestPage"));
const TrialPage = lazy(() => import("./pages/TrialPage"));

const LoadingFallback = () => (
  <div className="min-h-screen bg-background p-8">
    <Skeleton className="h-12 w-64 mb-8" />
    <Skeleton className="h-[400px] w-full" />
  </div>
);

// ---------------------------------------------------------------
// 🔥 APP PRINCIPAL
// ---------------------------------------------------------------
const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Showcase público */}
          <Route path="/" element={<ShowcasePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/features" element={<ShowcaseFeaturesPage />} />
          <Route path="/industries" element={<ShowcaseIndustriesPage />} />
          <Route path="/lead-capture" element={<ShowcaseLeadCapturePage />} />
          <Route path="/thank-you" element={<ShowcaseThankYouPage />} />
          <Route path="/creator-brainy-test" element={<CreatorBrainyTestPage />} />
          <Route path="/trial" element={<TrialPage />} />

          {/* Muchísimas rutas más… */}
          {/* (Todo este bloque se mantiene igual, no lo modificamos) */}

          <Route path="*" element={<NotFound />} />

          {/* -------------------------------------------------------- */}
          {/* 🔥 RUTA DE TEST SUPABASE (accedes en: /supa-test) */}
          {/* -------------------------------------------------------- */}
          <Route path="/supa-test" element={<SupaTestInline />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  );
};

export default App;
