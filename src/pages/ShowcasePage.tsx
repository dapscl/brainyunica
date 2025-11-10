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
            <span className="text-sm font-medium">Demo Marketing Agency</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Transformamos Marcas en
            <span className="text-primary"> Experiencias Memorables</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Agencia boutique especializada en estrategia de marca, contenido digital y gestión de redes sociales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/showcase/brands')} className="gap-2">
              Ver Nuestro Portfolio
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => window.open('https://linkedin.com', '_blank')}>
              Contáctanos
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
              <p className="text-muted-foreground">Marcas Activas</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardContent className="pt-6 text-center">
              <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">12+</div>
              <p className="text-muted-foreground">Proyectos Completados</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20">
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-muted-foreground">Satisfacción del Cliente</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestros Servicios
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Estrategia de Marca</h3>
                <p className="text-muted-foreground">
                  Desarrollamos identidades de marca coherentes y memorables que conectan con tu audiencia.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Gestión de Redes Sociales</h3>
                <p className="text-muted-foreground">
                  Creamos y gestionamos contenido atractivo para todas tus plataformas sociales.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Creación de Contenido</h3>
                <p className="text-muted-foreground">
                  Producimos contenido visual y escrito de alta calidad que cuenta tu historia.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-2">Análisis y Reportes</h3>
                <p className="text-muted-foreground">
                  Medimos el impacto de cada campaña con métricas detalladas y reportes claros.
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
            ¿Listo para Elevar tu Marca?
          </h2>
          <p className="text-lg text-muted-foreground">
            Explora nuestro portfolio de marcas exitosas y descubre cómo podemos ayudarte.
          </p>
          <Button size="lg" onClick={() => navigate('/showcase/brands')} className="gap-2">
            Ver Portfolio Completo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage;
