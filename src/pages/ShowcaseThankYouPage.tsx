import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';

const ShowcaseThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fullName, suggestedPlan } = location.state || { fullName: 'Usuario', suggestedPlan: 'starter' };

  const planDetails = {
    starter: {
      name: 'Starter',
      price: '$500 USD base',
      adSpend: '+ 20% de inversión en medios',
      features: [
        'Hasta 3 marcas',
        'CalendarBrain™ - Publicación automatizada',
        'CreatorBrain™ - Generación básica de contenido',
        'ChatBrain™ - Respuestas automáticas',
        'Panel de métricas básico',
        'Soporte por email'
      ],
      color: 'from-green-500/20 to-green-500/5 border-green-500/30',
      icon: Users,
    },
    professional: {
      name: 'Professional',
      price: '€5K-€25K/mes base',
      adSpend: '+ 15% de inversión en medios',
      features: [
        'Hasta 10 marcas',
        'Todo de Starter +',
        'AdBrain™ - Optimización de campañas',
        'TrendBrain™ - Análisis de tendencias',
        'A/B Testing automático',
        'Reportes avanzados en tiempo real',
        'WhatsApp Project Manager',
        'Soporte prioritario'
      ],
      color: 'from-electric-cyan/20 to-electric-cyan/5 border-electric-cyan/30',
      icon: TrendingUp,
    },
    enterprise: {
      name: 'Enterprise',
      price: '€25K+/mes base',
      adSpend: '+ 10% de inversión en medios',
      features: [
        'Marcas ilimitadas',
        'Todo de Professional +',
        'API personalizada',
        'Integraciones custom',
        'Account Manager dedicado',
        'Onboarding personalizado',
        'SLA garantizado',
        'Infraestructura dedicada'
      ],
      color: 'from-purple-accent/20 to-purple-accent/5 border-purple-accent/30',
      icon: Sparkles,
    },
  };

  const plan = planDetails[suggestedPlan as keyof typeof planDetails] || planDetails.starter;
  const PlanIcon = plan.icon;

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseSEO
        title="¡Gracias por tu interés! - Unica Platform"
        description="Nos pondremos en contacto contigo pronto"
        path="/thank-you"
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Card className={`bg-card/30 backdrop-blur-sm border ${plan.color} shadow-glow-cyan`}>
            <CardHeader className="text-center pb-10">
              <div className="flex justify-center mb-8">
                <div className="bg-green-500 p-5 rounded-2xl shadow-glow">
                  <CheckCircle2 className="w-16 h-16 text-background" />
                </div>
              </div>
              <CardTitle className="text-5xl md:text-6xl font-bold uppercase tracking-tight mb-6 text-foreground">
                ¡Gracias, {fullName.split(' ')[0]}!
              </CardTitle>
              <CardDescription className="text-xl text-muted-foreground font-light">
                Basado en tu perfil, te recomendamos el plan:
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-10">
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <PlanIcon className="w-20 h-20 text-electric-cyan animate-pulse" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full"
                    />
                  </div>
                </div>
                <h3 className="text-6xl md:text-7xl font-bold uppercase tracking-tight text-foreground">{plan.name}</h3>
                <div className="space-y-3">
                  <p className="text-4xl font-bold text-electric-cyan">{plan.price}</p>
                  <p className="text-2xl text-purple-accent font-bold">{plan.adSpend}</p>
                  <Badge variant="outline" className="text-base px-4 py-2 border-electric-cyan/30 text-electric-cyan bg-electric-cyan/10">
                    + Integración única del 50%
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <h4 className="text-2xl font-bold uppercase tracking-tight text-foreground mb-6">Incluye:</h4>
                {plan.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-6 h-6 text-electric-cyan mt-0.5 flex-shrink-0" />
                    <span className="text-foreground text-lg font-light">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-10 space-y-6">
                <Button
                  size="lg"
                  className="w-full text-xl py-8 bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan transition-all duration-300"
                  onClick={() => navigate('/')}
                >
                  Volver al Showcase
                </Button>
                <p className="text-center text-base text-muted-foreground font-light">
                  Nuestro equipo se pondrá en contacto contigo en las próximas 24 horas
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ShowcaseThankYouPage;
