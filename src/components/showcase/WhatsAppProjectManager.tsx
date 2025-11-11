import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, CheckCircle, Clock, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppProjectManager = () => {
  const conversations = [
    {
      time: "09:15",
      from: "Brainy",
      message: "Hola Carolina 👋 Hoy tenemos este contenido pre-aprobado para publicar a las 12:00:",
      type: "incoming",
      status: "pending"
    },
    {
      time: "09:17",
      from: "Tú",
      message: "Sí, quiero hacer un cambio",
      type: "outgoing"
    },
    {
      time: "09:18",
      from: "Brainy",
      message: "Mientras otros planifican su lunes, tu contenido ya está al aire. Así de fácil con BrainybyUnica. 🚀",
      type: "incoming",
      status: "approved"
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <Card className="border-green-500/20 bg-card/30 backdrop-blur-sm hover:border-green-500/40 transition-all duration-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/10 backdrop-blur-sm">
              <MessageSquare className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
                WhatsApp Project Manager
              </CardTitle>
              <p className="text-base text-muted-foreground font-light">
                Tu asistente personal de marca coordinando todo desde WhatsApp
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chat Simulation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-full border-border/50 bg-card/30 backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-500">
            <CardHeader className="border-b border-border/50 bg-card/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-6 h-6 text-background" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">BrainybyUnica Assistant</h3>
                  <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    En línea
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3 min-h-[400px] bg-gradient-to-b from-background/50 to-background/80">
              {conversations.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={`flex ${msg.type === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 ${
                    msg.type === 'outgoing' 
                      ? 'bg-electric-cyan text-background shadow-lg' 
                      : 'bg-card/80 backdrop-blur-sm text-foreground border border-border/50'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium opacity-70">{msg.from}</span>
                      {msg.status === 'approved' && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                      {msg.status === 'pending' && (
                        <Clock className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                    <p className="text-xs opacity-60 mt-2">{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Features & Capabilities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4"
        >
          <Card className="border-purple-accent/20 bg-card/30 backdrop-blur-sm hover:border-purple-accent/40 hover:shadow-[0_0_40px_hsl(280_70%_60%_/_0.3)] transition-all duration-500">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-accent" />
                <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">
                  Aprobación Conversacional
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Brainy envía contenido pre-aprobado por WhatsApp</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Apruebas con ✅ o solicitas cambios en lenguaje natural</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>GPT-5 genera versiones alternativas en segundos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Publicación automática cuando apruebas</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-electric-cyan/20 bg-card/30 backdrop-blur-sm hover:border-electric-cyan/40 hover:shadow-glow-cyan transition-all duration-500">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-electric-cyan" />
                <h3 className="text-lg font-bold text-foreground uppercase tracking-tight">
                  Sugerencias Automáticas
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-electric-cyan mt-0.5 flex-shrink-0" />
                  <span>Análisis semanal de Google Trends + RSS feeds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-electric-cyan mt-0.5 flex-shrink-0" />
                  <span>3 tendencias más relevantes para tu sector</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-electric-cyan mt-0.5 flex-shrink-0" />
                  <span>Propuestas de contenido listas para aprobar</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-electric-cyan mt-0.5 flex-shrink-0" />
                  <span>Copy + arte + calendario generados automáticamente</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <h4 className="font-bold text-foreground mb-3 uppercase tracking-tight">
                Capacidades del Project Manager
              </h4>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  Aprobación de contenido por WhatsApp
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-electric-cyan">📝</span>
                  Edición y reescritura con GPT-5 en tiempo real
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-accent">📈</span>
                  Sugerencias semanales basadas en tendencias
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500">⚡</span>
                  Publicación automática vía API Meta
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-electric-cyan">📊</span>
                  Notificaciones push con métricas en tiempo real
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-emerald-500/5 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-bold text-green-500 mb-2">5x</p>
                <p className="text-sm text-muted-foreground font-light">Más rápido en aprobaciones</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-electric-cyan mb-2">24/7</p>
                <p className="text-sm text-muted-foreground font-light">Asistente siempre activo</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-purple-accent mb-2">100%</p>
                <p className="text-sm text-muted-foreground font-light">Automatización conversacional</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default WhatsAppProjectManager;