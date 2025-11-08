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
      name: "Starter",
      price: "$49",
      period: "/mes",
      description: "Perfecto para freelancers y pequeños equipos",
      features: [
        "1 organización",
        "Hasta 3 marcas",
        "5 usuarios",
        "Brand Kit básico",
        "Calendario y automatizaciones",
        "Soporte por email"
      ],
      cta: "Prueba 14 días gratis",
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      period: "/mes",
      description: "Para agencias en crecimiento",
      features: [
        "Organizaciones ilimitadas",
        "Hasta 15 marcas",
        "20 usuarios",
        "Brand Kits avanzados",
        "Integraciones Adobe CC",
        "Paid Media Management",
        "Reportes y analytics",
        "Soporte prioritario"
      ],
      cta: "Prueba 14 días gratis",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Para grandes agencias y corporativos",
      features: [
        "Todo en Professional",
        "Marcas ilimitadas",
        "Usuarios ilimitados",
        "Integraciones personalizadas",
        "API dedicada",
        "SLA garantizado",
        "Account manager dedicado",
        "Onboarding personalizado"
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
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            La plataforma todo-en-uno para agencias
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Command Center para Agencias Creativas
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Unifica creatividad, automatización, datos y pagos en una sola plataforma. 
            Desde diseño hasta publicación, sin salir de ÚNICA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
              Empieza tu prueba de 14 días
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Sin tarjeta de crédito • Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deja de usar 10 herramientas diferentes. ÚNICA centraliza creatividad, 
              automatización y gestión de campañas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>{feature.title}</CardTitle>
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
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para transformar tu agencia?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a las agencias que ya confían en ÚNICA para gestionar su creatividad y campañas.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Empieza tu prueba gratuita
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
