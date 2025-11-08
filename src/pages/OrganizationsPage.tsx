import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, Package } from "lucide-react";
import { toast } from "sonner";

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  created_at: string;
}

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("organization_members")
        .select(`
          organization_id,
          organizations (
            id,
            name,
            slug,
            subscription_tier,
            created_at
          )
        `)
        .eq("user_id", user.id);

      if (error) throw error;

      const orgs = data
        ?.map((item: any) => item.organizations)
        .filter(Boolean) as Organization[];
      
      setOrganizations(orgs || []);
    } catch (error) {
      console.error("Error loading organizations:", error);
      toast.error("Error al cargar organizaciones");
    } finally {
      setLoading(false);
    }
  };

  const getTierBadgeColor = (tier: string) => {
    const colors: Record<string, string> = {
      startup: "bg-blue-500",
      small_agencies: "bg-purple-500",
      scaled_agencies: "bg-pink-500",
      enterprise: "bg-gradient-primary",
    };
    return colors[tier] || "bg-gray-500";
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
            <h1 className="text-4xl font-bold mb-2">Organizaciones</h1>
            <p className="text-muted-foreground">Gestiona tus organizaciones y equipos</p>
          </div>
          <Button onClick={() => navigate("/organizations/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Organización
          </Button>
        </div>

        {organizations.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tienes organizaciones</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera organización para comenzar
              </p>
              <Button onClick={() => navigate("/organizations/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Organización
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card
                key={org.id}
                className="hover:shadow-glow transition-smooth cursor-pointer"
                onClick={() => navigate(`/organizations/${org.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{org.name}</CardTitle>
                        <CardDescription>@{org.slug}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={getTierBadgeColor(org.subscription_tier)}>
                      {org.subscription_tier.replace("_", " ")}
                    </Badge>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>Marcas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>Equipo</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationsPage;