import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import OrganizationsPage from "./pages/OrganizationsPage";
import ProjectsPage from "./pages/ProjectsPage";
import BrandsPage from "./pages/BrandsPage";
import ContentPage from "./pages/ContentPage";
import OrganizationMembersPage from "./pages/OrganizationMembersPage";
import CreateOrganizationPage from "./pages/CreateOrganizationPage";
import CreateBrandPage from "./pages/CreateBrandPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import EditOrganizationPage from "./pages/EditOrganizationPage";
import EditBrandPage from "./pages/EditBrandPage";
import EditProjectPage from "./pages/EditProjectPage";
import AuditLogPage from "./pages/AuditLogPage";
import OrganizationDetailPage from "./pages/OrganizationDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BrandKitEditorPage from "./pages/BrandKitEditorPage";
import ContentEditorPage from "./pages/ContentEditorPage";
import ContentCalendarPage from "./pages/ContentCalendarPage";
import PublicationQueuePage from "./pages/PublicationQueuePage";

const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/organizations" element={<ProtectedRoute><OrganizationsPage /></ProtectedRoute>} />
        <Route path="/organizations/new" element={<ProtectedRoute><CreateOrganizationPage /></ProtectedRoute>} />
        <Route path="/organizations/:orgId/edit" element={<ProtectedRoute><EditOrganizationPage /></ProtectedRoute>} />
        <Route path="/organizations/:id" element={<ProtectedRoute><OrganizationDetailPage /></ProtectedRoute>} />
        <Route path="/audit-logs" element={<ProtectedRoute><AuditLogPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/organizations/:orgId/members" element={<ProtectedRoute><OrganizationMembersPage /></ProtectedRoute>} />
        <Route path="/organizations/:orgId/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
        <Route path="/organizations/:orgId/projects/new" element={<ProtectedRoute><CreateProjectPage /></ProtectedRoute>} />
        <Route path="/projects/:projectId/edit" element={<ProtectedRoute><EditProjectPage /></ProtectedRoute>} />
        <Route path="/projects/:projectId/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
        <Route path="/organizations/:orgId/brands" element={<ProtectedRoute><BrandsPage /></ProtectedRoute>} />
        <Route path="/organizations/:orgId/brands/new" element={<ProtectedRoute><CreateBrandPage /></ProtectedRoute>} />
        <Route path="/brands/:brandId" element={<ProtectedRoute><BrandsPage /></ProtectedRoute>} />
        <Route path="/brands/:brandId/edit" element={<ProtectedRoute><EditBrandPage /></ProtectedRoute>} />
        <Route path="/brands/:brandId/kit" element={<ProtectedRoute><BrandKitEditorPage /></ProtectedRoute>} />
            <Route path="/projects/:projectId/content/new" element={<ProtectedRoute><ContentEditorPage /></ProtectedRoute>} />
            <Route path="/projects/:projectId/content/:contentId" element={<ProtectedRoute><ContentEditorPage /></ProtectedRoute>} />
            <Route path="/projects/:projectId/calendar" element={<ProtectedRoute><ContentCalendarPage /></ProtectedRoute>} />
            <Route path="/projects/:projectId/queue" element={<ProtectedRoute><PublicationQueuePage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  );
};

export default App;
