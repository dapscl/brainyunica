import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export const DynamicBreadcrumb = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([{ label: "Dashboard", href: "/dashboard" }]);
  
  useEffect(() => {
    const loadBreadcrumbs = async () => {
      const paths = location.pathname.split("/").filter(Boolean);
      const newBreadcrumbs: BreadcrumbSegment[] = [{ label: "Dashboard", href: "/dashboard" }];
      
      let currentPath = "";
      let orgId: string | null = null;
      let brandId: string | null = null;
      let projectId: string | null = null;
      
      for (let index = 0; index < paths.length; index++) {
        const segment = paths[index];
        currentPath += `/${segment}`;
        
        const isUUID = segment.match(/^[a-f0-9-]{36}$/i);
        
        // Label mapping para segmentos estáticos
        const labelMap: Record<string, string> = {
          organizations: "Organizaciones",
          brands: "Marcas",
          projects: "Proyectos",
          members: "Equipo",
          content: "Contenidos",
          calendar: "Calendario",
          queue: "Cola de Publicación",
          gallery: "Galería",
          templates: "Plantillas",
          "media-library": "Biblioteca de Medios",
          analytics: "Análisis",
          "brand-kit": "Kit de Marca",
          "audit-log": "Registro de Auditoría",
          users: "Usuarios",
          new: "Nuevo",
          edit: "Editar",
        };
        
        if (isUUID) {
          const prevSegment = paths[index - 1];
          
          // Cargar datos reales según el contexto
          if (prevSegment === "organizations") {
            orgId = segment;
            try {
              const { data } = await supabase
                .from("organizations")
                .select("name")
                .eq("id", segment)
                .single();
              
              if (data) {
                newBreadcrumbs.push({
                  label: data.name,
                  href: index < paths.length - 1 ? `/organizations/${segment}` : undefined,
                });
              }
            } catch (error) {
              console.error("Error loading organization:", error);
            }
          } else if (prevSegment === "brands" && orgId) {
            brandId = segment;
            try {
              const { data } = await supabase
                .from("brands")
                .select("name")
                .eq("id", segment)
                .single();
              
              if (data) {
                newBreadcrumbs.push({
                  label: data.name,
                  href: index < paths.length - 1 ? `/organizations/${orgId}/brands/${segment}` : undefined,
                });
              }
            } catch (error) {
              console.error("Error loading brand:", error);
            }
          } else if (prevSegment === "projects" && orgId && brandId) {
            projectId = segment;
            try {
              const { data } = await supabase
                .from("projects")
                .select("name")
                .eq("id", segment)
                .single();
              
              if (data) {
                newBreadcrumbs.push({
                  label: data.name,
                  href: index < paths.length - 1 ? `/organizations/${orgId}/brands/${brandId}/projects/${segment}` : undefined,
                });
              }
            } catch (error) {
              console.error("Error loading project:", error);
            }
          } else if (prevSegment === "content" && projectId) {
            try {
              const { data } = await supabase
                .from("content_items")
                .select("title")
                .eq("id", segment)
                .single();
              
              if (data) {
                newBreadcrumbs.push({
                  label: data.title,
                  href: undefined,
                });
              }
            } catch (error) {
              console.error("Error loading content:", error);
            }
          }
        } else if (segment !== "new" && segment !== "edit") {
          // Segmento estático
          const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
          
          newBreadcrumbs.push({
            label,
            href: index < paths.length - 1 ? currentPath : undefined,
          });
        }
      }
      
      setBreadcrumbs(newBreadcrumbs);
    };
    
    loadBreadcrumbs();
  }, [location.pathname]);
  
  if (breadcrumbs.length <= 1) return null;
  
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {breadcrumbs.slice(1).map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink asChild>
                  <Link to={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
