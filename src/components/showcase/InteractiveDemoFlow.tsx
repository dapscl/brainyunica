import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, CheckCircle2, Calendar, TrendingUp, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Message {
  sender: "brainy" | "user";
  text: string;
  time: string;
  type?: "approval" | "suggestion" | "scheduling";
}

const demoSteps = [
  {
    id: 1,
    title: "Mensaje de Aprobación",
    description: "Brainy envía contenido para aprobar",
    type: "approval" as const,
    messages: [
      {
        sender: "brainy" as const,
        text: "Hola Carolina 👋\nHoy tenemos este contenido pre-aprobado para publicar a las 12:00:\n\n🧩 'Los lunes son para planificar. Pero si BrainybyUnica lo hace solo, ¿qué haces tú?'\n\n¿Quieres revisarlo antes de que salga?\n✅ Sí / ❌ No",
        time: "09:15",
        type: "approval" as const,
      },
    ],
  },
  {
    id: 2,
    title: "Usuario Responde",
    description: "El usuario solicita cambios",
    type: "approval" as const,
    messages: [
      {
        sender: "user" as const,
        text: "Sí, quiero hacer un cambio",
        time: "09:17",
      },
      {
        sender: "brainy" as const,
        text: "Perfecto 💡\nAquí tienes el copy editable:\n\n'Los lunes son para planificar. Pero si BrainybyUnica lo hace solo, ¿qué haces tú?'\n\nEscríbeme el nuevo texto o dime 'sugiere versión'.",
        time: "09:17",
      },
    ],
  },
  {
    id: 3,
    title: "IA Genera Alternativas",
    description: "GPT-5 crea versiones optimizadas",
    type: "suggestion" as const,
    messages: [
      {
        sender: "user" as const,
        text: "Sugiere versión",
        time: "09:18",
      },
      {
        sender: "brainy" as const,
        text: "Mientras otros planifican su lunes, tu contenido ya está al aire.\nAsí de fácil con BrainybyUnica. 🚀\n\n¿Publicamos este?\n✅ Sí / 🔁 Probar otra / ❌ Cancelar",
        time: "09:18",
        type: "suggestion" as const,
      },
    ],
  },
  {
    id: 4,
    title: "Aprobación y Programación",
    description: "Usuario aprueba y sistema programa",
    type: "scheduling" as const,
    messages: [
      {
        sender: "user" as const,
        text: "✅ Sí, publica",
        time: "09:19",
      },
      {
        sender: "brainy" as const,
        text: "¡Perfecto! ✅\n\nContenido aprobado y programado para hoy 12:00 PM\n\n📊 Estado actualizado en Supabase\n📱 Publicación automática activada\n🎯 Canal: Instagram + LinkedIn",
        time: "09:19",
        type: "scheduling" as const,
      },
    ],
  },
  {
    id: 5,
    title: "Publicación Automática",
    description: "Sistema publica en redes sociales",
    type: "scheduling" as const,
    messages: [
      {
        sender: "brainy" as const,
        text: "🎉 ¡Contenido publicado exitosamente!\n\n✅ Instagram: 12:00 PM\n✅ LinkedIn: 12:00 PM\n\n📈 Engagement inicial: +15%\n👁️ Alcance: 2,341 usuarios\n💬 Interacciones: 87",
        time: "12:01",
      },
    ],
  },
];

export function InteractiveDemoFlow() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const startDemo = () => {
    setCurrentStep(0);
    setDisplayedMessages([]);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || currentStep >= demoSteps.length) {
      if (currentStep >= demoSteps.length) {
        setIsPlaying(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      const stepMessages = demoSteps[currentStep].messages;
      setDisplayedMessages((prev) => [...prev, ...stepMessages]);
      setCurrentStep((prev) => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-electric-cyan via-purple-accent to-electric-cyan bg-clip-text text-transparent">
          {t('showcase.interactiveDemo.title')}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('showcase.interactiveDemo.subtitle')}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-8"
      >
        {/* WhatsApp Chat Simulation */}
        <Card className="p-6 bg-card/30 backdrop-blur-sm border-electric-cyan/30 hover:shadow-glow-cyan transition-all duration-300">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-cyan to-purple-accent flex items-center justify-center shadow-glow-cyan">
              <MessageSquare className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{t('showcase.interactiveDemo.assistantName')}</h3>
              <p className="text-sm text-muted-foreground">{t('showcase.interactiveDemo.online')}</p>
            </div>
          </div>

          <div className="space-y-4 min-h-[500px] max-h-[500px] overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {displayedMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 backdrop-blur-sm ${
                      msg.sender === "user"
                        ? "bg-electric-cyan/20 text-foreground ml-auto border border-electric-cyan/30"
                        : "bg-card/50 text-foreground border border-border/30"
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-2">{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!isPlaying && displayedMessages.length === 0 && (
            <div className="flex items-center justify-center h-[500px]">
              <Button onClick={startDemo} size="lg" className="gap-2 bg-electric-cyan hover:bg-electric-cyan/90 text-foreground shadow-glow-cyan">
                <Send className="w-5 h-5" />
                {t('showcase.interactiveDemo.startDemo')}
              </Button>
            </div>
          )}

          {!isPlaying && displayedMessages.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button onClick={startDemo} variant="outline" size="lg" className="gap-2 border-electric-cyan/50 hover:bg-electric-cyan/10">
                <Send className="w-5 h-5" />
                {t('showcase.interactiveDemo.restartDemo')}
              </Button>
            </div>
          )}
        </Card>

        {/* Process Steps */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold mb-6 text-foreground">{t('showcase.interactiveDemo.processSteps')}</h3>
          {demoSteps.map((step, idx) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.3 }}
              animate={{
                opacity: idx <= currentStep || !isPlaying ? 1 : 0.3,
                scale: idx === currentStep && isPlaying ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`p-6 border-2 transition-all duration-300 backdrop-blur-sm ${
                  idx < currentStep
                    ? "bg-electric-cyan/5 border-electric-cyan/50 shadow-glow-cyan"
                    : idx === currentStep && isPlaying
                    ? "bg-purple-accent/10 border-purple-accent shadow-lg"
                    : "bg-card/20 border-border/30"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      idx < currentStep
                        ? "bg-electric-cyan text-foreground shadow-glow-cyan"
                        : idx === currentStep && isPlaying
                        ? "bg-purple-accent text-foreground"
                        : "bg-card/40 text-muted-foreground"
                    }`}
                  >
                    {idx < currentStep ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : step.type === "approval" ? (
                      <MessageSquare className="w-5 h-5" />
                    ) : step.type === "suggestion" ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : step.type === "scheduling" ? (
                      <Calendar className="w-5 h-5" />
                    ) : (
                      <Image className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-1 text-foreground">{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-purple-accent/10 border border-purple-accent rounded-lg backdrop-blur-sm"
            >
              <p className="text-sm text-center text-foreground">
                ⏳ {t('showcase.interactiveDemo.simulating')}
              </p>
            </motion.div>
          )}

          {!isPlaying && displayedMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gradient-to-br from-electric-cyan/10 via-purple-accent/10 to-deep-blue/20 border-2 border-electric-cyan/50 rounded-lg backdrop-blur-sm hover:shadow-glow-cyan transition-all duration-500"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-electric-cyan" />
                <h4 className="font-semibold text-lg text-foreground">{t('showcase.interactiveDemo.completedTitle')}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('showcase.interactiveDemo.completedText')}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
