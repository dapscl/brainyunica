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

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export const DynamicBreadcrumb = () => {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbSegment[] => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbSegment[] = [{ label: "Dashboard", href: "/dashboard" }];
    
    let currentPath = "";
    
    paths.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Skip UUIDs and common IDs
      if (segment.match(/^[a-f0-9-]{36}$/i) || segment === "new" || segment === "edit") {
        return;
      }
      
      // Map segment names to readable labels
      const labelMap: Record<string, string> = {
        organizations: "Organizaciones",
        brands: "Marcas",
        projects: "Proyectos",
        members: "Equipo",
        content: "Contenidos",
        "audit-logs": "Auditoría",
      };
      
      const label = labelMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      // Only add href if not the last segment
      if (index < paths.length - 1) {
        breadcrumbs.push({ label, href: currentPath });
      } else {
        breadcrumbs.push({ label });
      }
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
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
