import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { DynamicBreadcrumb } from "@/components/navigation/DynamicBreadcrumb";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Building2, Package, Briefcase, Users, TrendingUp, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalOrganizations: number;
  totalBrands: number;
  totalProjects: number;
  totalMembers: number;
}

interface ProjectsByStatus {
  name: string;
  value: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projectsByStatus, setProjectsByStatus] = useState<ProjectsByStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load organizations
      const { data: orgMembers } = await supabase
        .from("organization_members")
        .select("organization_id")
        .eq("user_id", user.id);

      const orgIds = orgMembers?.map(om => om.organization_id) || [];

      // Load brands
      const { data: brands } = await supabase
        .from("brands")
        .select("id")
        .in("organization_id", orgIds);

      const brandIds = brands?.map(b => b.id) || [];

      // Load projects
      const { data: projects } = await supabase
        .from("projects")
        .select("status")
        .in("brand_id", brandIds);

      // Load members count
      const { data: members } = await supabase
        .from("organization_members")
        .select("id")
        .in("organization_id", orgIds);

      // Calculate stats
      setStats({
        totalOrganizations: orgIds.length,
        totalBrands: brands?.length || 0,
        totalProjects: projects?.length || 0,
        totalMembers: members?.length || 0,
      });

      // Group projects by status
      const statusCounts: Record<string, number> = {};
      projects?.forEach(p => {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      });

      const statusLabels: Record<string, string> = {
        planning: "Planificación",
        active: "Activo",
        on_hold: "En Pausa",
        completed: "Completado",
        cancelled: "Cancelado",
      };

      setProjectsByStatus(
        Object.entries(statusCounts).map(([status, count]) => ({
          name: statusLabels[status] || status,
          value: count,
        }))
      );
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Visualiza el rendimiento y actividad de tu organización
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Organizaciones</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalOrganizations || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Marcas</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalBrands || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProjects || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Miembros</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalMembers || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Proyectos por Estado</CardTitle>
                </CardHeader>
                <CardContent>
                  {projectsByStatus.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={projectsByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {projectsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      No hay datos disponibles
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Recursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: "Organizaciones", value: stats?.totalOrganizations || 0 },
                        { name: "Marcas", value: stats?.totalBrands || 0 },
                        { name: "Proyectos", value: stats?.totalProjects || 0 },
                        { name: "Miembros", value: stats?.totalMembers || 0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#6366f1" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
