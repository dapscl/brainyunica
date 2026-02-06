import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Check, ArrowRight, Calendar, Sparkles } from "lucide-react";
import { ShowcaseHeader } from "@/components/showcase/ShowcaseHeader";
import { toast } from "sonner";

interface PlanTier {
  id: string;
  name: string;
  priceMonthly: number;
  priceId: string;
  description: string;
  features: string[];
  popular?: boolean;
  requiresDemo?: boolean;
}

const plans: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 500,
    priceId: "price_1SucOORrQcDBm2eUzPsW7qoY",
    description: "Para equipos pequeños y startups",
    features: [
      "1 marca completa",
      "3 usuarios incluidos",
      "100 publicaciones/mes",
      "IA para copys e imágenes",
      "Meta y Google Ads",
      "100 GB almacenamiento",
    ],
  },
  {
    id: "small-agencies",
    name: "Small Agencies",
    priceMonthly: 1250,
    priceId: "price_1SucOoRrQcDBm2eUhCpVcbFN",
    description: "Para agencias boutique",
    features: [
      "Todo lo de Starter, más:",
      "Hasta 5 marcas activas",
      "10 usuarios incluidos",
      "500 publicaciones/mes",
      "Flujos de aprobación",
      "TikTok y LinkedIn",
      "500 GB almacenamiento",
    ],
    popular: true,
  },
  {
    id: "scaled-agencies",
    name: "Scaled Agencies",
    priceMonthly: 3750,
    priceId: "price_1SucUVRrQcDBm2eU8wiFgyHY",
    description: "Para agencias medianas",
    features: [
      "Todo lo de Small Agencies, más:",
      "Hasta 15 marcas",
      "25 usuarios incluidos",
      "2,000 publicaciones/mes",
      "Automatización total",
      "1 TB almacenamiento",
      "Soporte prioritario",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 5000,
    priceId: "price_1SucaFRrQcDBm2eUj7leQSBJ",
    description: "Soluciones sin límites",
    features: [
      "Marcas y usuarios ilimitados",
      "API abierta + integraciones",
      "IA multimodal",
      "Soporte dedicado 24/7",
      "Onboarding personalizado",
    ],
    requiresDemo: true,
  },
];

const SelectPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Selecciona tu plan - Brainy";

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session?.user) {
        navigate("/signup", { replace: true });
      } else {
        setUser(data.session.user);
      }
    });
  }, [navigate]);

  const handleSelectPlan = async (plan: PlanTier) => {
    if (plan.requiresDemo) {
      // Redirect to demo booking
      window.open("https://calendly.com/brainy-demo", "_blank");
      return;
    }

    if (!user) {
      toast.error("Debes iniciar sesión primero");
      return;
    }

    setLoading(plan.id);
    
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: plan.priceId,
          mode: "subscription",
          successUrl: `${window.location.origin}/onboarding?plan=${plan.id}`,
          cancelUrl: `${window.location.origin}/select-plan`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No se pudo crear la sesión de pago");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error(err?.message || "Error al iniciar el pago");
    } finally {
      setLoading(null);
    }
  };

  const handleStartTrial = () => {
    // Start trial with Starter plan
    navigate("/trial");
  };

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseHeader />

      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selecciona tu plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu operación. 
            Todos incluyen acceso completo a los 5 Brainies.
          </p>

          {/* Trial CTA */}
          <Button
            variant="outline"
            size="lg"
            onClick={handleStartTrial}
            className="mt-6 border-primary/50 hover:bg-primary/10"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Prueba gratis 14 días (sin tarjeta)
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card
                className={`relative h-full flex flex-col ${
                  plan.popular
                    ? "border-primary shadow-lg scale-105"
                    : "border-border"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Más popular
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      ${plan.priceMonthly.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/mes</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={loading === plan.id}
                    variant={plan.popular ? "default" : "outline"}
                    className="w-full mt-6"
                    size="lg"
                  >
                    {loading === plan.id ? (
                      "Procesando..."
                    ) : plan.requiresDemo ? (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Agendar demo
                      </>
                    ) : (
                      <>
                        Comenzar
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Billing period info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            💡 Ahorra hasta 25% con planes anuales. Descuentos aplicados en checkout.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectPlanPage;
