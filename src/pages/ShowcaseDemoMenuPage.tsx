import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Workflow, Sparkles } from 'lucide-react';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';

export default function ShowcaseDemoMenuPage() {
  return (
    <div className="min-h-screen bg-dark-surface">
      <ShowcaseSEO 
        title="Demo - BrainybyUnica"
        description="Accede al flujo completo de demostración de BrainybyUnica"
        path="/demo"
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
              Demo Interactivo
            </h1>
            <p className="text-foreground/70 text-lg">
              Explora el flujo completo de configuración y gestión de marcas
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Onboarding Card */}
            <Card className="bg-dark-surface/50 border-border/40 backdrop-blur-sm hover:border-electric-cyan/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-electric-cyan to-purple-accent/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Workflow className="w-6 h-6 text-background" />
                </div>
                <CardTitle className="text-2xl text-foreground">Onboarding Flow</CardTitle>
                <CardDescription className="text-foreground/60">
                  Proceso completo de configuración inicial de marca con los 5 Brainies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/onboarding">
                  <Button className="w-full bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold">
                    Iniciar Onboarding
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Brands Card */}
            <Card className="bg-dark-surface/50 border-border/40 backdrop-blur-sm hover:border-purple-accent/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-accent to-electric-cyan/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6 text-background" />
                </div>
                <CardTitle className="text-2xl text-foreground">Brand Showcase</CardTitle>
                <CardDescription className="text-foreground/60">
                  Explora ejemplos de marcas configuradas con contenido y campañas activas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/brands">
                  <Button className="w-full bg-gradient-to-r from-purple-accent to-electric-cyan hover:opacity-90 text-background font-semibold">
                    Ver Marcas
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Generate Demo Data Card */}
            <Card className="md:col-span-2 bg-dark-surface/50 border-border/40 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-400 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-background" />
                </div>
                <CardTitle className="text-2xl text-foreground">Generar Datos de Prueba</CardTitle>
                <CardDescription className="text-foreground/60">
                  Crea una organización demo completa con marcas, proyectos, contenido y templates de ejemplo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/demo-generator">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-400 hover:opacity-90 text-background font-semibold">
                    Generar Demo Completa
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 p-6 rounded-lg bg-electric-cyan/5 border border-electric-cyan/20">
            <p className="text-sm text-foreground/60 text-center">
              <strong className="text-electric-cyan">Nota:</strong> Esta sección es solo para demostración. 
              Para acceder necesitas estar autenticado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
