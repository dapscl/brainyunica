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
      icon: Calendar,
      title: "Gestión & Calendarización",
      description: "Todo tu equipo, un solo tablero. Organiza campañas, contenidos y aprobaciones."
    },
    {
      icon: Palette,
      title: "Creatividad & Contenidos",
      description: "Editor interno + plantillas + IA para generar piezas que convierten."
    },
    {
      icon: Zap,
      title: "Automatización",
      description: "Aprobación → publicación → métrica, sin esperas. Flujos que ahorran horas."
    },
    {
      icon: DollarSign,
      title: "Publicidad & Medios",
      description: "Conexión directa con Meta, TikTok, Google, LinkedIn. Todo desde un solo lugar."
    },
    {
      icon: Sparkles,
      title: "Analítica & IA",
      description: "Insights que hablan tu idioma y accionan en tu nombre. Datos que generan decisiones."
    },
    {
      icon: Package,
      title: "Brand Kit & Librerías",
      description: "Identidad intacta, marca protegida. Colores, fuentes, logos y estilos bloqueados."
    }
  ];

  const plans = [
    {
      name: "Startup",
      price: "$250",
      period: "/mes",
      description: "Emprendedores o equipos internos pequeños",
      features: [
        "1 marca activa",
        "100% de funcionalidades",
        "Calendarización y gestión",
        "Creación con IA integrada",
        "Integraciones con medios pagados",
        "Aprobaciones automáticas",
        "Brand Kit completo",
        "Dashboard y analítica"
      ],
      cta: "Comenzar ahora",
      popular: false
    },
    {
      name: "Small Agency",
      price: "$1,250",
      period: "/mes",
      description: "Agencias boutique o estudios creativos",
      features: [
        "5 marcas operando en paralelo",
        "100% de funcionalidades por marca",
        "Roles y permisos por equipo",
        "Automatización multicanal",
        "Publicación en Meta, TikTok, Google, LinkedIn",
        "Brand Kit por marca",
        "Dashboard consolidado",
        "Soporte prioritario"
      ],
      cta: "Escalar operación",
      popular: true
    },
    {
      name: "Scaled Agency",
      price: "Personalizado",
      period: "",
      description: "Agencias de volumen o corporaciones multinivel",
      features: [
        "10+ marcas simultáneas",
        "100% de funcionalidades por marca",
        "Gestión multi-equipo avanzada",
        "API abierta y conectores",
        "Analítica avanzada consolidada",
        "Automatización total",
        "Dedicated Account Manager",
        "SLA y soporte dedicado"
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
              Única Command Center
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
              Cuatro plataformas, una sola interfaz. Gestiona tu marca desde el brief hasta el ROI.
            </p>
            <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              🚀 Empieza ahora y transforma creatividad, automatización y resultados en un solo lugar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="text-lg px-8">
                Empieza hoy
              </Button>
              <Button size="lg" variant="secondary" className="text-lg px-8 bg-white/90 hover:bg-white text-foreground">
                Agenda tu demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tu marca lo hace todo Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Tu marca lo hace todo
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Imagina una sola herramienta donde:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                <p className="text-foreground">Calendarizas campañas, contenidos y aprobaciones.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                <p className="text-foreground">Generas creativos con IA y plantillas inteligentes.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                <p className="text-foreground">Publicas en Meta, TikTok, Google, LinkedIn sin cambiar de app.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary shrink-0 mt-1" />
                <p className="text-foreground">Mides impacto con datos reales en tiempo real.</p>
              </div>
            </div>
            <p className="text-xl font-semibold mt-8 text-primary">
              Con Única Command Center, tu marca opera sin silos.
            </p>
          </div>
        </div>
      </section>

      {/* Verticales Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Verticales de valor
            </h2>
          </div>
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
              Pricing por marca activa
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              <strong className="text-foreground">USD $250/mes por marca.</strong> Cada marca tiene acceso completo a todas las funciones: calendarización, IA, integraciones con medios, aprobaciones y analítica.
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

      {/* Qué incluye Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Qué incluye
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-foreground">Marcas activas, usuarios y recursos dimensionados para cada plan.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-foreground">Generaciones IA, publicaciones automatizadas y espacio de almacenamiento escalables.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-foreground">Integraciones completas: Adobe CC, Meta Ads, Google Ads, TikTok, LinkedIn.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-foreground">Soporte adaptado al nivel: email, chat o manager dedicado.</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur md:col-span-2">
                <CardContent className="pt-6">
                  <p className="text-foreground text-center">Consumo adicional gestionado mediante créditos y addons.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué es diferente Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Por qué es diferente
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground">
              <p>Porque reúne en una sola plataforma lo que antes requería cuatro herramientas distintas.</p>
              <p>Porque convierte la creatividad en resultados medibles.</p>
              <p>Porque elimina fricción: un login, una interfaz, una operación fluida.</p>
              <p className="text-xl font-semibold text-primary">Porque tu marca no solo publica, gana.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Empieza hoy
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Agenda tu demo privada y descubre cómo Única Command Center puede transformar tu operación de marketing.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="text-lg px-8 bg-white hover:bg-white/90 text-foreground"
            onClick={() => navigate("/auth")}
          >
            Agenda tu demo
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
