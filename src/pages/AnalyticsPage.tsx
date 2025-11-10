import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { DynamicBreadcrumb } from "@/components/navigation/DynamicBreadcrumb";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area } from "recharts";
import { Building2, Package, Briefcase, Users, TrendingUp, Activity, Download, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats | null>(null);
  const [projectsByStatus, setProjectsByStatus] = useState<ProjectsByStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("monthly");

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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{t("analytics.title")}</h1>
              <p className="text-muted-foreground">
                Visualiza el rendimiento y actividad de tu organización
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t("analytics.daily")}</SelectItem>
                  <SelectItem value="weekly">{t("analytics.weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("analytics.monthly")}</SelectItem>
                  <SelectItem value="yearly">{t("analytics.yearly")}</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t("analytics.export")}
              </Button>
            </div>
          </div>
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
            <div className="grid gap-6 md:grid-cols-2 mb-6">
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

            {/* Additional Analytics */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Crecimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { mes: "Ene", proyectos: 4, marcas: 2 },
                        { mes: "Feb", proyectos: 6, marcas: 3 },
                        { mes: "Mar", proyectos: 8, marcas: 4 },
                        { mes: "Abr", proyectos: 10, marcas: 5 },
                        { mes: "May", proyectos: 12, marcas: 6 },
                        { mes: "Jun", proyectos: stats?.totalProjects || 15, marcas: stats?.totalBrands || 7 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorBrands" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="proyectos" stroke="#6366f1" fillOpacity={1} fill="url(#colorProjects)" />
                      <Area type="monotone" dataKey="marcas" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorBrands)" />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actividad de Equipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { semana: "Sem 1", actividad: 12 },
                        { semana: "Sem 2", actividad: 19 },
                        { semana: "Sem 3", actividad: 15 },
                        { semana: "Sem 4", actividad: 25 },
                        { semana: "Sem 5", actividad: 22 },
                        { semana: "Sem 6", actividad: 30 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semana" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="actividad" stroke="#ec4899" strokeWidth={2} />
                    </LineChart>
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
