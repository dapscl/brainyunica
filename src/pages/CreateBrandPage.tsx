import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { ArrowLeft, Palette } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { createBrandSchema, generateSlug, type CreateBrandInput } from "@/lib/validations";

const CreateBrandPage = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { canCreateBrand, loading: permissionsLoading } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [formData, setFormData] = useState<CreateBrandInput>({
    name: "",
    slug: "",
    industry: "",
    website: "",
    logo_url: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateBrandInput, string>>>({});

  useEffect(() => {
    checkPermissions();
  }, [orgId]);

  const checkPermissions = async () => {
    if (!orgId) return;
    const hasPermission = await canCreateBrand(orgId);
    setCanCreate(hasPermission);
  };

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) });
    setErrors({ ...errors, name: undefined, slug: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orgId) {
      toast.error("ID de organización no válido");
      return;
    }

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

    setLoading(true);

    try {
      // Check if slug already exists in this organization
      const { data: existingBrand } = await supabase
        .from("brands")
        .select("id")
        .eq("organization_id", orgId)
        .eq("slug", validation.data.slug)
        .single();

      if (existingBrand) {
        setErrors({ slug: "Este slug ya está en uso en esta organización" });
        toast.error("El slug ya está en uso, por favor elige otro");
        setLoading(false);
        return;
      }

      // Create brand
      const { data: brand, error: brandError } = await supabase
        .from("brands")
        .insert({
          organization_id: orgId,
          name: validation.data.name,
          slug: validation.data.slug,
          industry: validation.data.industry || null,
          website: validation.data.website || null,
          logo_url: validation.data.logo_url || null,
        })
        .select()
        .single();

      if (brandError) throw brandError;

      toast.success("Marca creada exitosamente");
      navigate(`/organizations/${orgId}/brands`);
    } catch (error: any) {
      console.error("Error creating brand:", error);
      if (error.code === '23505') {
        toast.error("Ya existe una marca con este nombre o slug");
      } else {
        toast.error("Error al crear la marca");
      }
    } finally {
      setLoading(false);
    }
  };

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No tienes permisos para crear marcas en esta organización</p>
            <Button onClick={() => navigate(`/organizations/${orgId}`)} className="mt-4">
              Volver a organización
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
          <Button variant="ghost" onClick={() => navigate(`/organizations/${orgId}/brands`)}>
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
                <CardTitle className="text-2xl">Nueva Marca</CardTitle>
                <CardDescription>Crea una nueva marca para tu organización</CardDescription>
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
                  placeholder="mi-marca"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase() })}
                  className={errors.slug ? "border-destructive" : ""}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground">
                  Solo letras minúsculas, números y guiones. Se genera automáticamente del nombre.
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

              <ImageUpload
                bucket="brand-logos"
                currentImageUrl={formData.logo_url}
                onImageUrlChange={(url) => setFormData({ ...formData, logo_url: url })}
                label="Logo de la marca (opcional)"
                error={errors.logo_url}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/organizations/${orgId}/brands`)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creando..." : "Crear Marca"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBrandPage;