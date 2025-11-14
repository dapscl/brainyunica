import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, TrendingUp, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

const leadSchema = z.object({
  fullName: z.string().trim().min(2, { message: "El nombre debe tener al menos 2 caracteres" }).max(100),
  email: z.string().trim().email({ message: "Email inválido" }).max(255),
  company: z.string().trim().min(2, { message: "El nombre de la empresa debe tener al menos 2 caracteres" }).max(100),
  phone: z.string().trim().min(8, { message: "Teléfono inválido" }).max(20),
  monthlyRevenue: z.string(),
  clientsCount: z.string(),
  currentTools: z.string().trim().max(500),
  challenges: z.string().trim().max(1000),
});

type LeadFormData = z.infer<typeof leadSchema>;

const ShowcaseLeadCapturePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [suggestedPlan, setSuggestedPlan] = useState<'starter' | 'professional' | 'enterprise' | null>(null);
  
  const [formData, setFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    monthlyRevenue: '',
    clientsCount: '',
    currentTools: '',
    challenges: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});

  const calculateSuggestedPlan = (revenue: string, clients: string): 'starter' | 'professional' | 'enterprise' => {
    const revenueNum = parseInt(revenue.replace(/\D/g, ''));
    const clientsNum = parseInt(clients);

    if (revenueNum >= 25000 || clientsNum >= 50) {
      return 'enterprise';
    } else if (revenueNum >= 5000 || clientsNum >= 15) {
      return 'professional';
    }
    return 'starter';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      leadSchema.parse(formData);
      setErrors({});
      
      const plan = calculateSuggestedPlan(formData.monthlyRevenue, formData.clientsCount);
      
      // Save to Supabase
      const { error: insertError } = await supabase
        .from('leads')
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          company: formData.company,
          phone: formData.phone,
          monthly_revenue: formData.monthlyRevenue,
          clients_count: formData.clientsCount,
          current_tools: formData.currentTools || null,
          challenges: formData.challenges || null,
          suggested_plan: plan,
        });

      if (insertError) {
        console.error('Error saving lead:', insertError);
        
        // Check for duplicate email error
        if (insertError.code === '23505') {
          toast({
            title: t('leadCapture.form.duplicateEmailTitle') || "Email ya registrado",
            description: t('leadCapture.form.duplicateEmailDescription') || "Este email ya está registrado. Nos pondremos en contacto contigo pronto.",
            variant: "default",
          });
        } else {
          toast({
            title: "Error al guardar",
            description: "Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.",
            variant: "destructive",
          });
        }
        return;
      }

      // Send lead notification email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-lead-notification', {
          body: {
            fullName: formData.fullName,
            email: formData.email,
            company: formData.company,
            phone: formData.phone,
            monthlyRevenue: formData.monthlyRevenue,
            clientsCount: formData.clientsCount,
            currentTools: formData.currentTools,
            challenges: formData.challenges,
            suggestedPlan: plan,
          },
        });

        if (emailError) {
          console.error('Error sending notification email:', emailError);
          // Don't block the user flow if email fails
        }
      } catch (emailError) {
        console.error('Error invoking email function:', emailError);
        // Don't block the user flow if email fails
      }

      setSuggestedPlan(plan);
      setIsSubmitted(true);
      
      toast({
        title: "¡Solicitud enviada!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof LeadFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof LeadFormData] = err.message;
          }
        });
        setErrors(newErrors);
        
        toast({
          title: "Error en el formulario",
          description: "Por favor corrige los errores antes de continuar",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: keyof LeadFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted && suggestedPlan) {
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

    const plan = planDetails[suggestedPlan];
    const PlanIcon = plan.icon;

    return (
      <div className="min-h-screen bg-background dark">
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
                  ¡Gracias, {formData.fullName.split(' ')[0]}!
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
  }

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseSEO
        title={t('showcase.leadCapture.title', 'Request Early Access')}
        description={t('showcase.leadCapture.description', 'Join the agencies automating their future with AI-powered marketing')}
        path="/lead-capture"
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-20">
        <ShowcaseBreadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 px-6 py-3 text-electric-cyan border-electric-cyan/30 bg-electric-cyan/5 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Acceso Anticipado
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6 text-foreground">
              Únete al futuro del <span className="text-electric-cyan">marketing automatizado</span>
            </h1>
            <p className="text-xl text-muted-foreground font-light leading-relaxed">
              Cuéntanos sobre tu negocio y te recomendaremos el plan perfecto
            </p>
          </div>

          <Card className="bg-card/30 backdrop-blur-sm border border-electric-cyan/20 shadow-glow-cyan">
            <CardContent className="pt-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">Nombre completo *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Juan Pérez"
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email corporativo *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="juan@empresa.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-foreground">Empresa *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Mi Agencia S.A."
                      className={errors.company ? 'border-destructive' : ''}
                    />
                    {errors.company && (
                      <p className="text-sm text-destructive">{errors.company}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Teléfono *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+34 600 000 000"
                      className={errors.phone ? 'border-destructive' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRevenue" className="text-foreground">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Facturación mensual aproximada *
                    </Label>
                    <Select
                      value={formData.monthlyRevenue}
                      onValueChange={(value) => handleInputChange('monthlyRevenue', value)}
                    >
                      <SelectTrigger className={errors.monthlyRevenue ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecciona un rango" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-5000">€0 - €5,000</SelectItem>
                        <SelectItem value="5000-25000">€5,000 - €25,000</SelectItem>
                        <SelectItem value="25000-100000">€25,000 - €100,000</SelectItem>
                        <SelectItem value="100000+">€100,000+</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.monthlyRevenue && (
                      <p className="text-sm text-destructive">{errors.monthlyRevenue}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clientsCount" className="text-foreground">
                      <Users className="w-4 h-4 inline mr-1" />
                      Cantidad de clientes activos *
                    </Label>
                    <Select
                      value={formData.clientsCount}
                      onValueChange={(value) => handleInputChange('clientsCount', value)}
                    >
                      <SelectTrigger className={errors.clientsCount ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Selecciona un rango" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5">1 - 5 clientes</SelectItem>
                        <SelectItem value="6-15">6 - 15 clientes</SelectItem>
                        <SelectItem value="16-50">16 - 50 clientes</SelectItem>
                        <SelectItem value="50+">50+ clientes</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.clientsCount && (
                      <p className="text-sm text-destructive">{errors.clientsCount}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentTools" className="text-foreground">
                    ¿Qué herramientas usas actualmente?
                  </Label>
                  <Input
                    id="currentTools"
                    value={formData.currentTools}
                    onChange={(e) => handleInputChange('currentTools', e.target.value)}
                    placeholder="Ej: Metricool, Hootsuite, Buffer, etc."
                    className={errors.currentTools ? 'border-destructive' : ''}
                  />
                  {errors.currentTools && (
                    <p className="text-sm text-destructive">{errors.currentTools}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenges" className="text-foreground">
                    ¿Cuáles son tus principales desafíos en gestión de redes sociales?
                  </Label>
                  <Textarea
                    id="challenges"
                    value={formData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    placeholder="Ej: Falta de tiempo para crear contenido, dificultad para medir ROI, etc."
                    rows={4}
                    className={errors.challenges ? 'border-destructive' : ''}
                  />
                  {errors.challenges && (
                    <p className="text-sm text-destructive">{errors.challenges}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-7 gap-2 bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background font-bold uppercase tracking-wide shadow-glow-cyan transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5" />
                  Solicitar Acceso Anticipado
                </Button>

                <p className="text-sm text-center text-muted-foreground font-light">
                  Al enviar este formulario, aceptas que nos pongamos en contacto contigo
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ShowcaseLeadCapturePage;
