import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Eager load critical pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Lazy load other pages
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

const LoadingFallback = () => (
  <div className="min-h-screen bg-background p-8">
    <Skeleton className="h-12 w-64 mb-8" />
    <Skeleton className="h-[400px] w-full" />
  </div>
);

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/showcase/brands" element={<ShowcaseBrandsPage />} />
          <Route path="/showcase/brands/:slug/setup" element={<ShowcaseBrandSetupPage />} />
          <Route path="/showcase/brands/:slug" element={<ShowcaseBrandDetailPage />} />
          <Route path="/showcase/brands/:slug/create-content" element={<ShowcaseContentCreatorPage />} />
          <Route path="/showcase/brands/:slug/create-campaign" element={<ShowcaseCampaignCreatorPage />} />
          <Route path="/demo" element={<ProtectedRoute><DemoPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/organizations" element={<ProtectedRoute><OrganizationsPage /></ProtectedRoute>} />
          <Route path="/organizations/new" element={<ProtectedRoute><CreateOrganizationPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/edit" element={<ProtectedRoute><EditOrganizationPage /></ProtectedRoute>} />
          <Route path="/organizations/:id" element={<ProtectedRoute><OrganizationDetailPage /></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><AuditLogPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UsersAdminPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/members" element={<ProtectedRoute><OrganizationMembersPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/projects/new" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId/edit" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/brands" element={<ProtectedRoute><BrandsPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/brands/new" element={<ProtectedRoute><CreateBrandPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/media" element={<ProtectedRoute><MediaLibraryPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/gallery" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
          <Route path="/organizations/:orgId/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
          <Route path="/brands/:brandId" element={<ProtectedRoute><BrandsPage /></ProtectedRoute>} />
          <Route path="/brands/:brandId/edit" element={<ProtectedRoute><EditBrandPage /></ProtectedRoute>} />
          <Route path="/brands/:brandId/kit" element={<ProtectedRoute><BrandKitEditorPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId/content/new" element={<ProtectedRoute><ContentEditorPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId/content/:contentId" element={<ProtectedRoute><ContentEditorPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId/calendar" element={<ProtectedRoute><ContentCalendarPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId/queue" element={<ProtectedRoute><PublicationQueuePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  );
};

export default App;
