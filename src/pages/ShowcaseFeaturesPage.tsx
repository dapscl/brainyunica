import { useTranslation } from 'react-i18next';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { SectionTitle } from '@/components/showcase/SectionTitle';
import { BrainCard } from '@/components/showcase/BrainCard';
import { AnimatedButton } from '@/components/showcase/AnimatedButton';
import { RotatingWord } from '@/components/showcase/RotatingWord';
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

  const whatsappFeature = {
    title: t('showcase.features.whatsapp.title', 'WhatsApp Project Manager'),
    description: t('showcase.features.whatsapp.description', 'Tu asistente personal que coordina todo desde una conversación'),
    features: [
      t('showcase.features.whatsapp.feature1', 'Aprueba contenido con un simple mensaje'),
      t('showcase.features.whatsapp.feature2', 'Solicita cambios y recibe nuevas versiones al instante'),
      t('showcase.features.whatsapp.feature3', 'Lanza campañas completas desde el chat'),
      t('showcase.features.whatsapp.feature4', 'Recibe actualizaciones de performance en tiempo real'),
      t('showcase.features.whatsapp.feature5', 'Gestiona múltiples marcas desde una conversación'),
    ]
  };

  const brainies = [
    {
      icon: Sparkles,
      title: 'CreatorBrainy™',
      color: 'purple' as const,
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
      color: 'blue' as const,
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
      color: 'cyan' as const,
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
      color: 'green' as const,
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
      color: 'purple' as const,
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
      
      <main className="min-h-screen bg-dark-surface">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-dark-surface via-background to-dark-surface">
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
                <span className="text-foreground">{t('showcase.features.hero.title2prefix', 'para automatizar tu ')}</span>
                <span className="bg-gradient-to-r from-electric-cyan via-purple-accent to-electric-cyan bg-clip-text text-transparent">
                  <RotatingWord 
                    words={[
                      t('showcase.features.hero.word1', 'agencia'),
                      t('showcase.features.hero.word2', 'Pyme'),
                      t('showcase.features.hero.word3', 'Startup'),
                      t('showcase.features.hero.word4', 'empresa'),
                      t('showcase.features.hero.word5', 'marca')
                    ]}
                  />
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('showcase.features.hero.subtitle', 'Cinco cerebros de IA colaborando entre sí para ejecutar tu estrategia completa sin intervención manual.')}
              </p>
            </div>
          </div>
        </section>

        {/* WhatsApp Section - Hero Feature */}
        <section className="py-20 px-4 bg-gradient-to-b from-dark-surface to-background">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle
              title={t('showcase.features.whatsapp.sectionTitle', 'Gestiona todo tu marketing')}
              highlight={t('showcase.features.whatsapp.sectionHighlight', 'desde WhatsApp')}
              subtitle={t('showcase.features.whatsapp.sectionSubtitle', 'Sin dashboards complicados. Sin procesos manuales. Solo conversación inteligente que ejecuta todo por ti.')}
            />

            <div className="mt-16">
              <BrainCard
                icon={MessageCircle}
                title={whatsappFeature.title}
                description={whatsappFeature.description}
                features={whatsappFeature.features}
                color="green"
                delay={0}
              />
            </div>
          </div>
        </section>

        {/* Brainies Section */}
        <section className="py-20 px-4 bg-dark-surface">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle
              title={t('showcase.features.brainies.title', 'Conoce a los')}
              highlight={t('showcase.features.brainies.highlight', 'Brainies')}
              subtitle={t('showcase.features.brainies.subtitle', 'Cada Brainy se especializa en una función clave de tu marketing, trabajando en sincronía perfecta.')}
            />

            <div className="grid gap-8 mt-16">
              {brainies.map((brainy, index) => (
                <BrainCard
                  key={index}
                  icon={brainy.icon}
                  title={brainy.title}
                  description=""
                  features={brainy.features}
                  color={brainy.color}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-background to-dark-surface">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle
              title={t('showcase.features.whoItsFor.title', '¿A quién')}
              highlight={t('showcase.features.whoItsFor.highlight', 'le sirve Brainy?')}
              subtitle={t('showcase.features.whoItsFor.subtitle', 'Desde startups hasta corporaciones, Brainy se adapta a las necesidades específicas de cada industria.')}
            />

            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {industries.map((industry, index) => (
                <div key={index} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/20 to-purple-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-dark-surface/50 backdrop-blur-sm border border-border/40 rounded-2xl p-8 hover:border-electric-cyan/50 transition-all duration-300">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-dark-surface">
          <div className="container mx-auto max-w-4xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/30 to-purple-accent/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative bg-dark-surface/80 backdrop-blur-sm border border-electric-cyan/30 rounded-3xl p-12 text-center">
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
