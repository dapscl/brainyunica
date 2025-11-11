import { useTranslation } from 'react-i18next';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { SectionTitle } from '@/components/showcase/SectionTitle';
import { GlowCard } from '@/components/showcase/GlowCard';
import { AnimatedButton } from '@/components/showcase/AnimatedButton';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Calendar, 
  Target, 
  MessageCircle, 
  TrendingUp,
  Building2,
  Briefcase,
  Rocket,
  Store
} from 'lucide-react';

export default function ShowcaseFeaturesPage() {
  const { t } = useTranslation();

  const brainies = [
    {
      icon: Sparkles,
      title: 'CreatorBrainy™',
      color: 'from-purple-accent to-purple-accent/60',
      glowColor: 'shadow-glow-purple',
      features: [
        t('showcase.features.creator.feature1', 'Generación automática de copys optimizados por IA'),
        t('showcase.features.creator.feature2', 'Creación de imágenes y videos adaptados a cada plataforma'),
        t('showcase.features.creator.feature3', 'Variantes A/B testing para maximizar engagement'),
        t('showcase.features.creator.feature4', 'Adaptación automática de formato según canal social'),
        t('showcase.features.creator.feature5', 'Biblioteca de templates personalizables por marca'),
      ]
    },
    {
      icon: Calendar,
      title: 'CalendarBrainy™',
      color: 'from-blue-500 to-blue-600',
      glowColor: 'shadow-glow-cyan',
      features: [
        t('showcase.features.calendar.feature1', 'Calendarización inteligente en horarios óptimos'),
        t('showcase.features.calendar.feature2', 'Distribución estratégica de contenido multicanal'),
        t('showcase.features.calendar.feature3', 'Publicación automática sin intervención manual'),
        t('showcase.features.calendar.feature4', 'Coordinación de campañas cross-platform'),
        t('showcase.features.calendar.feature5', 'Vista mensual/semanal con insights de performance'),
      ]
    },
    {
      icon: Target,
      title: 'AdBrainy™',
      color: 'from-electric-cyan to-cyan-400',
      glowColor: 'shadow-glow-cyan',
      features: [
        t('showcase.features.ad.feature1', 'Optimización automática de pujas en tiempo real'),
        t('showcase.features.ad.feature2', 'Redistribución inteligente de presupuestos'),
        t('showcase.features.ad.feature3', 'Maximización de ROAS con machine learning'),
        t('showcase.features.ad.feature4', 'Detección de fatiga creativa y sugerencias'),
        t('showcase.features.ad.feature5', 'Integración con Meta, Google, LinkedIn y TikTok Ads'),
      ]
    },
    {
      icon: MessageCircle,
      title: 'ChatBrainy™',
      color: 'from-green-500 to-emerald-600',
      glowColor: 'shadow-glow-green',
      features: [
        t('showcase.features.chat.feature1', 'Respuestas automáticas contextuales 24/7'),
        t('showcase.features.chat.feature2', 'Calificación de intención de compra en tiempo real'),
        t('showcase.features.chat.feature3', 'Captura y segmentación automática de leads'),
        t('showcase.features.chat.feature4', 'Flujos conversacionales personalizados por marca'),
        t('showcase.features.chat.feature5', 'Integración WhatsApp, Instagram DM y Facebook Messenger'),
      ]
    },
    {
      icon: TrendingUp,
      title: 'TrendBrainy™',
      color: 'from-purple-accent to-pink-500',
      glowColor: 'shadow-glow-purple',
      features: [
        t('showcase.features.trend.feature1', 'Análisis semanal automático de Google Trends'),
        t('showcase.features.trend.feature2', 'Monitoreo de competencia y benchmarking'),
        t('showcase.features.trend.feature3', 'Sugerencias de contenido basadas en tendencias'),
        t('showcase.features.trend.feature4', 'Alertas de oportunidades virales en tu industria'),
        t('showcase.features.trend.feature5', 'Biblioteca de inspiración con ads ganadores'),
      ]
    }
  ];

  const industries = [
    {
      icon: Building2,
      title: t('showcase.features.industries.agencies.title', 'Agencias'),
      description: t('showcase.features.industries.agencies.description', 'Gestiona múltiples clientes desde una sola plataforma'),
      benefits: [
        t('showcase.features.industries.agencies.benefit1', 'Hasta 15 marcas operando en paralelo'),
        t('showcase.features.industries.agencies.benefit2', 'Flujos de aprobación cliente-agencia'),
        t('showcase.features.industries.agencies.benefit3', 'Dashboard consolidado de todos los clientes'),
        t('showcase.features.industries.agencies.benefit4', 'Facturación transparente por ad spend'),
      ]
    },
    {
      icon: Briefcase,
      title: t('showcase.features.industries.enterprises.title', 'Empresas'),
      description: t('showcase.features.industries.enterprises.description', 'Centraliza todo el marketing de tu organización'),
      benefits: [
        t('showcase.features.industries.enterprises.benefit1', 'Múltiples marcas y sub-marcas'),
        t('showcase.features.industries.enterprises.benefit2', 'Control de permisos por equipos'),
        t('showcase.features.industries.enterprises.benefit3', 'Integraciones con CRM y herramientas internas'),
        t('showcase.features.industries.enterprises.benefit4', 'Reportes ejecutivos automáticos'),
      ]
    },
    {
      icon: Rocket,
      title: t('showcase.features.industries.startups.title', 'Startups'),
      description: t('showcase.features.industries.startups.description', 'Escala tu marketing sin aumentar el equipo'),
      benefits: [
        t('showcase.features.industries.startups.benefit1', 'Operación ágil con 1-3 personas'),
        t('showcase.features.industries.startups.benefit2', 'Pricing accesible que crece contigo'),
        t('showcase.features.industries.startups.benefit3', 'Setup rápido en menos de 24 horas'),
        t('showcase.features.industries.startups.benefit4', 'Automatización desde el día uno'),
      ]
    },
    {
      icon: Store,
      title: t('showcase.features.industries.smes.title', 'PYMEs'),
      description: t('showcase.features.industries.smes.description', 'Marketing profesional sin complicaciones'),
      benefits: [
        t('showcase.features.industries.smes.benefit1', 'Interfaz simple y fácil de usar'),
        t('showcase.features.industries.smes.benefit2', 'Sin necesidad de expertos en marketing'),
        t('showcase.features.industries.smes.benefit3', 'Resultados medibles desde el primer mes'),
        t('showcase.features.industries.smes.benefit4', 'Soporte en español y onboarding guiado'),
      ]
    }
  ];

  return (
    <>
      <ShowcaseSEO
        title={t('showcase.features.seo.title', 'Funcionalidades - Brainy by Unica')}
        description={t('showcase.features.seo.description', 'Descubre las 5 inteligencias de Brainy: CreatorBrainy, CalendarBrainy, AdBrainy, ChatBrainy y TrendBrainy. Todo lo que necesitas para automatizar tu marketing digital.')}
      />
      <ShowcaseHeader />
      <ShowcaseBreadcrumbs />
      
      <main className="min-h-screen bg-gradient-to-b from-dark-surface via-background to-dark-surface">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/5 via-transparent to-purple-accent/5" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-6 px-4 py-2 rounded-full border border-electric-cyan/30 bg-electric-cyan/5">
                <span className="text-sm font-medium text-electric-cyan">
                  {t('showcase.features.badge', '5 Inteligencias. 1 Plataforma.')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">{t('showcase.features.hero.title1', 'Todo lo que necesitas')}</span>
                <br />
                <span className="bg-gradient-to-r from-electric-cyan via-purple-accent to-electric-cyan bg-clip-text text-transparent">
                  {t('showcase.features.hero.title2', 'para automatizar tu marketing')}
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('showcase.features.hero.subtitle', 'Cinco cerebros de IA colaborando entre sí para ejecutar tu estrategia completa sin intervención manual.')}
              </p>
            </div>
          </div>
        </section>

        {/* Brainies Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle
              title={t('showcase.features.brainies.title', 'Conoce a los')}
              highlight={t('showcase.features.brainies.highlight', 'Brainies')}
              subtitle={t('showcase.features.brainies.subtitle', 'Cada Brainy se especializa en una función clave de tu marketing, trabajando en sincronía perfecta.')}
            />

            <div className="grid gap-8 mt-16">
              {brainies.map((brainy, index) => (
                <GlowCard key={index} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${brainy.color} ${brainy.glowColor}`}>
                      <brainy.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-4 text-foreground">{brainy.title}</h3>
                      <ul className="space-y-3">
                        {brainy.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-electric-cyan mt-2" />
                            <span className="text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle
              title={t('showcase.features.whoItsFor.title', '¿A quién')}
              highlight={t('showcase.features.whoItsFor.highlight', 'le sirve Brainy?')}
              subtitle={t('showcase.features.whoItsFor.subtitle', 'Desde startups hasta corporaciones, Brainy se adapta a las necesidades específicas de cada industria.')}
            />

            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {industries.map((industry, index) => (
                <GlowCard key={index} className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-br from-electric-cyan to-purple-accent">
                      <industry.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-foreground">{industry.title}</h3>
                      <p className="text-muted-foreground">{industry.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {industry.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-electric-cyan mt-2" />
                        <span className="text-muted-foreground text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <GlowCard className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-6">
                <span className="text-foreground">{t('showcase.features.cta.title1', '¿Listo para ver')}</span>
                <br />
                <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                  {t('showcase.features.cta.title2', 'Brainy en acción?')}
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t('showcase.features.cta.subtitle', 'Agenda una demo personalizada y descubre cómo los 5 Brainies pueden transformar tu marketing.')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/lead-capture">
                  <AnimatedButton size="lg">
                    {t('showcase.features.cta.demo', 'Solicitar Demo')}
                  </AnimatedButton>
                </Link>
                <Link to="/pricing">
                  <AnimatedButton size="lg" variant="outline">
                    {t('showcase.features.cta.pricing', 'Ver Precios')}
                  </AnimatedButton>
                </Link>
              </div>
            </GlowCard>
          </div>
        </section>
      </main>
    </>
  );
}
