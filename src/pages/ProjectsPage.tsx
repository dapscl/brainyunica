import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/layout/AppHeader";
import { Briefcase, Plus, Calendar, CheckCircle2, Clock, AlertCircle, Edit, XCircle, Pause } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: string;
  end_date: string;
  created_at: string;
  brand_id: string;
}

const ProjectsPage = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { canEditProject } = usePermissions();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editableProjects, setEditableProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProjects();
  }, [orgId]);

  const checkEditPermissions = async (projectIds: string[]) => {
    const editable = new Set<string>();
    await Promise.all(
      projectIds.map(async (id) => {
        const canEdit = await canEditProject(id);
        if (canEdit) editable.add(id);
      })
    );
    setEditableProjects(editable);
  };

  const loadProjects = async () => {
    try {
      if (!orgId) return;

      // Load all brands from this organization
      const { data: brands } = await supabase
        .from("brands")
        .select("id")
        .eq("organization_id", orgId);

      if (!brands || brands.length === 0) {
        setProjects([]);
        setLoading(false);
        return;
      }

      const brandIds = brands.map(b => b.id);

      // Load projects for these brands
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .in("brand_id", brandIds)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProjects(data || []);

      // Check edit permissions for all projects
      if (data && data.length > 0) {
        await checkEditPermissions(data.map(p => p.id));
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      toast.error("Error al cargar proyectos");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, any> = {
      planning: <Clock className="h-4 w-4" />,
      active: <CheckCircle2 className="h-4 w-4" />,
      on_hold: <Pause className="h-4 w-4" />,
      completed: <CheckCircle2 className="h-4 w-4" />,
      cancelled: <XCircle className="h-4 w-4" />,
    };
    return icons[status] || <Clock className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planning: "bg-blue-500",
      active: "bg-green-500",
      on_hold: "bg-yellow-500",
      completed: "bg-gray-500",
      cancelled: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planning: "Planificación",
      active: "Activo",
      on_hold: "En espera",
      completed: "Completado",
      cancelled: "Cancelado",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Proyectos</h1>
            <p className="text-muted-foreground">Gestiona tus campañas y proyectos</p>
          </div>
          <Button onClick={() => navigate(`/organizations/${orgId}/projects/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>

        {projects.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tienes proyectos</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primer proyecto para comenzar
              </p>
              <Button onClick={() => navigate(`/organizations/${orgId}/projects/new`)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Proyecto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-glow transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(project.status)}>
                        <span className="flex items-center gap-1 text-white">
                          {getStatusIcon(project.status)}
                          {getStatusLabel(project.status)}
                        </span>
                      </Badge>
                      {editableProjects.has(project.id) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/projects/${project.id}/edit`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description || "Sin descripción"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(project.start_date).toLocaleDateString()} -{" "}
                      {project.end_date ? new Date(project.end_date).toLocaleDateString() : "En curso"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProjectsPage;