import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, TrendingUp, Zap, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShowcasePricingPage = () => {
  const navigate = useNavigate();

  const pricingTiers = [
    {
      name: 'Starter',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      adSpend: 'Hasta €5K/mes',
      basePrice: '€297',
      percentage: '3%',
      maxMonthly: '€447',
      description: 'Perfecto para empezar con paid media y automatización',
      features: [
        'Gestión de hasta 3 marcas',
        'Calendario de contenido ilimitado',
        'Chat automation básico (hasta 1,000 contactos)',
        'AI Media Buyer con recomendaciones',
        'Creative Performance Tracker',
        'Multi-channel: WhatsApp, Email, SMS',
        'Biblioteca de inspiración',
        'Templates pre-configurados (12)',
        'Soporte por email',
        '1 usuario incluido'
      ],
      recommended: false
    },
    {
      name: 'Professional',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      adSpend: '€5K - €25K/mes',
      basePrice: '€597',
      percentage: '2.5%',
      maxMonthly: '€1,222',
      description: 'Para agencias y empresas en crecimiento',
      features: [
        'Todo lo de Starter, más:',
        'Gestión de marcas ilimitadas',
        'Chat automation avanzado (hasta 10,000 contactos)',
        'AI Video Generator con avatares ilimitados',
        'AI Bidding Optimizer automático',
        'Creative Fatigue Detection',
        'Lead Capture & Segmentation avanzada',
        'Reporting personalizado y exportable',
        'Templates premium (24+)',
        'Integraciones API personalizadas',
        'Soporte prioritario',
        'Hasta 5 usuarios'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      adSpend: '€25K+/mes',
      basePrice: '€997',
      percentage: '2%',
      maxMonthly: 'Custom',
      description: 'Solución completa para grandes organizaciones',
      features: [
        'Todo lo de Professional, más:',
        'Multi-organización y white-label',
        'Chat automation enterprise (contactos ilimitados)',
        'AI Video Generator con avatares personalizados',
        'Bidding strategies personalizadas',
        'Account manager dedicado',
        'Onboarding personalizado y training',
        'SLA garantizado 99.9%',
        'Seguridad y compliance avanzado',
        'API dedicada con rate limits elevados',
        'Integraciones custom bajo demanda',
        'Soporte 24/7 prioritario',
        'Usuarios ilimitados'
      ],
      recommended: false
    }
  ];

  const adSpendExamples = [
    { spend: '€2,500', tier: 'Starter', cost: '€297 + €75 = €372/mes' },
    { spend: '€5,000', tier: 'Starter → Professional', cost: '€447/mes (max Starter) o €597/mes (base Professional)' },
    { spend: '€10,000', tier: 'Professional', cost: '€597 + €250 = €847/mes' },
    { spend: '€25,000', tier: 'Professional → Enterprise', cost: '€1,222/mes (max Professional) o €997/mes (base Enterprise)' },
    { spend: '€50,000', tier: 'Enterprise', cost: '€997 + €1,000 = €1,997/mes' },
    { spend: '€100,000+', tier: 'Enterprise', cost: 'Pricing personalizado - Contactar ventas' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/showcase')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Showcase
          </Button>
          
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4" variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              Pricing Escalable
            </Badge>
            <h1 className="text-4xl font-bold mb-4">Precio que Crece Contigo</h1>
            <p className="text-xl text-muted-foreground">
              Paga solo por lo que inviertes. Nuestro modelo de pricing escala proporcionalmente con tu ad spend, sin sorpresas.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* How it Works */}
        <Card className="mb-12 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="text-2xl text-center">¿Cómo Funciona el Pricing?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Precio Base Mensual</h3>
                <p className="text-sm text-muted-foreground">
                  Pago fijo mensual según el tier que elijas (Starter, Professional, Enterprise)
                </p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Porcentaje de Ad Spend</h3>
                <p className="text-sm text-muted-foreground">
                  Se suma un pequeño porcentaje (2-3%) de tu inversión publicitaria mensual
                </p>
              </div>
              <div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Total Transparente</h3>
                <p className="text-sm text-muted-foreground">
                  Sin costos ocultos. Facturación clara con desglose completo cada mes
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-center text-sm">
                <strong>Ejemplo:</strong> Si estás en el tier Professional (€597/mes) e inviertes €10,000 en ads, 
                pagarás: €597 + (€10,000 × 2.5%) = <strong className="text-primary">€847/mes</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pricingTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <Card 
                key={idx} 
                className={`relative overflow-hidden ${
                  tier.recommended 
                    ? 'border-primary shadow-lg scale-105 z-10' 
                    : 'border-border'
                }`}
              >
                {tier.recommended && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    Más Popular
                  </div>
                )}
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">{tier.description}</CardDescription>
                  
                  <div className="pt-4 space-y-2">
                    <div>
                      <p className="text-3xl font-bold">{tier.basePrice}</p>
                      <p className="text-xs text-muted-foreground">+ {tier.percentage} del ad spend</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tier.adSpend}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Máximo mensual: {tier.maxMonthly}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Button 
                    className="w-full" 
                    variant={tier.recommended ? 'default' : 'outline'}
                    size="lg"
                  >
                    {tier.name === 'Enterprise' ? 'Contactar Ventas' : 'Comenzar Ahora'}
                  </Button>

                  <div className="space-y-2">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ad Spend Examples */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Ejemplos de Pricing por Ad Spend</CardTitle>
            <CardDescription>
              Calcula tu costo mensual aproximado según tu inversión publicitaria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {adSpendExamples.map((example, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-lg">{example.spend}</span>
                      <Badge variant="secondary">{example.tier}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{example.cost}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Nota:</strong> Cuando alcanzas el límite superior de un tier, puedes optar por quedarte 
                en el máximo de ese tier o actualizar al siguiente nivel para acceder a funcionalidades premium.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Variable Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">¿Por Qué Pricing Variable?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Escalabilidad Justa
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  Solo pagas más cuando inviertes más. Si reduces tu ad spend, tu costo también baja automáticamente.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Alineación de Incentivos
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  Nuestro éxito está ligado al tuyo. Cuando tus campañas crecen, nosotros crecemos contigo.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Sin Límites Artificiales
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  No limitamos usuarios, contactos o funcionalidades por "planes". Todo el tier está disponible.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  Transparencia Total
                </h3>
                <p className="text-sm text-muted-foreground pl-7">
                  Dashboard en tiempo real con tu ad spend acumulado y proyección del costo mensual actual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">¿Listo para Comenzar?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Empieza con 14 días de prueba gratis. No se requiere tarjeta de crédito. 
                Cancela en cualquier momento.
              </p>
              <div className="flex gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Comenzar Prueba Gratis
                </Button>
                <Button size="lg" variant="outline">
                  Hablar con Ventas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePricingPage;
