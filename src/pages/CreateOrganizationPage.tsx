import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2 } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { createOrganizationSchema, generateSlug, type CreateOrganizationInput } from "@/lib/validations";

const CreateOrganizationPage = () => {
  const navigate = useNavigate();
  const { canCreateOrganization, loading: permissionsLoading } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateOrganizationInput>({
    name: "",
    slug: "",
    logo_url: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateOrganizationInput, string>>>({});

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name, slug: generateSlug(name) });
    setErrors({ ...errors, name: undefined, slug: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión para crear una organización");
        navigate("/auth");
        return;
      }

      // Check if slug already exists
      const { data: existingOrg } = await supabase
        .from("organizations")
        .select("id")
        .eq("slug", validation.data.slug)
        .single();

      if (existingOrg) {
        setErrors({ slug: "Este slug ya está en uso" });
        toast.error("El slug ya está en uso, por favor elige otro");
        setLoading(false);
        return;
      }

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: validation.data.name,
          slug: validation.data.slug,
          logo_url: validation.data.logo_url || null,
          owner_id: user.id,
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add creator as owner member
      const { error: memberError } = await supabase
        .from("organization_members")
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: "owner",
        });

      if (memberError) throw memberError;

      toast.success("Organización creada exitosamente");
      navigate(`/organizations/${org.id}`);
    } catch (error: any) {
      console.error("Error creating organization:", error);
      if (error.code === '23505') {
        toast.error("Ya existe una organización con este nombre o slug");
      } else {
        toast.error("Error al crear la organización");
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

  if (!canCreateOrganization) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No tienes permisos para crear organizaciones</p>
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
                <CardTitle className="text-2xl">Nueva Organización</CardTitle>
                <CardDescription>Crea una nueva organización para gestionar tus marcas y proyectos</CardDescription>
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
                  Solo letras minúsculas, números y guiones. Se genera automáticamente del nombre.
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
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creando..." : "Crear Organización"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOrganizationPage;