import { useTranslation } from 'react-i18next';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { SectionTitle } from '@/components/showcase/SectionTitle';
import { AnimatedButton } from '@/components/showcase/AnimatedButton';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Briefcase, 
  Rocket, 
  Store,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  CheckCircle2
} from 'lucide-react';

export default function ShowcaseIndustriesPage() {
  const { t } = useTranslation();

  const industries = [
    {
      id: 'agencies',
      icon: Building2,
      title: t('showcase.industries.agencies.title', 'Agencias'),
      subtitle: t('showcase.industries.agencies.subtitle', 'Gestiona múltiples clientes sin caos'),
      description: t('showcase.industries.agencies.description', 'Escala tu agencia sin contratar más personal. Brainy automatiza todo el flujo de trabajo para que puedas gestionar hasta 15 marcas diferentes con un solo equipo.'),
      color: 'from-electric-cyan to-cyan-400',
      benefits: [
        t('showcase.industries.agencies.benefit1', 'Hasta 15 marcas operando en paralelo'),
        t('showcase.industries.agencies.benefit2', 'Flujos de aprobación cliente-agencia automatizados'),
        t('showcase.industries.agencies.benefit3', 'Dashboard consolidado de todos los clientes'),
        t('showcase.industries.agencies.benefit4', 'Facturación transparente basada en ad spend real'),
      ],
      testimonial: {
        quote: t('showcase.industries.agencies.testimonial.quote', 'Pasamos de gestionar 3 clientes con un equipo de 8 personas a gestionar 12 clientes con el mismo equipo. Brainy nos permitió escalar sin perder calidad.'),
        author: t('showcase.industries.agencies.testimonial.author', 'María González'),
        role: t('showcase.industries.agencies.testimonial.role', 'CEO, Digital Wave Agency'),
        company: 'Madrid, España'
      },
      metrics: {
        before: {
          clients: '3 clientes',
          team: '8 personas',
          hours: '160 hrs/mes',
          profit: '15% margen'
        },
        after: {
          clients: '12 clientes',
          team: '8 personas',
          hours: '40 hrs/mes',
          profit: '42% margen'
        }
      }
    },
    {
      id: 'enterprises',
      icon: Briefcase,
      title: t('showcase.industries.enterprises.title', 'Empresas'),
      subtitle: t('showcase.industries.enterprises.subtitle', 'Centraliza todo tu marketing corporativo'),
      description: t('showcase.industries.enterprises.description', 'Unifica todas tus marcas y submarcas en una sola plataforma. Control total, visibilidad completa y reportes ejecutivos automáticos para la dirección.'),
      color: 'from-purple-accent to-pink-500',
      benefits: [
        t('showcase.industries.enterprises.benefit1', 'Múltiples marcas y sub-marcas organizadas'),
        t('showcase.industries.enterprises.benefit2', 'Control granular de permisos por equipos'),
        t('showcase.industries.enterprises.benefit3', 'Integraciones con CRM, ERP y herramientas internas'),
        t('showcase.industries.enterprises.benefit4', 'Reportes ejecutivos automáticos para directivos'),
      ],
      testimonial: {
        quote: t('showcase.industries.enterprises.testimonial.quote', 'Antes teníamos 4 herramientas diferentes y ninguna visibilidad real. Ahora todo el grupo corporativo opera desde Brainy con total transparencia.'),
        author: t('showcase.industries.enterprises.testimonial.author', 'Carlos Mendoza'),
        role: t('showcase.industries.enterprises.testimonial.role', 'CMO, TechCorp Group'),
        company: 'Buenos Aires, Argentina'
      },
      metrics: {
        before: {
          tools: '6 herramientas',
          cost: '$12K/mes',
          visibility: '30% datos',
          time: '20 días/reporte'
        },
        after: {
          tools: '1 plataforma',
          cost: '$4.5K/mes',
          visibility: '100% datos',
          time: 'Tiempo real'
        }
      }
    },
    {
      id: 'startups',
      icon: Rocket,
      title: t('showcase.industries.startups.title', 'Startups'),
      subtitle: t('showcase.industries.startups.subtitle', 'Crece rápido sin aumentar costos'),
      description: t('showcase.industries.startups.description', 'Marketing de nivel enterprise con presupuesto de startup. Automatización completa desde el día uno para que puedas enfocarte en product-market fit y crecimiento.'),
      color: 'from-blue-500 to-electric-cyan',
      benefits: [
        t('showcase.industries.startups.benefit1', 'Setup completo en menos de 24 horas'),
        t('showcase.industries.startups.benefit2', 'Pricing accesible que escala con tu facturación'),
        t('showcase.industries.startups.benefit3', 'Operación ágil con solo 1-2 personas'),
        t('showcase.industries.startups.benefit4', 'Automatización total desde el primer día'),
      ],
      testimonial: {
        quote: t('showcase.industries.startups.testimonial.quote', 'Como startup lean, no podíamos contratar un equipo de marketing completo. Brainy nos dio capacidades de agencia con costo de herramienta SaaS.'),
        author: t('showcase.industries.startups.testimonial.author', 'Ana Ruiz'),
        role: t('showcase.industries.startups.testimonial.role', 'Founder & CEO, FitTech'),
        company: 'Santiago, Chile'
      },
      metrics: {
        before: {
          budget: '$8K/mes',
          team: '2 freelancers',
          content: '10 posts/mes',
          leads: '45 leads/mes'
        },
        after: {
          budget: '$2K/mes',
          team: '1 persona',
          content: '80 posts/mes',
          leads: '380 leads/mes'
        }
      }
    },
    {
      id: 'smes',
      icon: Store,
      title: t('showcase.industries.smes.title', 'PYMEs'),
      subtitle: t('showcase.industries.smes.subtitle', 'Marketing profesional sin complicaciones'),
      description: t('showcase.industries.smes.description', 'No necesitas ser experto en marketing digital. Brainy te guía paso a paso y automatiza todo el proceso para que obtengas resultados profesionales sin conocimiento técnico.'),
      color: 'from-green-500 to-emerald-600',
      benefits: [
        t('showcase.industries.smes.benefit1', 'Interfaz simple sin curva de aprendizaje'),
        t('showcase.industries.smes.benefit2', 'Sin necesidad de expertos en marketing'),
        t('showcase.industries.smes.benefit3', 'Resultados medibles desde el primer mes'),
        t('showcase.industries.smes.benefit4', 'Soporte en español y onboarding guiado'),
      ],
      testimonial: {
        quote: t('showcase.industries.smes.testimonial.quote', 'Nunca había usado herramientas de marketing digital. Con Brainy simplemente chateamos por WhatsApp y todo se hace solo. Es increíble.'),
        author: t('showcase.industries.smes.testimonial.author', 'Roberto Silva'),
        role: t('showcase.industries.smes.testimonial.role', 'Dueño, Café Silva'),
        company: 'Lima, Perú'
      },
      metrics: {
        before: {
          presence: 'Solo Facebook',
          posts: 'Irregular',
          sales: '12 ventas/mes',
          roi: 'No medible'
        },
        after: {
          presence: '5 plataformas',
          posts: '60 posts/mes',
          sales: '47 ventas/mes',
          roi: '4.2x ROAS'
        }
      }
    }
  ];

  return (
    <>
      <ShowcaseSEO
        title={t('showcase.industries.seo.title', 'Industrias - Brainy by Unica')}
        description={t('showcase.industries.seo.description', 'Descubre cómo Brainy transforma el marketing de agencias, empresas, startups y PYMEs. Casos de éxito reales y métricas comprobadas.')}
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
                  {t('showcase.industries.badge', 'Resultados Reales')}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-foreground">{t('showcase.industries.hero.title1', 'Transforma tu marketing')}</span>
                <br />
                <span className="bg-gradient-to-r from-electric-cyan via-purple-accent to-electric-cyan bg-clip-text text-transparent">
                  {t('showcase.industries.hero.title2', 'sin importar tu industria')}
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('showcase.industries.hero.subtitle', 'Casos de éxito reales de agencias, empresas, startups y PYMEs que automatizaron su marketing con Brainy.')}
              </p>
            </div>
          </div>
        </section>

        {/* Industries Sections */}
        {industries.map((industry, index) => (
          <section 
            key={industry.id} 
            className={`py-20 px-4 ${index % 2 === 0 ? 'bg-dark-surface' : 'bg-gradient-to-b from-background to-dark-surface'}`}
          >
            <div className="container mx-auto max-w-6xl">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Left: Info */}
                <div className="space-y-8">
                  <div>
                    <div className={`inline-flex items-center gap-3 mb-4 p-3 rounded-xl bg-gradient-to-r ${industry.color}`}>
                      <industry.icon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold mb-3 text-foreground">{industry.title}</h2>
                    <p className="text-xl text-electric-cyan mb-4">{industry.subtitle}</p>
                    <p className="text-muted-foreground leading-relaxed">{industry.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-electric-cyan" />
                      {t('showcase.industries.benefits', 'Beneficios Clave')}
                    </h3>
                    <ul className="space-y-3">
                      {industry.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-electric-cyan mt-2" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Testimonial */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/20 to-purple-accent/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative bg-dark-surface/80 backdrop-blur-sm border border-border/40 rounded-2xl p-6">
                      <p className="text-muted-foreground italic mb-4">"{industry.testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-foreground">{industry.testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{industry.testimonial.role}</p>
                        <p className="text-xs text-electric-cyan mt-1">{industry.testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics Comparison */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-center text-foreground mb-8">
                    {t('showcase.industries.comparison', 'Antes vs Después')}
                  </h3>
                  
                  {/* Before */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-2xl blur-xl" />
                    <div className="relative bg-dark-surface/60 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-red-400">{t('showcase.industries.before', 'Antes')}</h4>
                        <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(industry.metrics.before).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{key}</p>
                            <p className="text-lg font-bold text-foreground">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="p-3 rounded-full bg-gradient-to-r from-electric-cyan to-purple-accent animate-pulse">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/20 to-green-500/20 rounded-2xl blur-xl" />
                    <div className="relative bg-dark-surface/60 backdrop-blur-sm border border-electric-cyan/50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-electric-cyan">{t('showcase.industries.after', 'Después')}</h4>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(industry.metrics.after).map(([key, value]) => (
                          <div key={key} className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">{key}</p>
                            <p className="text-lg font-bold text-electric-cyan">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Final CTA */}
        <section className="py-20 px-4 bg-dark-surface">
          <div className="container mx-auto max-w-4xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-electric-cyan/30 to-purple-accent/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative bg-dark-surface/80 backdrop-blur-sm border border-electric-cyan/30 rounded-3xl p-12 text-center">
                <h2 className="text-4xl font-bold mb-6">
                  <span className="text-foreground">{t('showcase.industries.cta.title1', '¿Listo para')}</span>
                  <br />
                  <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
                    {t('showcase.industries.cta.title2', 'transformar tu industria?')}
                  </span>
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  {t('showcase.industries.cta.subtitle', 'Únete a las empresas que ya automatizaron su marketing con Brainy.')}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/lead-capture">
                    <AnimatedButton size="lg">
                      {t('showcase.industries.cta.demo', 'Solicitar Demo')}
                    </AnimatedButton>
                  </Link>
                  <Link to="/pricing">
                    <AnimatedButton size="lg" variant="outline">
                      {t('showcase.industries.cta.pricing', 'Ver Precios')}
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
