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
          clients: t('showcase.industries.agencies.metrics.before.clients'),
          team: t('showcase.industries.agencies.metrics.before.team'),
          hours: t('showcase.industries.agencies.metrics.before.hours'),
          profit: t('showcase.industries.agencies.metrics.before.profit')
        },
        after: {
          clients: t('showcase.industries.agencies.metrics.after.clients'),
          team: t('showcase.industries.agencies.metrics.after.team'),
          hours: t('showcase.industries.agencies.metrics.after.hours'),
          profit: t('showcase.industries.agencies.metrics.after.profit')
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
          tools: t('showcase.industries.enterprises.metrics.before.tools'),
          cost: t('showcase.industries.enterprises.metrics.before.cost'),
          visibility: t('showcase.industries.enterprises.metrics.before.visibility'),
          time: t('showcase.industries.enterprises.metrics.before.time')
        },
        after: {
          tools: t('showcase.industries.enterprises.metrics.after.tools'),
          cost: t('showcase.industries.enterprises.metrics.after.cost'),
          visibility: t('showcase.industries.enterprises.metrics.after.visibility'),
          time: t('showcase.industries.enterprises.metrics.after.time')
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
          budget: t('showcase.industries.startups.metrics.before.budget'),
          team: t('showcase.industries.startups.metrics.before.team'),
          content: t('showcase.industries.startups.metrics.before.content'),
          leads: t('showcase.industries.startups.metrics.before.leads')
        },
        after: {
          budget: t('showcase.industries.startups.metrics.after.budget'),
          team: t('showcase.industries.startups.metrics.after.team'),
          content: t('showcase.industries.startups.metrics.after.content'),
          leads: t('showcase.industries.startups.metrics.after.leads')
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
          presence: t('showcase.industries.smes.metrics.before.presence'),
          posts: t('showcase.industries.smes.metrics.before.posts'),
          sales: t('showcase.industries.smes.metrics.before.sales'),
          roi: t('showcase.industries.smes.metrics.before.roi')
        },
        after: {
          presence: t('showcase.industries.smes.metrics.after.presence'),
          posts: t('showcase.industries.smes.metrics.after.posts'),
          sales: t('showcase.industries.smes.metrics.after.sales'),
          roi: t('showcase.industries.smes.metrics.after.roi')
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
      
      <main className="min-h-screen bg-dark-surface dark">
        {/* Hero Section */}
        <section className="relative py-32 px-4 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-electric-cyan/10 via-purple-accent/5 to-transparent" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-electric-cyan/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full border border-electric-cyan/40 bg-electric-cyan/10 backdrop-blur-sm shadow-glow-cyan">
                <CheckCircle2 className="w-4 h-4 text-electric-cyan animate-pulse" />
                <span className="text-sm font-semibold text-electric-cyan uppercase tracking-wider">
                  {t('showcase.industries.badge', 'Resultados Reales')}
                </span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold mb-8 tracking-tight">
                <span className="text-white">{t('showcase.industries.hero.title1', 'Transforma tu marketing')}</span>
                <br />
                <span className="bg-gradient-to-r from-electric-cyan via-purple-accent to-pink-500 bg-clip-text text-transparent animate-gradient">
                  {t('showcase.industries.hero.title2', 'sin importar tu industria')}
                </span>
              </h1>
              
              <p className="text-2xl text-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
                {t('showcase.industries.hero.subtitle', 'Casos de éxito reales de agencias, empresas, startups y PYMEs que automatizaron su marketing con Brainy.')}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Users, value: '120+', label: t('showcase.industries.stats.activeClients') },
                { icon: TrendingUp, value: '4.2x', label: t('showcase.industries.stats.avgRoi') },
                { icon: Clock, value: '85%', label: t('showcase.industries.stats.timeSaved') },
                { icon: DollarSign, value: '€2M+', label: t('showcase.industries.stats.adSpendManaged') }
              ].map((stat, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/20 to-purple-accent/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-dark-surface/80 backdrop-blur-sm border border-electric-cyan/30 rounded-2xl p-6 text-center hover:border-electric-cyan/60 transition-all duration-300 hover:scale-105">
                    <stat.icon className="w-8 h-8 text-electric-cyan mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Sections */}
        {industries.map((industry, index) => (
          <section 
            key={industry.id} 
            className="relative py-32 px-4 overflow-hidden"
          >
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-5`} />
              <div className={`absolute top-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-96 h-96 bg-gradient-to-br ${industry.color} opacity-10 rounded-full blur-3xl`} />
            </div>

            <div className="container mx-auto max-w-7xl relative z-10">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Left: Info */}
                <div className={`space-y-10 ${index % 2 === 0 ? '' : 'lg:order-2'}`}>
                  <div className="space-y-6">
                    <div className="relative inline-block">
                      <div className={`absolute inset-0 bg-gradient-to-r ${industry.color} rounded-2xl blur-xl opacity-50`} />
                      <div className={`relative inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-gradient-to-r ${industry.color} shadow-glow`}>
                        <industry.icon className="w-10 h-10 text-white drop-shadow-lg" />
                        <span className="text-2xl font-bold text-white">{industry.title}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                      {industry.subtitle}
                    </h2>
                    <p className="text-xl text-foreground/90 leading-relaxed">{industry.description}</p>
                  </div>

                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${industry.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                    <div className="relative bg-dark-surface/90 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-white/20 transition-all duration-300">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-6">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${industry.color}`}>
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                        {t('showcase.industries.benefits', 'Beneficios Clave')}
                      </h3>
                      <ul className="space-y-4">
                        {industry.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-4 group/item">
                            <div className={`flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r ${industry.color} mt-2 group-hover/item:scale-150 transition-transform duration-300`} />
                            <span className="text-foreground/90 text-lg group-hover/item:text-white transition-colors duration-300">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-r ${industry.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                    <div className="relative bg-dark-surface/95 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl hover:border-white/20 transition-all duration-300">
                      <div className="mb-6">
                        <div className="text-6xl text-electric-cyan/20 font-serif leading-none mb-2">"</div>
                        <p className="text-foreground/90 text-lg italic leading-relaxed">{industry.testimonial.quote}</p>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${industry.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                          {industry.testimonial.author[0]}
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{industry.testimonial.author}</p>
                          <p className="text-foreground/70">{industry.testimonial.role}</p>
                          <p className="text-sm text-electric-cyan mt-1 font-semibold">{industry.testimonial.company}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Metrics Comparison */}
                <div className={`space-y-8 ${index % 2 === 0 ? '' : 'lg:order-1'}`}>
                  <h3 className="text-3xl font-bold text-center text-white mb-12 uppercase tracking-wider">
                    {t('showcase.industries.comparison', 'Antes vs Después')}
                  </h3>
                  
                  {/* Before */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-3xl blur-2xl" />
                    <div className="relative bg-dark-surface/90 backdrop-blur-md border-2 border-red-500/40 rounded-3xl p-8 hover:border-red-500/60 transition-all duration-300 shadow-2xl">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-2xl font-bold text-red-400 uppercase tracking-wide">{t('showcase.industries.before', 'Antes')}</h4>
                        <div className="p-3 rounded-full bg-red-500/20">
                          <TrendingUp className="w-6 h-6 text-red-400 rotate-180" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {Object.entries(industry.metrics.before).map(([key, value]) => (
                          <div key={key} className="space-y-2 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                            <p className="text-xs text-red-300/70 uppercase tracking-wider font-semibold">{key}</p>
                            <p className="text-2xl font-bold text-white">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-r ${industry.color} rounded-full blur-xl opacity-50 animate-pulse`} />
                      <div className={`relative p-5 rounded-full bg-gradient-to-r ${industry.color} shadow-glow`}>
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* After */}
                  <div className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-30 rounded-3xl blur-2xl`} />
                    <div className="relative bg-dark-surface/90 backdrop-blur-md border-2 border-electric-cyan/60 rounded-3xl p-8 hover:border-electric-cyan transition-all duration-300 shadow-2xl shadow-electric-cyan/20">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-2xl font-bold text-electric-cyan uppercase tracking-wide">{t('showcase.industries.after', 'Después')}</h4>
                        <div className="p-3 rounded-full bg-green-500/20">
                          <TrendingUp className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        {Object.entries(industry.metrics.after).map(([key, value]) => (
                          <div key={key} className="space-y-2 p-4 rounded-xl bg-electric-cyan/5 border border-electric-cyan/30 hover:border-electric-cyan/60 transition-all duration-300 group/metric">
                            <p className="text-xs text-electric-cyan/70 uppercase tracking-wider font-semibold">{key}</p>
                            <p className="text-2xl font-bold text-electric-cyan group-hover/metric:text-white transition-colors duration-300">{value}</p>
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
