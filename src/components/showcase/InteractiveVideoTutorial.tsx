import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  CheckCircle2,
  MessageCircle,
  Sparkles,
  Calendar,
  Share2,
  Clock
} from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  duration: number;
  icon: any;
  visual: string;
}

export const InteractiveVideoTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps: TutorialStep[] = [
    {
      id: 1,
      title: "Recepción de Contenido",
      description: "BrainybyUnica te envía el contenido pre-aprobado directamente a tu WhatsApp con vista previa completa",
      duration: 5,
      icon: MessageCircle,
      visual: "whatsapp"
    },
    {
      id: 2,
      title: "Revisión Rápida",
      description: "Revisas el contenido, la imagen y el copy sugerido. Todo en la comodidad de tu teléfono",
      duration: 4,
      icon: CheckCircle2,
      visual: "review"
    },
    {
      id: 3,
      title: "Solicitud de Variantes (Opcional)",
      description: "Si quieres ajustes, simplemente pide variantes y la IA genera nuevas opciones en segundos",
      duration: 5,
      icon: Sparkles,
      visual: "ai-variants"
    },
    {
      id: 4,
      title: "Aprobación Simple",
      description: "Respondes con ✅ para aprobar o solicitas cambios específicos en lenguaje natural",
      duration: 3,
      icon: CheckCircle2,
      visual: "approval"
    },
    {
      id: 5,
      title: "Calendarización Automática",
      description: "BrainybyUnica programa automáticamente la publicación en el mejor horario para tu audiencia",
      duration: 4,
      icon: Calendar,
      visual: "scheduling"
    },
    {
      id: 6,
      title: "Publicación Multicanal",
      description: "El contenido se publica automáticamente en todas las plataformas seleccionadas: Instagram, Facebook, LinkedIn, TikTok",
      duration: 5,
      icon: Share2,
      visual: "publishing"
    },
    {
      id: 7,
      title: "Confirmación y Métricas",
      description: "Recibes confirmación inmediata con enlaces directos y tracking de métricas en tiempo real",
      duration: 4,
      icon: Clock,
      visual: "metrics"
    }
  ];

  const totalDuration = steps.reduce((acc, step) => acc + step.duration, 0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / (steps[currentStep].duration * 10));
        
        if (newProgress >= 100) {
          if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1);
            return 0;
          } else {
            setIsPlaying(false);
            return 100;
          }
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, steps]);

  const handlePlayPause = () => {
    if (currentStep === steps.length - 1 && progress >= 100) {
      setCurrentStep(0);
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
      setIsPlaying(false);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
    setIsPlaying(false);
  };

  const getVisualContent = (visual: string) => {
    const baseClasses = "w-full h-full flex items-center justify-center text-muted-foreground";
    
    switch (visual) {
      case "whatsapp":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-500/10 to-emerald-500/10`}>
            <div className="max-w-md w-full space-y-4 p-6 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">BrainybyUnica</p>
                    <p className="text-xs text-muted-foreground">en línea</p>
                  </div>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3 space-y-2">
                  <p className="text-sm">📸 Nuevo contenido listo para aprobación:</p>
                  <div className="bg-white dark:bg-gray-700 rounded p-2 text-xs">
                    <p className="font-medium">Post promocional Black Friday</p>
                    <p className="text-muted-foreground mt-1">🎯 Instagram, Facebook</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded flex items-center justify-center text-xs">
                    [Vista previa de imagen]
                  </div>
                  <p className="text-xs italic">"🔥 Black Friday está aquí! Descuentos de hasta 50% en toda la tienda..."</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "review":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-500/10 to-cyan-500/10`}>
            <div className="max-w-md w-full space-y-4 p-6 animate-scale-in">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4">
                <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-3 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Imagen promocional</p>
                </div>
                <p className="text-sm mb-3">"🔥 Black Friday está aquí! Descuentos de hasta 50% en toda la tienda. No te lo pierdas! 🛍️"</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary">Instagram</Badge>
                  <Badge variant="secondary">Facebook</Badge>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "ai-variants":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-purple-500/10 to-pink-500/10`}>
            <div className="max-w-md w-full space-y-3 p-6 animate-fade-in">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                <p className="text-sm">💬 "Genera 3 variantes más creativas"</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 space-y-2 animate-scale-in">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-medium">Generando variantes con IA...</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                    Variante 1: "🎁 ¡Locura de descuentos! Tu momento favorito..."
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                    Variante 2: "⚡ Black Friday ULTRA! Las mejores ofertas..."
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                    Variante 3: "🔥 SALE ÉPICO! Todo lo que querías..."
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "approval":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-500/10 to-emerald-500/10`}>
            <div className="max-w-md w-full space-y-4 p-6 animate-scale-in">
              <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 text-center">
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm">Aprobado para publicación</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Contenido aprobado exitosamente</span>
                </div>
                <p className="text-xs text-muted-foreground">Procediendo a calendarización automática...</p>
              </div>
            </div>
          </div>
        );
      
      case "scheduling":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-orange-500/10 to-red-500/10`}>
            <div className="max-w-md w-full space-y-4 p-6 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  <span className="font-semibold text-sm">Calendario Inteligente</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <p className="font-medium">📅 Programado para:</p>
                    <p className="text-xs text-muted-foreground mt-1">Viernes 29 Nov, 10:00 AM</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Horario óptimo según tu audiencia</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>🎯 Plataformas: Instagram, Facebook</p>
                    <p>⏰ Mejor engagement: 10:00-11:00 AM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "publishing":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-500/10 to-purple-500/10`}>
            <div className="max-w-md w-full space-y-4 p-6 animate-scale-in">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-sm">Publicación Multicanal</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Instagram</span>
                    </div>
                    <span className="text-xs text-green-600">Publicado</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span>Facebook</span>
                    </div>
                    <span className="text-xs text-green-600">Publicado</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-500 animate-pulse" />
                      <span>LinkedIn</span>
                    </div>
                    <span className="text-xs text-blue-600">Publicando...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "metrics":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-500/10 to-blue-500/10`}>
            <div className="max-w-md w-full space-y-4 p-6 animate-fade-in">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-sm">Publicación Exitosa</span>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg space-y-2">
                  <p className="text-sm font-medium">✅ Todo publicado correctamente</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white dark:bg-gray-700 p-2 rounded">
                      <p className="text-muted-foreground">Alcance</p>
                      <p className="font-bold text-lg">2.4K</p>
                    </div>
                    <div className="bg-white dark:bg-gray-700 p-2 rounded">
                      <p className="text-muted-foreground">Engagement</p>
                      <p className="font-bold text-lg">8.2%</p>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400">🔗 Ver en Instagram →</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <p className="text-lg">Paso {currentStep + 1}</p>;
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          <Play className="w-4 h-4 mr-2" />
          Tutorial Interactivo
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Del WhatsApp a Redes Sociales en Segundos
        </h2>
        <p className="text-xl text-muted-foreground">
          Explora el flujo completo paso a paso. Navega entre las etapas o reproduce automáticamente.
        </p>
      </div>

      {/* Video Player Card */}
      <Card className="overflow-hidden border-primary/20">
        <div className="relative bg-gradient-to-br from-background to-muted/30">
          {/* Visual Content Area */}
          <div className="aspect-video w-full">
            {getVisualContent(steps[currentStep].visual)}
          </div>

          {/* Step Indicator Overlay */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-black/70 text-white border-0">
              Paso {currentStep + 1} de {steps.length}
            </Badge>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-100"
            style={{ width: `${((currentStep * 100) + progress) / steps.length}%` }}
          />
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Current Step Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <StepIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{steps[currentStep].title}</h3>
                <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {steps[currentStep].duration}s
              </Badge>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>

            <Button
              size="lg"
              onClick={handlePlayPause}
              className="gap-2 px-8"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  {currentStep === steps.length - 1 && progress >= 100 ? 'Reiniciar' : 'Reproducir'}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Step Timeline */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Pasos del Tutorial</p>
            <div className="grid grid-cols-7 gap-2">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`
                      p-3 rounded-lg transition-all
                      ${index === currentStep 
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                        : index < currentStep 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted hover:bg-muted/70'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <p className="text-xs font-medium line-clamp-1">{step.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
            <span>Duración total: {totalDuration} segundos</span>
            <span>Progreso: {Math.round(((currentStep * 100) + progress) / steps.length)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
