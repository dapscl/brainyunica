import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  Target, 
  Users, 
  MessageSquare,
  TrendingUp,
  BarChart3,
  Zap,
  Bot,
  Eye,
  Palette,
  MessageCircle,
  DollarSign,
  CheckCircle2,
  Euro
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import showcaseAIMediaBuyer from '@/assets/showcase-ai-media-buyer.jpg';
import showcaseWhatsAppManager from '@/assets/showcase-whatsapp-manager.jpg';
import showcaseCreativeTracker from '@/assets/showcase-creative-tracker.jpg';
import showcaseMultichannel from '@/assets/showcase-multichannel.jpg';
import showcasePricingTiers from '@/assets/showcase-pricing-tiers.jpg';
import { InteractiveDemoFlow } from '@/components/showcase/InteractiveDemoFlow';

const ShowcasePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto space-y-6">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-primary border-primary/30">
            <Sparkles className="w-4 h-4 mr-2" />
            Plataforma Todo-en-Uno para Marketing Digital
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            La Única Plataforma que
            <span className="block text-primary mt-2">Reemplaza 4 Herramientas</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Gestión de redes sociales, automatización de chat, optimización de campañas publicitarias y reporting en tiempo real. 
            Todo en un solo lugar, gestionado desde WhatsApp.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" onClick={() => navigate('/showcase/onboarding')} className="gap-2 text-lg px-8 py-6">
              Comenzar Setup Guiado
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => document.getElementById('demo-interactivo')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-lg px-8 py-6 gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Ver Demo Interactivo
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo-interactivo" className="container mx-auto px-4 py-20 bg-gradient-to-b from-background to-secondary/10">
        <InteractiveDemoFlow />
      </section>

      {/* WhatsApp Project Manager Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-green-500/5 via-background to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 border-green-500/30">
              <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
              Funcionalidad Estrella
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              WhatsApp como Project Manager
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Olvida los dashboards tradicionales. BrainybyUnica gestiona todo tu contenido a través de conversaciones naturales por WhatsApp.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-green-500" />
                    Aprobaciones Inteligentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    BrainybyUnica te envía el contenido pre-programado para aprobación. Responde con ✅ para publicar, 
                    o pide sugerencias alternativas generadas por IA.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Sugerencias Semanales Automáticas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cada lunes, BrainybyUnica analiza Google Trends y fuentes RSS (TechCrunch, The Drum, AdAge) y te sugiere 
                    las 3 tendencias más relevantes para tu marca.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-500" />
                    Publicación Inmediata o Programada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Envía una imagen por WhatsApp y BrainybyUnica la programa automáticamente. Publica ahora o calendariza 
                    para más tarde con un simple mensaje.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-25"></div>
              <img 
                src={showcaseWhatsAppManager} 
                alt="WhatsApp Project Manager Interface" 
                className="relative rounded-lg shadow-2xl border border-green-500/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AI Media Buyer Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 border-purple-500/30">
              <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
              Optimización Automática
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              AI Media Buyer Personal
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tu asistente de IA analiza tus campañas 24/7 y optimiza automáticamente pujas, presupuestos y audiencias.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25"></div>
              <img 
                src={showcaseAIMediaBuyer} 
                alt="AI Media Buyer Dashboard" 
                className="relative rounded-lg shadow-2xl border border-purple-500/20"
              />
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <Card className="border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    Recomendaciones en Tiempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Recibe alertas inteligentes cuando una campaña necesita ajustes, con sugerencias específicas 
                    para mejorar ROAS, reducir CPA y maximizar conversiones.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    Optimización Automática de Pujas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    El AI Media Buyer ajusta pujas automáticamente según performance, redistribuye presupuesto 
                    entre creatividades y pausa ads con baja eficiencia.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-500" />
                    Detección de Fatiga Creativa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Identifica automáticamente cuando una creatividad pierde efectividad y te sugiere 
                    variantes frescas antes de que afecte tu ROI.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Performance Tracker Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-blue-500/5 via-background to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 border-blue-500/30">
              <Palette className="w-4 h-4 mr-2 text-blue-500" />
              Analytics Avanzados
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Seguimiento Individual por Creatividad
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Monitorea el rendimiento de cada pieza creativa con métricas detalladas, A/B testing automático y análisis de engagement.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-blue-500/20">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold mb-2 text-blue-500">4.2%</div>
                    <p className="text-sm text-muted-foreground">CTR Promedio</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-500/20">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold mb-2 text-blue-500">€2.10</div>
                    <p className="text-sm text-muted-foreground">CPA Promedio</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-500/20">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold mb-2 text-blue-500">5.8x</div>
                    <p className="text-sm text-muted-foreground">ROAS</p>
                  </CardContent>
                </Card>
                <Card className="border-blue-500/20">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold mb-2 text-blue-500">89%</div>
                    <p className="text-sm text-muted-foreground">Aprobaciones</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-blue-500/20">
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Comparación automática entre variantes de una misma campaña</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Detección de creatividades con mejor performance por segmento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Alertas cuando una creatividad supera el umbral de fatiga</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25"></div>
              <img 
                src={showcaseCreativeTracker} 
                alt="Creative Performance Tracker" 
                className="relative rounded-lg shadow-2xl border border-blue-500/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Channel Communication Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 border-orange-500/30">
              <MessageSquare className="w-4 h-4 mr-2 text-orange-500" />
              Comunicación Unificada
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Bandeja de Entrada Omnicanal
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Gestiona WhatsApp, Instagram DMs, Facebook Messenger, LinkedIn y Email desde un solo lugar con automatizaciones inteligentes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-25"></div>
              <img 
                src={showcaseMultichannel} 
                alt="Multi-Channel Communication Hub" 
                className="relative rounded-lg shadow-2xl border border-orange-500/20"
              />
            </div>

            <div className="space-y-6 order-1 md:order-2">
              <Card className="border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Respuestas Automáticas con IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    La IA responde automáticamente FAQs, califica leads y deriva conversaciones complejas 
                    a tu equipo humano cuando es necesario.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-orange-500" />
                    Comment → DM Automation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Convierte comentarios en Instagram/Facebook en conversaciones privadas automáticamente. 
                    Captura leads sin perder ninguna oportunidad.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    Segmentación y Lead Scoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Etiqueta y segmenta contactos automáticamente según su interacción. 
                    La IA asigna puntuación de calidad a cada lead.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-2 border-primary/30">
              <Euro className="w-4 h-4 mr-2" />
              Pricing Transparente
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Precio Variable según tu Inversión Publicitaria
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Paga solo por lo que usas. Nuestro modelo de pricing escala con tu inversión en ads, sin sorpresas.
            </p>
          </div>

          <div className="mb-12">
            <img 
              src={showcasePricingTiers} 
              alt="Pricing Tiers" 
              className="rounded-lg shadow-2xl border border-primary/20 mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tier Básico</span>
                  <Badge variant="outline">Starter</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold mb-2">3-5%</div>
                  <p className="text-sm text-muted-foreground">de tu inversión publicitaria mensual</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Para inversiones de:</p>
                  <p className="text-2xl font-bold text-primary">€500 - €5,000</p>
                  <p className="text-sm text-muted-foreground">por mes</p>
                </div>
                <ul className="space-y-2 pt-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Hasta 3 marcas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>WhatsApp Project Manager</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Calendario y publicación multicanal</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20 relative overflow-hidden shadow-lg scale-105">
              <Badge className="absolute top-4 right-4">Popular</Badge>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tier Profesional</span>
                  <Badge variant="outline">Pro</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold mb-2">2-4%</div>
                  <p className="text-sm text-muted-foreground">de tu inversión publicitaria mensual</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Para inversiones de:</p>
                  <p className="text-2xl font-bold text-primary">€5,000 - €25,000</p>
                  <p className="text-sm text-muted-foreground">por mes</p>
                </div>
                <ul className="space-y-2 pt-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Hasta 10 marcas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>AI Media Buyer completo</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Creative Performance Tracker</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Multi-channel automation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Tier Enterprise</span>
                  <Badge variant="outline">Elite</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-3xl font-bold mb-2">1-3%</div>
                  <p className="text-sm text-muted-foreground">de tu inversión publicitaria mensual</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Para inversiones de:</p>
                  <p className="text-2xl font-bold text-primary">€25,000+</p>
                  <p className="text-sm text-muted-foreground">por mes</p>
                </div>
                <ul className="space-y-2 pt-4">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Marcas ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Account Manager dedicado</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>White-label options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary/5 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <DollarSign className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">¿Cómo funciona el pricing variable?</h3>
                  <p className="text-muted-foreground mb-4">
                    Tu inversión publicitaria mensual determina automáticamente tu tier. Cuanto más inviertes, 
                    menor es el porcentaje que pagas por usar nuestra plataforma. El sistema calcula y ajusta 
                    tu factura mensualmente sin intervención manual.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>Facturación mensual automática</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>Sin tarifas ocultas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>Cambia de tier automáticamente</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="border-primary/20 text-center">
            <CardContent className="pt-6">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">3</div>
              <p className="text-muted-foreground">Marcas Demo</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 text-center">
            <CardContent className="pt-6">
              <Target className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">24</div>
              <p className="text-muted-foreground">Contenidos Programados</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 text-center">
            <CardContent className="pt-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">12</div>
              <p className="text-muted-foreground">Campañas Activas</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 text-center">
            <CardContent className="pt-6">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <div className="text-4xl font-bold mb-2">5.8x</div>
              <p className="text-muted-foreground">ROAS Promedio</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-12 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-white/5 [mask-image:radial-gradient(white,transparent_70%)]"></div>
          
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Listo para Revolucionar tu Marketing?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Explora el demo completo con 3 marcas reales, contenido programado, campañas activas y todas las 
              funcionalidades en acción.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/showcase/onboarding')} className="gap-2 text-lg px-8 py-6">
                Comenzar Setup Ahora
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/showcase/brands')} className="text-lg px-8 py-6">
                Ver Demo Interactivo
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 justify-center mt-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Setup en 15 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span>Soporte en español</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShowcasePage;
