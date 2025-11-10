import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { SearchBar } from "@/components/search/SearchBar";
import { DynamicBreadcrumb } from "@/components/navigation/DynamicBreadcrumb";
import { BrandCardSkeleton } from "@/components/skeletons/CardSkeletons";
import { Palette, Plus, ExternalLink, Edit } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

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
  const { canEditBrand } = usePermissions();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editableBrands, setEditableBrands] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadBrands();
  }, [orgId]);

  const checkEditPermissions = async (brandIds: string[]) => {
    const editable = new Set<string>();
    await Promise.all(
      brandIds.map(async (id) => {
        const canEdit = await canEditBrand(id);
        if (canEdit) editable.add(id);
      })
    );
    setEditableBrands(editable);
  };

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
      
      // Check edit permissions for all brands
      if (data && data.length > 0) {
        await checkEditPermissions(data.map(b => b.id));
      }
    } catch (error) {
      console.error("Error loading brands:", error);
      toast.error("Error al cargar marcas");
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.industry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <DynamicBreadcrumb />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <BrandCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb />
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Marcas</h1>
              <p className="text-muted-foreground">Gestiona las marcas de tu organización</p>
            </div>
            <Button onClick={() => navigate(`/organizations/${orgId}/brands/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Marca
            </Button>
          </div>
          {brands.length > 0 && (
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Buscar marcas..." 
            />
          )}
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
          <>
            {filteredBrands.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Palette className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No se encontraron marcas</h3>
                  <p className="text-muted-foreground">
                    Intenta con otros términos de búsqueda
                  </p>
                </CardContent>
              </Card>
            ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBrands.map((brand) => (
              <Card
                key={brand.id}
                className="hover:shadow-glow transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Palette className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{brand.name}</CardTitle>
                      </div>
                    </div>
                    {editableBrands.has(brand.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/brands/${brand.id}/edit`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
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
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default BrandsPage;