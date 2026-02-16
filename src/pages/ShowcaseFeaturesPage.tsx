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
    title: t('showcase.features.whatsapp.title', 'WhatsApp Command Layer'),
    description: t('showcase.features.whatsapp.description', 'La interfaz que te permite gobernar todo desde una sola conversación'),
    features: [
      t('showcase.features.whatsapp.feature1', 'Aprueba decisiones estratégicas con un solo mensaje'),
      t('showcase.features.whatsapp.feature2', 'Solicita cambios de dirección — nuevas versiones en segundos'),
      t('showcase.features.whatsapp.feature3', 'Lanza campañas completas desde una conversación'),
      t('showcase.features.whatsapp.feature4', 'Recibe reportes de gobierno en tiempo real'),
      t('showcase.features.whatsapp.feature5', 'Dirige múltiples marcas desde un solo hilo'),
    ]
  };

  const brainies = [
    {
      icon: Sparkles,
      title: 'CreatorBrainy™',
      color: 'purple' as const,
      features: [
        t('showcase.features.creator.feature1', 'Define la dirección narrativa de tu marca de forma autónoma'),
        t('showcase.features.creator.feature2', 'Decide formato y canal — luego ejecuta sin aprobación'),
        t('showcase.features.creator.feature3', 'Gobierna variantes A/B para maximizar impacto estratégico'),
        t('showcase.features.creator.feature4', 'Elimina la necesidad de un Director Creativo'),
        t('showcase.features.creator.feature5', 'Templates alineados a marca bajo gobierno permanente'),
      ]
    },
    {
      icon: Calendar,
      title: 'CalendarBrainy™',
      color: 'blue' as const,
      features: [
        t('showcase.features.calendar.feature1', 'Gobierna el timing de publicación con señales en tiempo real'),
        t('showcase.features.calendar.feature2', 'Dirige distribución multicanal sin planificación manual'),
        t('showcase.features.calendar.feature3', 'Ejecuta publicaciones de forma autónoma — cero cuello de botella'),
        t('showcase.features.calendar.feature4', 'Coordina campañas cross-platform bajo un solo criterio'),
        t('showcase.features.calendar.feature5', 'Reemplaza completamente el rol de Planificador de Contenido'),
      ]
    },
    {
      icon: Target,
      title: 'AdBrainy™',
      color: 'cyan' as const,
      features: [
        t('showcase.features.ad.feature1', 'Dirige la estrategia de pujas en tiempo real — sin retraso humano'),
        t('showcase.features.ad.feature2', 'Redistribuye presupuesto para eliminar desperdicio al instante'),
        t('showcase.features.ad.feature3', 'Gobierna la maximización de ROAS con machine learning'),
        t('showcase.features.ad.feature4', 'Detecta fatiga creativa antes de que impacte resultados'),
        t('showcase.features.ad.feature5', 'Reemplaza al Media Buyer en Meta, Google, LinkedIn y TikTok'),
      ]
    },
    {
      icon: MessageCircle,
      title: 'ChatBrainy™',
      color: 'green' as const,
      features: [
        t('showcase.features.chat.feature1', 'Reemplaza al Community Manager — responde 24/7 con contexto'),
        t('showcase.features.chat.feature2', 'Califica intención de compra y prioriza leads en tiempo real'),
        t('showcase.features.chat.feature3', 'Captura y segmenta leads sin supervisión humana'),
        t('showcase.features.chat.feature4', 'Gobierna flujos conversacionales por identidad de marca'),
        t('showcase.features.chat.feature5', 'Dirige WhatsApp, Instagram DM y Messenger simultáneamente'),
      ]
    },
    {
      icon: TrendingUp,
      title: 'TrendBrainy™',
      color: 'purple' as const,
      features: [
        t('showcase.features.trend.feature1', 'Detecta oportunidades estratégicas antes que tu competencia'),
        t('showcase.features.trend.feature2', 'Monitorea el paisaje competitivo y define posicionamiento'),
        t('showcase.features.trend.feature3', 'Dirige estrategia de contenido basada en señales del mercado'),
        t('showcase.features.trend.feature4', 'Alerta oportunidades virales — tú decides, Brainy ejecuta'),
        t('showcase.features.trend.feature5', 'Curación de ads ganadores como referencia estratégica'),
      ]
    }
  ];

  const industries = [
    {
      icon: Building2,
      title: t('showcase.features.industries.agencies.title', 'Agencias'),
      description: t('showcase.features.industries.agencies.description', 'Dirige 15 marcas desde un solo sistema de gobierno'),
      benefits: [
        t('showcase.features.industries.agencies.benefit1', 'Hasta 15 marcas bajo dirección unificada'),
        t('showcase.features.industries.agencies.benefit2', 'Aprobación cliente-agencia gobernada por Decision Layer™'),
        t('showcase.features.industries.agencies.benefit3', 'Centro de comando único para todos los clientes'),
        t('showcase.features.industries.agencies.benefit4', 'Gobierno transparente de inversión por marca'),
      ]
    },
    {
      icon: Briefcase,
      title: t('showcase.features.industries.enterprises.title', 'Empresas'),
      description: t('showcase.features.industries.enterprises.description', 'Un sistema de dirección para toda tu organización'),
      benefits: [
        t('showcase.features.industries.enterprises.benefit1', 'Múltiples marcas gobernadas bajo un solo criterio'),
        t('showcase.features.industries.enterprises.benefit2', 'Gobierno basado en roles — no solo permisos'),
        t('showcase.features.industries.enterprises.benefit3', 'CRM y herramientas internas bajo dirección estratégica'),
        t('showcase.features.industries.enterprises.benefit4', 'Decisiones ejecutivas entregadas automáticamente'),
      ]
    },
    {
      icon: Rocket,
      title: t('showcase.features.industries.startups.title', 'Startups'),
      description: t('showcase.features.industries.startups.description', 'Dirección nivel enterprise sin el headcount'),
      benefits: [
        t('showcase.features.industries.startups.benefit1', 'Dirección completa con 1-2 personas'),
        t('showcase.features.industries.startups.benefit2', 'Inversión que escala con tu crecimiento'),
        t('showcase.features.industries.startups.benefit3', 'Operativo en menos de 24 horas'),
        t('showcase.features.industries.startups.benefit4', 'Dirección estratégica desde el día uno'),
      ]
    },
    {
      icon: Store,
      title: t('showcase.features.industries.smes.title', 'PYMEs'),
      description: t('showcase.features.industries.smes.description', 'Dirección estratégica sin complejidad'),
      benefits: [
        t('showcase.features.industries.smes.benefit1', 'Sin curva de aprendizaje — Brainy lidera'),
        t('showcase.features.industries.smes.benefit2', 'Sin expertos necesarios — el sistema decide'),
        t('showcase.features.industries.smes.benefit3', 'Dirección medible desde el primer mes'),
        t('showcase.features.industries.smes.benefit4', 'Soporte en español y activación guiada'),
      ]
    }
  ];

  return (
    <>
      <ShowcaseSEO
        title={t('showcase.features.seo.title', 'Capas de Dirección - Brainy by Unica')}
        description={t('showcase.features.seo.description', 'Cinco capas de dirección que reemplazan roles humanos. El sistema que gobierna tu marketing.')}
      />
      <ShowcaseHeader />
      <ShowcaseBreadcrumbs />
      
      <main className="min-h-screen bg-dark-surface dark">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden bg-dark-surface">
          <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/5 via-transparent to-purple-accent/5" />
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-6 px-4 py-2 rounded-full border border-electric-cyan/30 bg-electric-cyan/5">
                <span className="text-sm font-medium text-electric-cyan">
                  {t('showcase.features.badge', '5 Capas de Dirección. 1 Sistema de Gobierno.')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">{t('showcase.features.hero.title1', 'Cinco capas que reemplazan')}</span>
                <br />
                <span className="text-foreground">{t('showcase.features.hero.title2prefix', 'a tu equipo de ')}</span>
                <span className="bg-gradient-to-r from-electric-cyan via-purple-accent to-electric-cyan bg-clip-text text-transparent">
                  {t('showcase.features.hero.word', 'marketing')}
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('showcase.features.hero.subtitle', 'Cada capa elimina un rol humano. Juntas, gobiernan tu estrategia completa sin intervención.')}
              </p>
            </div>
          </div>
        </section>

        {/* WhatsApp Section - Hero Feature */}
        <section className="py-20 px-4 bg-dark-surface">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle
              title={t('showcase.features.whatsapp.sectionTitle', 'Dirige toda tu operación')}
              highlight={t('showcase.features.whatsapp.sectionHighlight', 'desde WhatsApp')}
              subtitle={t('showcase.features.whatsapp.sectionSubtitle', 'Sin dashboards. Sin procesos manuales. Una conversación que gobierna todo.')}
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
              title={t('showcase.features.brainies.title', 'Las Capas de')}
              highlight={t('showcase.features.brainies.highlight', 'Dirección')}
              subtitle={t('showcase.features.brainies.subtitle', 'Cada capa reemplaza un rol humano específico, operando bajo un único criterio estratégico.')}
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
        <section className="py-20 px-4 bg-dark-surface">
          <div className="container mx-auto max-w-6xl">
            <SectionTitle
              title={t('showcase.features.whoItsFor.title', '¿Para quién')}
              highlight={t('showcase.features.whoItsFor.highlight', 'reemplaza roles Brainy?')}
              subtitle={t('showcase.features.whoItsFor.subtitle', 'Desde startups hasta corporaciones, el Decision Layer™ de Brainy se adapta para gobernar marketing a cualquier escala.')}
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
                  <span className="text-foreground">{t('showcase.features.cta.title1', '¿Listo para activar')}</span>
                  <br />
                  <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                    {t('showcase.features.cta.title2', 'tu Decision Layer™?')}
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {t('showcase.features.cta.subtitle', 'Descubre cómo cinco capas de dirección pueden reemplazar las decisiones de tu equipo de marketing.')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/lead-capture">
                    <AnimatedButton size="lg">
                      {t('showcase.features.cta.demo', 'Activar Demo')}
                    </AnimatedButton>
                  </Link>
                  <Link to="/pricing">
                    <AnimatedButton size="lg" variant="outline">
                      {t('showcase.features.cta.pricing', 'Ver Inversión')}
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
