import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Palette } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { createBrandSchema, type CreateBrandInput } from "@/lib/validations";

const EditBrandPage = () => {
  const navigate = useNavigate();
  const { brandId } = useParams();
  const { canEditBrand, loading: permissionsLoading } = usePermissions();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [originalSlug, setOriginalSlug] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [formData, setFormData] = useState<CreateBrandInput>({
    name: "",
    slug: "",
    industry: "",
    website: "",
    logo_url: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateBrandInput, string>>>({});

  useEffect(() => {
    if (brandId) {
      checkPermissions();
      loadBrand();
    }
  }, [brandId]);

  const checkPermissions = async () => {
    if (!brandId) return;
    const hasPermission = await canEditBrand(brandId);
    setCanEdit(hasPermission);
  };

  const loadBrand = async () => {
    try {
      if (!brandId) return;

      const { data, error } = await supabase
        .from("brands")
        .select("name, slug, industry, website, logo_url, organization_id")
        .eq("id", brandId)
        .single();

      if (error) throw error;

      setFormData({
        name: data.name,
        slug: data.slug,
        industry: data.industry || "",
        website: data.website || "",
        logo_url: data.logo_url || "",
      });
      setOriginalSlug(data.slug);
      setOrganizationId(data.organization_id);
    } catch (error) {
      console.error("Error loading brand:", error);
      toast.error("Error al cargar la marca");
      navigate("/organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brandId) return;

    // Reset errors
    setErrors({});

    // Validate form
    const validation = createBrandSchema.safeParse(formData);
    if (!validation.success) {
      const formattedErrors: Partial<Record<keyof CreateBrandInput, string>> = {};
      validation.error.errors.forEach((error) => {
        if (error.path[0]) {
          formattedErrors[error.path[0] as keyof CreateBrandInput] = error.message;
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
        const { data: existingBrand } = await supabase
          .from("brands")
          .select("id")
          .eq("organization_id", organizationId)
          .eq("slug", validation.data.slug)
          .neq("id", brandId)
          .single();

        if (existingBrand) {
          setErrors({ slug: "Este slug ya está en uso en esta organización" });
          toast.error("El slug ya está en uso, por favor elige otro");
          setSaving(false);
          return;
        }
      }

      // Update brand
      const { error } = await supabase
        .from("brands")
        .update({
          name: validation.data.name,
          slug: validation.data.slug,
          industry: validation.data.industry || null,
          website: validation.data.website || null,
          logo_url: validation.data.logo_url || null,
        })
        .eq("id", brandId);

      if (error) throw error;

      toast.success("Marca actualizada exitosamente");
      navigate(`/organizations/${organizationId}/brands`);
    } catch (error: any) {
      console.error("Error updating brand:", error);
      if (error.code === '23505') {
        toast.error("Ya existe una marca con este nombre o slug");
      } else {
        toast.error("Error al actualizar la marca");
      }
    } finally {
      setSaving(false);
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
            <p className="text-muted-foreground">No tienes permisos para editar esta marca</p>
            <Button onClick={() => navigate(`/organizations/${organizationId}/brands`)} className="mt-4">
              Volver a marcas
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
          <Button variant="ghost" onClick={() => navigate(`/organizations/${organizationId}/brands`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a marcas
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Editar Marca</CardTitle>
                <CardDescription>Actualiza la información de tu marca</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la marca *</Label>
                <Input
                  id="name"
                  placeholder="Mi Marca"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  placeholder="mi-marca"
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
                <Label htmlFor="industry">Industria (opcional)</Label>
                <Input
                  id="industry"
                  placeholder="Tecnología, Retail, Servicios..."
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className={errors.industry ? "border-destructive" : ""}
                  maxLength={100}
                />
                {errors.industry && (
                  <p className="text-sm text-destructive">{errors.industry}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sitio web (opcional)</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://mimarca.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={errors.website ? "border-destructive" : ""}
                  maxLength={500}
                />
                {errors.website && (
                  <p className="text-sm text-destructive">{errors.website}</p>
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
                  onClick={() => navigate(`/organizations/${organizationId}/brands`)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditBrandPage;