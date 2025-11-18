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
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .limit(10);

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

      {!loading && items.length > 0 && (
        <pre style={{ fontSize: 12 }}>{JSON.stringify(items, null, 2)}</pre>
      )}
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
const EditBrandPage = lazy(() => import("./pag
