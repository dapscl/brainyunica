import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, Users, Package, Settings, Edit } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";

interface Organization {
  id: string;
  name: string;
  slug: string;
  subscription_tier: string;
  created_at: string;
}

const OrganizationsPage = () => {
  const navigate = useNavigate();
  const { canCreateOrganization, canEditOrganization } = usePermissions();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [editableOrgs, setEditableOrgs] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadOrganizations();
  }, []);

  const checkEditPermissions = async (orgIds: string[]) => {
    const editable = new Set<string>();
    await Promise.all(
      orgIds.map(async (id) => {
        const canEdit = await canEditOrganization(id);
        if (canEdit) editable.add(id);
      })
    );
    setEditableOrgs(editable);
  };

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
      
      // Check edit permissions for all orgs
      if (orgs && orgs.length > 0) {
        await checkEditPermissions(orgs.map(o => o.id));
      }
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
                className="hover:shadow-glow transition-smooth"
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
                    {editableOrgs.has(org.id) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/organizations/${org.id}/edit`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getTierBadgeColor(org.subscription_tier)}>
                      {org.subscription_tier.replace("_", " ")}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/organizations/${org.id}/members`);
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Equipo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/organizations/${org.id}/brands`);
                      }}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Marcas
                    </Button>
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