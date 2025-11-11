import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, TrendingUp, Zap, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const ShowcasePricingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const pricingTiers = [
    {
      name: 'Starter',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      adSpend: 'Equipos pequeños, startups o marcas personales que quieren centralizar todo',
      basePrice: '$500',
      integrationFee: '$250',
      percentage: '20%',
      maxMonthly: 'Variable',
      description: 'Empieza a operar con inteligencia',
      features: [
        '1 marca completa con acceso total',
        'IA para copys e imágenes',
        'Editor visual + calendarización',
        'Hasta 100 publicaciones/mes',
        'Integración Meta y Google Ads',
        'Dashboard de métricas esenciales',
        '3 usuarios incluidos',
        '100 GB de almacenamiento'
      ],
      recommended: false
    },
    {
      name: 'Small Agencies',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      adSpend: 'Agencias boutique o estudios creativos que gestionan varias marcas',
      basePrice: '$1,250',
      integrationFee: '$625',
      percentage: '15%',
      maxMonthly: 'Variable',
      description: 'Escala sin perder el control',
      features: [
        'Hasta 5 marcas activas completas',
        'IA avanzada: copys, imágenes y variaciones',
        'Flujos de aprobación internos + cliente',
        'Hasta 500 publicaciones/mes',
        'Meta, Google, TikTok y LinkedIn',
        'Dashboards en tiempo real',
        '10 usuarios incluidos',
        '500 GB de almacenamiento'
      ],
      recommended: true
    },
    {
      name: 'Scaled Agencies',
      icon: Crown,
      color: 'from-amber-500 to-orange-500',
      adSpend: 'Agencias medianas o equipos de marketing corporativos con alto volumen',
      basePrice: '$3,750',
      integrationFee: '$1,875',
      percentage: '10%',
      maxMonthly: 'Variable',
      description: 'Optimiza con datos y automatización',
      features: [
        'Hasta 15 marcas operando en paralelo',
        'Automatización total (n8n / Zapier)',
        'IA ilimitada (texto + imagen)',
        'Hasta 2,000 publicaciones/mes',
        'Meta, Google, TikTok y LinkedIn completo',
        'Analítica avanzada y dashboards cruzados',
        '25 usuarios incluidos',
        '1 TB de almacenamiento',
        'Soporte prioritario con manager'
      ],
      recommended: false
    },
    {
      name: 'Enterprise',
      icon: Crown,
      color: 'from-red-500 to-pink-600',
      adSpend: 'Grupos corporativos, holdings o agencias multinivel sin límites',
      basePrice: 'Desde $5,000',
      integrationFee: 'Variable',
      percentage: '10%',
      maxMonthly: 'Variable',
      description: 'Marcas y usuarios ilimitados',
      features: [
        'Marcas y usuarios ilimitados',
        'API abierta + CRM, ERP, Data Lakes',
        'Dashboards personalizados (Mix™)',
        'IA multimodal (texto, imagen, voz, video)',
        'Soporte dedicado 24/7',
        'Data compliance + seguridad avanzada',
        'Implementación y onboarding personalizado'
      ],
      recommended: false
    }
  ];

  const adSpendExamples = [
    { spend: '$1,000', tier: 'Starter', cost: '$500 + ($1,000 × 20%) = $700/mes' },
    { spend: '$5,000', tier: 'Starter', cost: '$500 + ($5,000 × 20%) = $1,500/mes' },
    { spend: '$10,000', tier: 'Small Agencies', cost: '$1,250 + ($10,000 × 15%) = $2,750/mes' },
    { spend: '$25,000', tier: 'Scaled Agencies', cost: '$3,750 + ($25,000 × 10%) = $6,250/mes' },
    { spend: '$50,000', tier: 'Scaled Agencies', cost: '$3,750 + ($50,000 × 10%) = $8,750/mes' },
    { spend: '$100,000+', tier: 'Enterprise', cost: 'Pricing personalizado - Contactar ventas' }
  ];

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseSEO
        title={t('showcase.pricing.title', 'Pricing')}
        description={t('showcase.pricing.description', 'Transparent pricing that scales with your ad spend. Choose the right plan for your agency.')}
        path="/pricing"
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-20">
        <ShowcaseBreadcrumbs />
        
        <motion.div 
          className="text-center max-w-4xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-6 px-6 py-3 text-electric-cyan border-electric-cyan/30 bg-electric-cyan/5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Pricing Escalable
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">
            <span className="text-foreground">Precio que</span>{' '}
            <span className="text-electric-cyan">Crece Contigo</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            Paga solo por lo que inviertes. Nuestro modelo de pricing escala proporcionalmente con tu ad spend, sin sorpresas.
          </p>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-20">
        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
        <Card className="mb-16 border-electric-cyan/20 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl font-bold text-center uppercase tracking-tight">¿Cómo Funciona el Pricing?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 rounded-full bg-electric-cyan/10 border border-electric-cyan/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-electric-cyan">1</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">Precio Base Mensual</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Pago fijo mensual según el tier que elijas (Starter, Professional, Enterprise)
                </p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-purple-accent/10 border border-purple-accent/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-purple-accent">2</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">Porcentaje Variable de Medios</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Se suma un porcentaje (10-20%) de tu inversión publicitaria mensual según el tier
                </p>
              </div>
              <div>
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-green-500">3</span>
                </div>
                <h3 className="font-bold text-lg mb-3 text-foreground">Total Transparente</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  Sin costos ocultos. Facturación clara con desglose completo cada mes
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-electric-cyan/5 rounded-xl border border-electric-cyan/20 backdrop-blur-sm">
              <p className="text-center font-light">
                <span className="font-bold text-foreground">Ejemplo:</span> Si estás en el tier Small Agencies ($1,250/mes) e inviertes $10,000 en ads, 
                pagarás: $1,250 + ($10,000 × 15%) = <span className="text-electric-cyan font-bold text-lg">$2,750/mes</span>
              </p>
            </div>
            
            <div className="mt-4 p-6 bg-purple-accent/5 rounded-xl border border-purple-accent/20 backdrop-blur-sm">
              <p className="text-center font-light">
                <span className="font-bold text-foreground">Costo de Integración:</span> Pago único del 50% del precio base mensual al momento de activar cada tier.
              </p>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Pricing Tiers */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingTiers.map((tier, idx) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
              >
              <Card 
                className={`relative overflow-hidden flex flex-col bg-card/50 backdrop-blur-sm transition-all duration-500 ${
                  tier.recommended 
                    ? 'border-electric-cyan shadow-glow-cyan lg:scale-105 z-10' 
                    : 'border-border/50 hover:border-electric-cyan/30'
                }`}
              >
                {tier.recommended && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-electric-cyan to-purple-accent text-background px-4 py-1.5 text-xs font-bold uppercase tracking-wide">
                    Más Popular
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-4 shadow-glow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2 font-light">{tier.description}</CardDescription>
                  
                  <div className="pt-4 space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-electric-cyan">{tier.basePrice}<span className="text-sm text-muted-foreground font-normal">/mes</span></p>
                      <p className="text-sm text-muted-foreground font-medium">+ {tier.percentage} de medios</p>
                    </div>
                    <div className="text-sm text-muted-foreground pt-3 border-t border-border/50">
                      <p className="font-medium">Setup: <span className="text-foreground">{tier.integrationFee}</span></p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  <Button 
                    className={`w-full font-bold ${tier.recommended ? 'bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background' : 'border-electric-cyan/30 hover:bg-electric-cyan/10 hover:border-electric-cyan/50'}`}
                    variant={tier.recommended ? 'default' : 'outline'}
                    size="sm"
                  >
                    {tier.name === 'Enterprise' ? 'Contactar Ventas' : 'Comenzar Ahora'}
                  </Button>

                  <div className="space-y-2 flex-1">
                    {tier.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-electric-cyan mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-tight font-light">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </motion.div>
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
                <strong>Nota:</strong> El porcentaje de medios se aplica sobre tu inversión publicitaria mensual total. 
                A mayor tier, menor porcentaje pagas (20% → 15% → 10%), optimizando tu costo conforme escalas.
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
