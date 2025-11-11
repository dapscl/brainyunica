import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, ArrowRight, Sparkles, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShowcasePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Plataforma de Gestión de Redes Sociales</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Gestiona Múltiples Marcas
            <span className="text-primary"> en Una Sola Plataforma</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Calendarización inteligente, workflow de aprobaciones y publicación multicanal para equipos de marketing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/showcase/brands')} className="gap-2">
              Ver Demo Interactivo
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/showcase/pricing')}>
              Ver Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="pt-6 text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">3</div>
              <p className="text-muted-foreground">Marcas en el Demo</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardContent className="pt-6 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">9</div>
              <p className="text-muted-foreground">Contenidos Programados</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">18</div>
              <p className="text-muted-foreground">Aprobaciones Activas</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Funcionalidades Principales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">📅 Calendarización Inteligente</h3>
                <p className="text-muted-foreground">
                  Programa contenido con fechas y horarios específicos. Visualiza todo tu calendario de publicaciones.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">✅ Workflow de Aprobaciones</h3>
                <p className="text-muted-foreground">
                  Sistema de revisión y aprobación con múltiples revisores, comentarios y estados en tiempo real.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">🌐 Publicación Multicanal</h3>
                <p className="text-muted-foreground">
                  Gestiona Facebook, Instagram, LinkedIn, Twitter y TikTok desde un solo lugar.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">📊 Gestión Multi-Marca</h3>
                <p className="text-muted-foreground">
                  Administra múltiples marcas y proyectos con equipos y permisos diferenciados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-primary/5 rounded-3xl p-12 border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Listo para Probarlo?
          </h2>
          <p className="text-lg text-muted-foreground">
            Explora el demo interactivo y descubre cómo funciona la plataforma con ejemplos reales.
          </p>
          <Button size="lg" onClick={() => navigate('/showcase/brands')} className="gap-2">
            Explorar Demo Interactivo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage;
