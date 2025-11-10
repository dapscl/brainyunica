import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Briefcase, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations";

interface Brand {
  id: string;
  name: string;
  organization_id: string;
}

const EditProjectPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { canEditProject, canDeleteProject, loading: permissionsLoading } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [organizationId, setOrganizationId] = useState("");
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: "",
    description: "",
    brand_id: "",
    status: "planning",
    start_date: "",
    end_date: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProjectInput, string>>>({});

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    try {
      if (!projectId) return;

      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select(`
          name,
          description,
          brand_id,
          status,
          start_date,
          end_date,
          brands (
            organization_id
          )
        `)
        .eq("id", projectId)
        .single();

      if (projectError) throw projectError;

      const orgId = (project.brands as any)?.organization_id;
      setOrganizationId(orgId);

      // Check permissions
      const hasEditPermission = await canEditProject(projectId);
      const hasDeletePermission = await canDeleteProject(projectId);
      setCanEdit(hasEditPermission);
      setCanDelete(hasDeletePermission);

      // Load brands from the same organization
      const { data: brandsData, error: brandsError } = await supabase
        .from("brands")
        .select("id, name, organization_id")
        .eq("organization_id", orgId)
        .order("name");

      if (brandsError) throw brandsError;
      setBrands(brandsData || []);

      setFormData({
        name: project.name,
        description: project.description || "",
        brand_id: project.brand_id,
        status: project.status as any,
        start_date: project.start_date || "",
        end_date: project.end_date || "",
      });
    } catch (error) {
      console.error("Error loading project:", error);
      toast.error("Error al cargar el proyecto");
      navigate("/organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId) return;

    // Reset errors
    setErrors({});

    // Validate form
    const validation = createProjectSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof CreateProjectInput, string>> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0] as keyof CreateProjectInput] = error.message;
        }
      });
      setErrors(formattedErrors);
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setSaving(true);

    try {
      // Update project
      const { error } = await supabase
        .from("projects")
        .update({
          brand_id: validation.data.brand_id,
          name: validation.data.name,
          description: validation.data.description || null,
          status: validation.data.status,
          start_date: validation.data.start_date,
          end_date: validation.data.end_date || null,
        })
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Proyecto actualizado exitosamente");
      navigate(`/organizations/${organizationId}/projects`);
    } catch (error: any) {
      console.error("Error updating project:", error);
      toast.error("Error al actualizar el proyecto");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!projectId) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;

      toast.success("Proyecto eliminado exitosamente");
      navigate(`/organizations/${organizationId}/projects`);
    } catch (error: any) {
      console.error("Error deleting project:", error);
      toast.error("Error al eliminar el proyecto");
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  if (loading || permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No tienes permisos para editar este proyecto</p>
            <Button onClick={() => navigate(`/organizations/${organizationId}/projects`)} className="mt-4">
              Volver a proyectos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate(`/organizations/${organizationId}/projects`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a proyectos
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Editar Proyecto</CardTitle>
                <CardDescription>Actualiza la información de tu proyecto</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del proyecto *</Label>
                <Input
                  id="name"
                  placeholder="Campaña de verano 2025"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? "border-destructive" : ""}
                  maxLength={150}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand_id">Marca *</Label>
                <Select
                  value={formData.brand_id}
                  onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
                >
                  <SelectTrigger className={errors.brand_id ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccionar marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.brand_id && (
                  <p className="text-sm text-destructive">{errors.brand_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe los objetivos y alcance del proyecto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={errors.description ? "border-destructive" : ""}
                  maxLength={1000}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planificación</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="on_hold">En espera</SelectItem>
                    <SelectItem value="completed">Completado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Fecha de inicio *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className={errors.start_date ? "border-destructive" : ""}
                  />
                  {errors.start_date && (
                    <p className="text-sm text-destructive">{errors.start_date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Fecha de fin (opcional)</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className={errors.end_date ? "border-destructive" : ""}
                  />
                  {errors.end_date && (
                    <p className="text-sm text-destructive">{errors.end_date}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/organizations/${organizationId}/projects`)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>

            {canDelete && (
              <div className="mt-8 pt-6 border-t">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-destructive">Zona de peligro</h3>
                  <p className="text-sm text-muted-foreground">
                    Eliminar este proyecto es una acción permanente que no se puede deshacer.
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="mt-4"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Proyecto
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto
                "{formData.name}" y todos sus datos asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EditProjectPage;