import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { createProjectSchema, type CreateProjectInput } from "@/lib/validations";

interface Brand {
  id: string;
  name: string;
  organization_id: string;
}

const CreateProjectPage = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { canCreateBrand, loading: permissionsLoading } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<CreateProjectInput>({
    name: "",
    description: "",
    brand_id: "",
    status: "planning",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateProjectInput, string>>>({});

  useEffect(() => {
    if (orgId) {
      checkPermissions();
      loadBrands();
    }
  }, [orgId]);

  const checkPermissions = async () => {
    if (!orgId) return;
    const hasPermission = await canCreateBrand(orgId);
    setCanCreate(hasPermission);
  };

  const loadBrands = async () => {
    try {
      if (!orgId) return;

      const { data, error } = await supabase
        .from("brands")
        .select("id, name, organization_id")
        .eq("organization_id", orgId)
        .order("name");

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error("Error loading brands:", error);
      toast.error("Error al cargar marcas");
    }
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

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Debes iniciar sesión");
        navigate("/auth");
        return;
      }

      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          brand_id: validation.data.brand_id,
          name: validation.data.name,
          description: validation.data.description || null,
          status: validation.data.status,
          start_date: validation.data.start_date,
          end_date: validation.data.end_date || null,
          created_by: user.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      toast.success("Proyecto creado exitosamente");
      navigate(`/organizations/${orgId}/projects`);
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error("Error al crear el proyecto");
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
            <p className="text-muted-foreground">No tienes permisos para crear proyectos en esta organización</p>
            <Button onClick={() => navigate(`/organizations/${orgId}`)} className="mt-4">
              Volver a organización
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No hay marcas disponibles</h3>
            <p className="text-muted-foreground mb-6">
              Necesitas crear al menos una marca antes de crear un proyecto
            </p>
            <Button onClick={() => navigate(`/organizations/${orgId}/brands/new`)}>
              Crear marca
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
          <Button variant="ghost" onClick={() => navigate(`/organizations/${orgId}/projects`)}>
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
                <CardTitle className="text-2xl">Nuevo Proyecto</CardTitle>
                <CardDescription>Crea un nuevo proyecto para una de tus marcas</CardDescription>
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
                  onClick={() => navigate(`/organizations/${orgId}/projects`)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creando..." : "Crear Proyecto"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProjectPage;