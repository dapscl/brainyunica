import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Package, LogOut, Briefcase, BarChart3, Shield, TrendingUp } from "lucide-react";
import { robustSignOut } from "@/utils/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { AdSpendTracker } from "@/components/dashboard/AdSpendTracker";
import { AutonomousStatePanel } from "@/components/dashboard/AutonomousStatePanel";
import { useUserOrganizations } from "@/hooks/useUserOrganizations";

interface Profile {
  full_name: string | null;
  email: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { isGlobalAdmin } = usePermissions();
  const { organizations } = useUserOrganizations();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();
        
        if (data) setProfile(data);
      }
    };

    loadProfile();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Brainy — Centro de Dirección</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.full_name || profile?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={() => robustSignOut()}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Decision Layer™</p>
          <h2 className="text-3xl font-bold mb-2">Centro de Dirección</h2>
          <p className="text-muted-foreground">
            Decisiones que Brainy ya tomó y recomendaciones estratégicas en curso
          </p>
        </div>

        {/* Decision Layer™ — Autonomous State */}
        <div className="mb-8">
          <AutonomousStatePanel organizationId={organizations?.[0]?.id} />
        </div>

        {/* Investment Governance */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Gobierno de Inversión</h3>
              <p className="text-sm text-muted-foreground">
                Decisiones de distribución de presupuesto en tiempo real
              </p>
            </div>
          </div>
          <AdSpendTracker />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/organizations")}>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Organizaciones</CardTitle>
              <CardDescription>
                Gestiona tus organizaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver organizaciones
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/organizations")}>
            <CardHeader>
              <Package className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Marcas</CardTitle>
              <CardDescription>
                Administra tus marcas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver marcas
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/organizations")}>
            <CardHeader>
              <Briefcase className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Proyectos</CardTitle>
              <CardDescription>
                Gestiona tus proyectos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver proyectos
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/analytics")}>
            <CardHeader>
              <BarChart3 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Analítica</CardTitle>
              <CardDescription>
                Métricas y reportes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Ver analítica
              </Button>
            </CardContent>
          </Card>

          {isGlobalAdmin && (
            <Card className="hover:shadow-glow transition-smooth cursor-pointer" onClick={() => navigate("/admin/users")}>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Administración</CardTitle>
                <CardDescription>
                  Gestión de usuarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Panel de admin
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Decision Layer™ — Estado Operativo</CardTitle>
            <CardDescription>Sistemas de dirección activos y listos para gobernar</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Capa de decisión estratégica activa
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Gobierno de roles y permisos operativo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Autenticación y control de acceso
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Dirección de contenido multicanal
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Gobierno de inversión publicitaria
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Identidad de marca blindada
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Trazabilidad y auditoría completa
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Sistema de notificaciones inteligentes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Flujo de aprobación sin fricción
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;
