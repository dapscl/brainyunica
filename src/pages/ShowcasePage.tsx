import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  Bot,
  Calendar,
  Target,
  MessageSquare,
  TrendingUp,
  Zap,
  Palette,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatedHero } from '@/components/showcase/AnimatedHero';
import { BrainCard } from '@/components/showcase/BrainCard';
import AIMediaBuyerPanel from '@/components/showcase/AIMediaBuyerPanel';
import CreativePerformanceTracker from '@/components/showcase/CreativePerformanceTracker';
import MultiChannelCommunication from '@/components/showcase/MultiChannelCommunication';
import WhatsAppProjectManager from '@/components/showcase/WhatsAppProjectManager';
import InspirationLibrary from '@/components/showcase/InspirationLibrary';
import { FAQSection } from '@/components/showcase/FAQSection';
import { AnimatedMetrics } from '@/components/showcase/AnimatedMetrics';
import { motion } from 'framer-motion';

const ShowcasePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-deep-blue via-background to-background dark">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <div className="text-center max-w-6xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-6 px-6 py-3 text-electric-cyan border-electric-cyan/30 bg-electric-cyan/5">
              <Sparkles className="w-4 h-4 mr-2" />
              El futuro del marketing funcionando solo
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold tracking-tighter uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-foreground via-electric-cyan to-purple-accent bg-clip-text text-transparent">
              Mira cómo funciona
            </span>
            <br />
            <span className="text-foreground">
              una agencia cuando
            </span>
            <br />
            <span className="text-electric-cyan">
              la IA la dirige
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Brainy automatiza contenido, anuncios y conversaciones desde un solo lugar.
            <br />
            <span className="text-foreground font-medium">Sin estrés. Sin procesos. Sin límites.</span>
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/showcase/lead-capture')} 
              className="gap-2 text-lg px-10 py-7 bg-electric-cyan hover:bg-electric-cyan/90 text-background font-bold uppercase tracking-wide shadow-glow-cyan"
            >
              🚀 Ver Brainy en acción
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('brains')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-10 py-7 gap-2 border-electric-cyan/30 text-electric-cyan hover:bg-electric-cyan/10 uppercase tracking-wide"
            >
              Descubre las inteligencias
            </Button>
          </motion.div>
        </div>

        {/* Animated Hero Interface */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <AnimatedHero />
        </motion.div>
      </section>

      {/* Brains Section */}
      <section id="brains" className="container mx-auto px-4 py-32 bg-gradient-to-b from-background to-deep-blue/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-foreground">Cómo trabaja</span> <span className="text-electric-cyan">Brainy</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Detrás de Brainy hay cinco inteligencias que colaboran entre sí:
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <BrainCard 
              icon={Palette}
              title="CreatorBrainy™"
              description="Crea contenido y versiones automáticamente. Genera variantes, optimiza copy y adapta creatividades a cada plataforma sin intervención manual."
              color="purple"
              delay={0}
            />
            
            <BrainCard 
              icon={Calendar}
              title="CalendarBrainy™"
              description="Agenda, coordina y publica sin intervención. Selecciona los mejores horarios, distribuye contenido estratégicamente y ejecuta publicaciones automáticas."
              color="purple"
              delay={0.1}
            />
            
            <BrainCard 
              icon={Target}
              title="AdBrainy™"
              description="Ejecuta y optimiza tus campañas con precisión. Ajusta pujas en tiempo real, redistribuye presupuestos y maximiza ROAS automáticamente."
              color="cyan"
              delay={0.2}
            />
            
            <BrainCard 
              icon={MessageSquare}
              title="ChatBrainy™"
              description="Responde, conversa y convierte leads en tiempo real. Automatiza respuestas, califica intención de compra y captura oportunidades al instante."
              color="green"
              delay={0.3}
            />
            
            <div className="md:col-span-2">
              <BrainCard 
                icon={TrendingUp}
                title="TrendBrainy™"
                description="Detecta lo que está pasando y propone nuevas ideas. Analiza tendencias, monitorea competencia y sugiere contenido relevante automáticamente cada semana."
                color="blue"
                delay={0.4}
              />
            </div>
          </div>

          <motion.p 
            className="text-center text-lg text-muted-foreground mt-12 max-w-3xl mx-auto font-light italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Todo ocurre de manera fluida, como si tuvieras un equipo completo trabajando sin parar.
          </motion.p>
        </div>
      </section>

      {/* Results in Action Section */}
      <section className="container mx-auto px-4 py-32 bg-gradient-to-b from-deep-blue/20 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <motion.h2 
              className="text-5xl md:text-6xl font-bold tracking-tight mb-6 uppercase text-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-foreground">Resultados</span> <span className="text-purple-accent">en acción</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto font-light"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Cada showcase muestra una sola cosa: cómo la automatización inteligente transforma el rendimiento de una marca.
              <br />
              <span className="text-foreground font-medium">Sin comparaciones. Solo evidencia.</span>
            </motion.p>
          </div>

          <div className="space-y-20">
            <WhatsAppProjectManager />
            <AIMediaBuyerPanel />
            <CreativePerformanceTracker />
            <MultiChannelCommunication />
            <InspirationLibrary />
          </div>
        </div>
      </section>

      {/* Conversations Section */}
      <section className="container mx-auto px-4 py-32 bg-gradient-to-b from-background to-deep-blue/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-12 rounded-3xl bg-gradient-to-br from-green-500/10 via-background to-background border border-green-500/20 shadow-[0_0_60px_hsl(140_70%_50%_/_0.3)]"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="bg-green-500 p-4 rounded-2xl shadow-glow">
                <MessageSquare className="w-8 h-8 text-background" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
              Conversaciones que hacen
              <br />
              <span className="text-green-500">más que hablar</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 font-light leading-relaxed">
              Brainy coordina, aprueba y publica desde una conversación.
              <br />
              Un mensaje basta para lanzar una campaña, aprobar un copy o generar un anuncio.
            </p>

            <p className="text-lg text-foreground font-medium italic">
              Así se siente tener un asistente creativo que trabaja por ti, todo el día.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Animated Metrics Section */}
      <AnimatedMetrics />

      {/* Everything Connected Section */}
      <section className="container mx-auto px-4 py-32 bg-gradient-to-b from-deep-blue/20 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Zap className="w-20 h-20 text-electric-cyan animate-pulse-glow" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-electric-cyan/20 border-t-electric-cyan rounded-full"
                ></motion.div>
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6 uppercase tracking-tight text-foreground">
              <span className="text-foreground">Todo conectado.</span>
              <br />
              <span className="text-electric-cyan">Todo sincronizado.</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-4 font-light leading-relaxed">
              Cada acción, cada publicación, cada anuncio.
              <br />
              Todo se actualiza en tiempo real dentro de un mismo cerebro digital.
            </p>

            <p className="text-2xl text-foreground font-bold">
              No hay fragmentación. Solo fluidez.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <FAQSection />
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-32 bg-gradient-to-b from-background to-deep-blue">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-16 rounded-3xl bg-gradient-to-br from-electric-cyan/10 via-background to-purple-accent/10 border border-electric-cyan/30 shadow-glow-blue"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-electric-cyan to-purple-accent p-5 rounded-2xl shadow-glow-cyan">
                <Bot className="w-10 h-10 text-background" />
              </div>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 uppercase tracking-tight text-foreground">
              <span className="text-foreground">El futuro de las agencias</span>
              <br />
              <span className="text-electric-cyan">no usa más herramientas.</span>
            </h2>
            
            <p className="text-2xl text-foreground font-medium mb-4">
              Usa una sola que lo hace todo.
            </p>

            <p className="text-5xl font-bold mb-12 bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
              Brainy.
            </p>

            <Button 
              size="lg"
              onClick={() => navigate('/showcase/lead-capture')}
              className="text-xl px-12 py-8 bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan"
            >
              Solicita acceso anticipado →
            </Button>

            <p className="text-sm text-foreground/70 mt-6 font-light">
              Únete a las agencias y empresas que ya automatizaron su futuro
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage;
