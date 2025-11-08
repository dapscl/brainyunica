import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Palette, Calendar, Zap, DollarSign, Users, CheckCircle2, Sparkles } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  const features = [
    {
      icon: Palette,
      title: "Diseño y Creatividad",
      description: "Integración directa con Adobe Creative Cloud. Edita plantillas, genera contenido y mantén la consistencia de marca."
    },
    {
      icon: Calendar,
      title: "Calendario Automatizado",
      description: "Programa publicaciones, sincroniza con Google Calendar y automatiza flujos de trabajo completos."
    },
    {
      icon: Zap,
      title: "Paid Media",
      description: "Gestiona campañas en Meta Ads, Google Ads, TikTok, LinkedIn y Pinterest desde un solo lugar."
    },
    {
      icon: Package,
      title: "Brand Kits",
      description: "Administra identidades visuales completas: colores, tipografías, logos y guías de estilo por marca."
    },
    {
      icon: DollarSign,
      title: "Facturación Integrada",
      description: "Planes, suscripciones e invoices automáticos con integración Stripe y pasarelas locales."
    },
    {
      icon: Users,
      title: "Gestión de Equipos",
      description: "Roles, permisos, aprobaciones y flujos de trabajo colaborativos para agencias y clientes."
    }
  ];

  const plans = [
    {
      name: "Essential",
      price: "$490",
      period: "/mes",
      description: "Startups y equipos de marketing que necesitan centralizar todo",
      features: [
        "3 marcas completas",
        "5 usuarios incluidos",
        "500 generaciones IA mensuales",
        "100 publicaciones automáticas",
        "100 GB de almacenamiento",
        "Métricas estándar",
        "Meta / Google / Adobe",
        "Soporte por email"
      ],
      cta: "Comenzar ahora",
      popular: false
    },
    {
      name: "Professional",
      price: "$990",
      period: "/mes",
      description: "Agencias y marcas medianas con alto volumen de trabajo",
      features: [
        "10 marcas completas",
        "20 usuarios incluidos",
        "3,000 generaciones IA mensuales",
        "1,000 publicaciones automáticas",
        "500 GB de almacenamiento",
        "Métricas en tiempo real",
        "+TikTok / LinkedIn integrados",
        "IA visual + copywriting avanzado",
        "Chat prioritario"
      ],
      cta: "Escala con control",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Desde $2,500",
      period: "/mes",
      description: "Corporaciones y agencias multinivel con múltiples marcas",
      features: [
        "Marcas ilimitadas",
        "Usuarios ilimitados",
        "Generaciones IA personalizadas",
        "Publicaciones ilimitadas",
        "Almacenamiento escalable",
        "Analítica avanzada + Mix™",
        "API abierta y conectores personalizados",
        "IA avanzada (texto, imagen, voz, video)",
        "Dedicated Manager"
      ],
      cta: "Contactar ventas",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">ÚNICA</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/auth")}>
              Iniciar sesión
            </Button>
            <Button onClick={() => navigate("/auth")}>
              Prueba gratis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[600px] flex items-center">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Hacemos contenidos que venden. Punto.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
              Agencia boutique de Performance Content Design para marcas que quieren resultados reales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
                Haz tu diagnóstico
              </Button>
              <Button size="lg" variant="secondary" className="text-lg px-8 bg-white/90 hover:bg-white text-foreground">
                Ver nuestro portafolio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-glow transition-smooth bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planes que escalan con tu agencia
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Empieza gratis por 14 días. Sin permanencia, cancela cuando quieras.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Más popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Hablemos de tu proyecto
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Completa este formulario y nos pondremos en contacto contigo
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 bg-white hover:bg-white/90 text-foreground"
            onClick={() => navigate("/auth")}
          >
            Enviar mensaje
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold">ÚNICA Command Center</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 ÚNICA. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
