import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandInfoStep from '@/components/showcase/onboarding/BrandInfoStep';
import SocialChannelsStep from '@/components/showcase/onboarding/SocialChannelsStep';
import PaymentSetupStep from '@/components/showcase/onboarding/PaymentSetupStep';
import VoiceTrainingStep from '@/components/showcase/onboarding/VoiceTrainingStep';
import TemplatesSetupStep from '@/components/showcase/onboarding/TemplatesSetupStep';
import { useToast } from '@/hooks/use-toast';

const ShowcaseOnboardingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    brandName: '',
    website: '',
    industry: '',
    description: '',
    objectives: [],
    adSpendTier: '',
    channels: [],
    cardNumber: '',
    expiry: '',
    cvc: '',
    cardName: '',
    companyName: '',
    taxId: '',
    billingEmail: '',
    address: '',
    tone: '',
    brandValues: '',
    avoidWords: '',
    communicationExamples: '',
    chatTemplates: [],
    contentTemplates: []
  });

  const steps = [
    {
      id: 'brand-info',
      title: 'Información de Marca',
      description: 'Datos básicos y objetivos',
      component: BrandInfoStep
    },
    {
      id: 'social-channels',
      title: 'Canales Sociales',
      description: 'Conecta plataformas',
      component: SocialChannelsStep
    },
    {
      id: 'payment-setup',
      title: 'Configuración de Pago',
      description: 'Método de pago y facturación',
      component: PaymentSetupStep
    },
    {
      id: 'voice-training',
      title: 'Tono de Voz',
      description: 'Entrena la IA con tu estilo',
      component: VoiceTrainingStep
    },
    {
      id: 'templates-setup',
      title: 'Templates Iniciales',
      description: 'Selecciona plantillas',
      component: TemplatesSetupStep
    }
  ];

  const updateFormData = (data: any) => {
    setFormData({ ...formData, ...data });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Brand Info
        if (!formData.brandName || !formData.industry || !formData.description || !formData.adSpendTier) {
          toast({
            title: "Campos requeridos",
            description: "Por favor completa todos los campos marcados con *",
            variant: "destructive"
          });
          return false;
        }
        if (formData.objectives.length === 0) {
          toast({
            title: "Selecciona al menos un objetivo",
            description: "Los objetivos nos ayudan a personalizar tu experiencia",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 1: // Social Channels
        if (formData.channels.length === 0) {
          toast({
            title: "Conecta al menos un canal",
            description: "Necesitas conectar al menos una plataforma social para continuar",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2: // Payment
        if (!formData.cardNumber || !formData.expiry || !formData.cvc || !formData.cardName || !formData.billingEmail) {
          toast({
            title: "Información de pago incompleta",
            description: "Por favor completa todos los campos de pago",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3: // Voice Training
        if (!formData.tone) {
          toast({
            title: "Selecciona un tono de voz",
            description: "El tono de voz es esencial para la comunicación de tu marca",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplete = () => {
    if (!validateStep(currentStep)) {
      return;
    }

    toast({
      title: "¡Configuración completada!",
      description: "Tu cuenta está lista. Redirigiendo al dashboard...",
    });

    // Simulate completion
    setTimeout(() => {
      navigate('/brands');
    }, 2000);
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Salir del Onboarding
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <Sparkles className="w-4 h-4 text-electric-cyan" />
              Paso {currentStep + 1} de {steps.length}
            </div>
          </div>

          <Progress value={progress} className="h-2 mb-4" />

          {/* Steps Indicator */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`
                  flex-1 text-center relative
                  ${index > 0 ? 'ml-4' : ''}
                `}
              >
                <div className="flex flex-col items-center">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all
                      ${index < currentStep 
                        ? 'bg-electric-cyan text-background shadow-glow-cyan' 
                        : index === currentStep
                        ? 'bg-electric-cyan text-background ring-4 ring-electric-cyan/20 shadow-glow-cyan'
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className={`
                      text-sm font-medium mb-1
                      ${index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`
                      hidden md:block absolute top-5 left-1/2 w-full h-0.5
                      ${index < currentStep ? 'bg-electric-cyan shadow-glow-cyan' : 'bg-border'}
                    `}
                    style={{ transform: 'translateY(-50%)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="mb-8 bg-card/30 backdrop-blur-sm border-electric-cyan/20">
          <CardContent className="pt-10">
            <CurrentStepComponent 
              data={formData} 
              onUpdate={updateFormData}
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              size="lg"
              className="gap-2 bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan transition-all duration-300"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              size="lg"
              className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow transition-all duration-300"
            >
              <Check className="w-4 h-4" />
              Completar Configuración
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseOnboardingPage;
