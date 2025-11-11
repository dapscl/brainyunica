import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, CheckCircle2, Calendar, TrendingUp, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
          Demo Interactivo: Flujo Completo
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Observa cómo BrainybyUnica gestiona todo el proceso desde la aprobación por WhatsApp hasta la publicación automática en redes sociales
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* WhatsApp Chat Simulation */}
        <Card className="p-6 bg-gradient-to-br from-background to-secondary/5 border-2">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">BrainybyUnica Assistant</h3>
              <p className="text-sm text-muted-foreground">En línea</p>
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
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-secondary text-secondary-foreground"
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
              <Button onClick={startDemo} size="lg" className="gap-2">
                <Send className="w-5 h-5" />
                Iniciar Demo Interactivo
              </Button>
            </div>
          )}

          {!isPlaying && displayedMessages.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Button onClick={startDemo} variant="outline" size="lg" className="gap-2">
                <Send className="w-5 h-5" />
                Reiniciar Demo
              </Button>
            </div>
          )}
        </Card>

        {/* Process Steps */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold mb-6">Pasos del Proceso</h3>
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
                className={`p-6 border-2 transition-all duration-300 ${
                  idx < currentStep
                    ? "bg-primary/5 border-primary/50"
                    : idx === currentStep && isPlaying
                    ? "bg-accent/10 border-accent shadow-lg"
                    : "bg-secondary/5 border-border"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      idx < currentStep
                        ? "bg-primary text-primary-foreground"
                        : idx === currentStep && isPlaying
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
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
                    <h4 className="font-semibold text-lg mb-1">{step.title}</h4>
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
              className="mt-6 p-4 bg-accent/10 border border-accent rounded-lg"
            >
              <p className="text-sm text-center text-accent-foreground">
                ⏳ Simulando flujo en tiempo real...
              </p>
            </motion.div>
          )}

          {!isPlaying && displayedMessages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary rounded-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <h4 className="font-semibold text-lg">Demo Completado</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Este es el flujo completo de gestión conversacional con BrainybyUnica: desde la aprobación por
                WhatsApp hasta la publicación automática en redes sociales, todo en tiempo real.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
