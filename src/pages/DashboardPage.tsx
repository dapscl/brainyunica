import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Package, LogOut, Briefcase, BarChart3, Shield, TrendingUp } from "lucide-react";
import { robustSignOut } from "@/utils/auth";
import { usePermissions } from "@/hooks/usePermissions";
import { AdSpendTracker } from "@/components/dashboard/AdSpendTracker";

interface Profile {
  full_name: string | null;
  email: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const { isGlobalAdmin } = usePermissions();

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
            <h1 className="text-2xl font-bold">ÚNICA Command Center</h1>
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
          <h2 className="text-3xl font-bold mb-2">Brainy Command Center</h2>
          <p className="text-muted-foreground">
            Tu centro de gestión integral para marketing, creatividad y análisis
          </p>
        </div>

        {/* Ad Spend Tracker Dashboard */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Ad Spend Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitoreo en tiempo real de tu inversión publicitaria
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
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Base de datos configurada y lista para usar</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Base de datos core configurada
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Sistema de roles implementado
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Autenticación activa
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Páginas de gestión creadas
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Sistema de redes sociales activo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Editor de contenido rico
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Brand Kit configurado
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Sistema de auditoría activo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Notificaciones implementadas
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Sistema de aprobaciones completo
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Biblioteca de medios activa
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Panel de administración de usuarios
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;
