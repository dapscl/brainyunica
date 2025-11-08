import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  industry: string;
  website: string;
  logo_url: string;
  slug: string;
  organization_id: string;
  created_at: string;
}

const BrandsPage = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBrands();
  }, [orgId]);

  const loadBrands = async () => {
    try {
      const query = supabase
        .from("brands")
        .select("*")
        .order("created_at", { ascending: false });

      if (orgId) {
        query.eq("organization_id", orgId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBrands(data || []);
    } catch (error) {
      console.error("Error loading brands:", error);
      toast.error("Error al cargar marcas");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Marcas</h1>
            <p className="text-muted-foreground">Gestiona las marcas de tu organización</p>
          </div>
          <Button onClick={() => navigate(`/organizations/${orgId}/brands/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Marca
          </Button>
        </div>

        {brands.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Palette className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tienes marcas</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera marca para comenzar
              </p>
              <Button onClick={() => navigate(`/organizations/${orgId}/brands/new`)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Marca
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Card
                key={brand.id}
                className="hover:shadow-glow transition-smooth cursor-pointer"
                onClick={() => navigate(`/brands/${brand.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Palette className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{brand.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {brand.industry || "Sin categoría"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {brand.website && (
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-4 w-4" />
                      {brand.website}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandsPage;