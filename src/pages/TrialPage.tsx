import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Sparkles, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  TrendingUp,
  Instagram,
  Check,
  ArrowRight,
  Clock,
  Zap,
  Shield
} from 'lucide-react';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';

const TrialPage = () => {
  const navigate = useNavigate();

  const brainies = [
    {
      name: 'CreatorBrainy',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      description: 'Genera contenido con el tono de tu marca aprendido de Instagram'
    },
    {
      name: 'CalendarBrainy',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      description: 'Agenda y publica automáticamente en el mejor horario'
    },
    {
      name: 'AdBrainy',
      icon: BarChart3,
      color: 'from-cyan-500 to-green-500',
      description: 'Optimiza campañas publicitarias con IA'
    },
    {
      name: 'ChatBrainy',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500',
      description: 'Responde y convierte leads en tiempo real'
    },
    {
      name: 'TrendBrainy',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      description: 'Detecta tendencias y sugiere contenido viral'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Crea tu cuenta',
      description: 'Registro rápido con email',
      icon: Zap
    },
    {
      number: '02',
      title: 'Conecta Instagram',
      description: 'Brainy aprende tu estilo',
      icon: Instagram
    },
    {
      number: '03',
      title: 'Genera contenido',
      description: 'CreatorBrainy crea por ti',
      icon: Sparkles
    },
    {
      number: '04',
      title: 'Recibe sugerencias',
      description: 'TrendBrainy detecta oportunidades',
      icon: TrendingUp
    }
  ];

  const included = [
    'Acceso completo a los 5 Brainies',
    'Generación ilimitada de contenido',
    'Análisis de tendencias semanal',
    'Conexión con Instagram',
    'Dashboard completo',
    'Soporte por chat'
  ];

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseSEO 
        title="Prueba Gratis 45 Días | Brainy"
        description="Prueba Brainy gratis durante 45 días. Acceso completo a los 5 Brainies: CreatorBrainy, CalendarBrainy, AdBrainy, ChatBrainy y TrendBrainy."
      />
      <ShowcaseHeader />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/5 via-purple-accent/5 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-electric-cyan/10 border border-electric-cyan/20 mb-6">
              <Clock className="w-4 h-4 text-electric-cyan" />
              <span className="text-sm text-electric-cyan font-medium">45 días gratis</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-electric-cyan via-purple-accent to-electric-cyan bg-clip-text text-transparent">
                Prueba Brainy
              </span>
              <br />
              <span className="text-foreground">sin compromiso</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Acceso completo a los 5 Brainies durante 45 días. 
              Conecta tu Instagram y deja que la IA aprenda tu estilo.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-white shadow-glow-cyan text-lg px-8"
              >
                Comenzar gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                size="lg"
                className="border-electric-cyan/30 text-foreground hover:bg-electric-cyan/10"
              >
                Ver cómo funciona
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              Sin tarjeta de crédito requerida
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-dark-surface/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Empieza en 4 pasos
            </h2>
            <p className="text-muted-foreground">
              Configura tu cuenta y empieza a crear contenido en minutos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-6 h-full hover:border-electric-cyan/40 transition-colors">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-r from-electric-cyan to-purple-accent flex items-center justify-center text-sm font-bold text-white">
                    {step.number}
                  </div>
                  <step.icon className="w-10 h-10 text-electric-cyan mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brainies Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              5 Brainies, acceso completo
            </h2>
            <p className="text-muted-foreground">
              Todo incluido en tu trial de 45 días
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brainies.map((brainy, index) => (
              <motion.div
                key={brainy.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card/30 backdrop-blur-sm border-border/50 p-6 hover:border-electric-cyan/30 transition-all group">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${brainy.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <brainy.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {brainy.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {brainy.description}
                  </p>
                </Card>
              </motion.div>
            ))}
            
            {/* Instagram Learning Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/30 p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-4">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Aprendizaje de marca
                </h3>
                <p className="text-sm text-muted-foreground">
                  Conecta tu @usuario y Brainy aprende tu tono, estilo y personalidad de marca
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-dark-surface/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Todo incluido
              </h2>
              <p className="text-muted-foreground">
                Sin restricciones durante tu período de prueba
              </p>
            </motion.div>

            <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20 p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {included.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                ¿Listo para empezar?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              45 días para probar todo. Sin compromiso. Sin tarjeta.
            </p>
            
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-white shadow-glow-cyan text-lg px-12 py-6"
            >
              Comenzar mi trial gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <p className="text-sm text-muted-foreground mt-6">
              ¿Tienes preguntas? <a href="/lead-capture" className="text-electric-cyan hover:underline">Solicita una demo</a>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TrialPage;
