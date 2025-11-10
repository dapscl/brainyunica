import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ArrowLeft, Building2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { createOrganizationSchema, generateSlug, type CreateOrganizationInput } from "@/lib/validations";

const EditOrganizationPage = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { canEditOrganization, canDeleteOrganization, loading: permissionsLoading } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [formData, setFormData] = useState<CreateOrganizationInput>({
    name: "",
    slug: "",
    logo_url: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateOrganizationInput, string>>>({});

  useEffect(() => {
    if (orgId) {
      checkPermissions();
      loadOrganization();
    }
  }, [orgId]);

  const checkPermissions = async () => {
    if (!orgId) return;
    const hasEditPermission = await canEditOrganization(orgId);
    const hasDeletePermission = await canDeleteOrganization(orgId);
    setCanEdit(hasEditPermission);
    setCanDelete(hasDeletePermission);
  };

  const loadOrganization = async () => {
    try {
      if (!orgId) return;

      const { data, error } = await supabase
        .from("organizations")
        .select("name, slug, logo_url")
        .eq("id", orgId)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        slug: data.slug,
        logo_url: data.logo_url || "",
      });
      setOriginalSlug(data.slug);
    } catch (error) {
      console.error("Error loading organization:", error);
      toast.error("Error al cargar la organización");
      navigate("/organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name });
    setErrors({ ...errors, name: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgId) return;

    // Reset errors
    setErrors({});

    // Validate form
    const validation = createOrganizationSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof CreateOrganizationInput, string>> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0] as keyof CreateOrganizationInput] = error.message;
        }
      });
      setErrors(formattedErrors);
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setSaving(true);

    try {
      // Check if slug changed and if new slug already exists
      if (validation.data.slug !== originalSlug) {
        const { data: existingOrg } = await supabase
          .from("organizations")
          .select("id")
          .eq("slug", validation.data.slug)
          .neq("id", orgId)
          .single();

        if (existingOrg) {
          setErrors({ slug: "Este slug ya está en uso" });
          toast.error("El slug ya está en uso, por favor elige otro");
          setSaving(false);
          return;
        }
      }

      // Update organization
      const { error } = await supabase
        .from("organizations")
        .update({
          name: validation.data.name,
          slug: validation.data.slug,
          logo_url: validation.data.logo_url || null,
        })
        .eq("id", orgId);

      if (error) throw error;

      toast.success("Organización actualizada exitosamente");
      navigate("/organizations");
    } catch (error: any) {
      console.error("Error updating organization:", error);
      if (error.code === '23505') {
        toast.error("Ya existe una organización con este nombre o slug");
      } else {
        toast.error("Error al actualizar la organización");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!orgId) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", orgId);

      if (error) throw error;

      toast.success("Organización eliminada exitosamente");
      navigate("/organizations");
    } catch (error: any) {
      console.error("Error deleting organization:", error);
      toast.error("Error al eliminar la organización");
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
            <p className="text-muted-foreground">No tienes permisos para editar esta organización</p>
            <Button onClick={() => navigate("/organizations")} className="mt-4">
              Volver a organizaciones
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
          <Button variant="ghost" onClick={() => navigate("/organizations")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a organizaciones
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Editar Organización</CardTitle>
                <CardDescription>Actualiza la información de tu organización</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la organización *</Label>
                <Input
                  id="name"
                  placeholder="Mi Agencia Creativa"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={errors.name ? "border-destructive" : ""}
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL amigable) *</Label>
                <Input
                  id="slug"
                  placeholder="mi-agencia-creativa"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  className={errors.slug ? "border-destructive" : ""}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  Solo letras minúsculas, números y guiones.
                </p>
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">URL del logo (opcional)</Label>
                <Input
                  id="logo_url"
                  type="url"
                  placeholder="https://ejemplo.com/logo.png"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className={errors.logo_url ? "border-destructive" : ""}
                  maxLength={500}
                />
                {errors.logo_url && (
                  <p className="text-sm text-destructive">{errors.logo_url}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/organizations")}
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
                    Eliminar esta organización es una acción permanente que no se puede deshacer.
                    Todas las marcas y proyectos asociados también serán eliminados.
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="mt-4"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Organización
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
                Esta acción no se puede deshacer. Se eliminará permanentemente la organización
                "{formData.name}" y todos sus datos asociados (marcas, proyectos, etc.).
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

export default EditOrganizationPage;