import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, DollarSign, Wrench, HeadphonesIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const FAQSection = () => {
  const faqCategories = [
    {
      id: "pricing",
      title: "Pricing y Facturación",
      icon: DollarSign,
      color: "text-green-500",
      questions: [
        {
          q: "¿Cómo funciona el modelo de pricing variable?",
          a: "BrainybyUnica cobra un precio base mensual según tu tier (Starter, Small Agencies, Scaled Agencies, o Enterprise) más un porcentaje de tu inversión publicitaria mensual. Por ejemplo, en el tier Starter pagas $500/mes + 20% de tu ad spend. A mayor tier, menor porcentaje pagas (20% → 15% → 10%), optimizando tu costo conforme escalas."
        },
        {
          q: "¿Qué incluye el costo de integración del 50%?",
          a: "El costo de integración es un pago único equivalente al 50% de tu precio base mensual. Incluye: configuración completa de tu cuenta, integración de todas tus redes sociales, setup de automatizaciones de chat, entrenamiento personalizado del tono de voz de tu marca, y onboarding dedicado con tu account manager."
        },
        {
          q: "¿Puedo cambiar de tier en cualquier momento?",
          a: "Sí, puedes actualizar tu tier en cualquier momento. El upgrade es inmediato y solo pagas la diferencia prorrateada del mes en curso más el costo de integración del nuevo tier. Si reduces tu tier, el cambio se aplica al inicio del siguiente ciclo de facturación sin penalizaciones."
        },
      ]
    },
    {
      id: "integration",
      title: "Integración y Setup",
      icon: Wrench,
      color: "text-blue-500",
      questions: [
        {
          q: "¿Cuánto tiempo toma la integración inicial?",
          a: "El proceso de integración completo toma entre 3-5 días hábiles. Día 1-2: Configuración de información de marca y conexión de canales sociales. Día 3: Setup de métodos de pago y configuración de automatizaciones. Día 4-5: Entrenamiento de tono de voz con IA y testing completo. Tu account manager te guía en cada paso."
        },
        {
          q: "¿Qué plataformas sociales puedo conectar?",
          a: "BrainybyUnica se integra con Facebook, Instagram, LinkedIn, TikTok, Twitter/X, Threads y YouTube. También conectamos WhatsApp Business API para la gestión conversacional. Todas las integraciones se configuran durante el onboarding inicial sin costo adicional."
        },
        {
          q: "¿Necesito conocimientos técnicos para usar la plataforma?",
          a: "No, BrainybyUnica está diseñado para usuarios no técnicos. La gestión principal se hace desde WhatsApp usando lenguaje natural. Tu equipo no necesita aprender dashboards complejos ni herramientas técnicas. Durante el onboarding te enseñamos todo lo necesario en menos de 1 hora."
        },
      ]
    },
    {
      id: "features",
      title: "Características y Funcionalidad",
      icon: Sparkles,
      color: "text-purple-500",
      questions: [
        {
          q: "¿Cómo funciona el WhatsApp Project Manager?",
          a: "BrainybyUnica usa WhatsApp como interfaz principal de gestión. Te envía contenido pre-aprobado para revisión, respondes con ✅ para aprobar o pides cambios en lenguaje natural. La IA genera variantes alternativas en segundos, programa publicaciones automáticamente y te notifica cuando todo está publicado con métricas en tiempo real."
        },
        {
          q: "¿Qué es el AI Media Buyer y cómo me ayuda?",
          a: "El AI Media Buyer es tu asistente personal de campañas publicitarias. Monitorea tus ads 24/7, optimiza pujas automáticamente, redistribuye presupuesto entre creatividades ganadoras, detecta fatiga creativa antes de que afecte tu ROI, y te envía alertas con recomendaciones específicas vía WhatsApp cuando necesitas tomar decisiones estratégicas."
        },
        {
          q: "¿Cuántas marcas puedo gestionar simultáneamente?",
          a: "Depende de tu tier: Starter (1 marca), Small Agencies (hasta 5 marcas), Scaled Agencies (hasta 15 marcas), Enterprise (marcas ilimitadas). Cada marca tiene su propio WhatsApp Project Manager, calendario independiente y configuración de tono de voz separada."
        },
      ]
    },
    {
      id: "support",
      title: "Soporte y Asistencia",
      icon: HeadphonesIcon,
      color: "text-orange-500",
      questions: [
        {
          q: "¿Qué tipo de soporte ofrecen?",
          a: "Starter: Soporte por email con respuesta en 24h. Small Agencies: Soporte prioritario con respuesta en 4-6h más acceso a knowledge base. Scaled Agencies: Soporte prioritario + manager dedicado con reuniones mensuales. Enterprise: Soporte 24/7 con SLA garantizado 99.9% más onboarding personalizado y training continuo."
        },
        {
          q: "¿Ofrecen capacitación para mi equipo?",
          a: "Sí, todos los tiers incluyen onboarding inicial. Small Agencies y superior reciben training adicional: sesiones grupales mensuales sobre nuevas features, webinars de best practices, y acceso a biblioteca de tutoriales en video. Enterprise incluye training personalizado on-site o remoto según necesidades específicas."
        },
        {
          q: "¿Hay garantía de devolución?",
          a: "Ofrecemos 14 días de prueba gratis sin requerir tarjeta de crédito. Si después de activar tu suscripción no estás satisfecho en los primeros 30 días, reembolsamos el 100% del precio base (no incluye costo de integración ni porcentaje de ad spend ya ejecutado). Sin preguntas ni complicaciones."
        },
      ]
    }
  ];

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4 px-4 py-2 border-electric-cyan/30 bg-electric-cyan/5">
          <HelpCircle className="w-4 h-4 mr-2" />
          Preguntas Frecuentes
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground uppercase tracking-tight">
          Todo lo que Necesitas Saber
        </h2>
        <p className="text-xl text-muted-foreground font-light">
          Respuestas detalladas a las preguntas más comunes sobre BrainybyUnica. 
          ¿No encuentras lo que buscas? Contáctanos directamente.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {faqCategories.map((category, idx) => {
          const CategoryIcon = category.icon;
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="border-b border-border/50 p-6 bg-card/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center ${category.color}`}>
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">{category.title}</h3>
                  </div>
                </div>
                
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, idx) => (
                      <AccordionItem 
                        key={`${category.id}-${idx}`} 
                        value={`${category.id}-${idx}`}
                        className="border-b border-border/50 last:border-b-0 px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline py-4 text-foreground">
                          <span className="font-medium pr-4">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 font-light">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-electric-cyan/10 to-purple-accent/10 border-electric-cyan/20 mt-12 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-3 text-foreground uppercase tracking-tight">¿Aún tienes preguntas?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto font-light">
              Nuestro equipo está disponible para resolver cualquier duda adicional. 
              Agenda una demo personalizada o escríbenos directamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://calendly.com/brainybyunica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-electric-cyan text-background font-bold hover:opacity-90 transition-all duration-300 uppercase tracking-wide"
              >
                Agendar Demo
              </a>
              <a 
                href="mailto:hola@brainybyunica.com"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted transition-all duration-300 font-medium"
              >
                Contactar Ventas
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};