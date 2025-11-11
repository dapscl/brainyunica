import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, TrendingUp, Eye, Heart, Share2, Search, Filter, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const InspirationLibrary = () => {
  const winningAds = [
    {
      id: 1,
      title: 'SaaS Product Launch',
      platform: 'LinkedIn',
      industry: 'Technology',
      format: 'Video',
      views: '2.4M',
      engagement: '12.8%',
      ctr: '8.5%',
      roi: '5.2x',
      insights: 'Hook fuerte en primeros 3s, CTA claro, prueba social efectiva',
      thumbnail: '/demo-tech-product-1.jpg'
    },
    {
      id: 2,
      title: 'Fitness Challenge Campaign',
      platform: 'Instagram',
      industry: 'Health & Wellness',
      format: 'Carousel',
      views: '1.8M',
      engagement: '15.2%',
      ctr: '9.1%',
      roi: '4.8x',
      insights: 'Storytelling emocional, transformación antes/después, comunidad activa',
      thumbnail: '/demo-fitness-1.jpg'
    },
    {
      id: 3,
      title: 'Eco Product Showcase',
      platform: 'Facebook',
      industry: 'Sustainability',
      format: 'Image',
      views: '980K',
      engagement: '10.5%',
      ctr: '7.2%',
      roi: '3.9x',
      insights: 'Valores de marca claros, impacto ambiental medible, diseño minimalista',
      thumbnail: '/demo-eco-product-1.jpg'
    },
  ];

  const topPerformers = [
    { metric: 'Mejor CTR', value: '14.8%', ad: 'Fitness App Promo' },
    { metric: 'Mejor ROI', value: '8.3x', ad: 'Fitness App Promo' },
    { metric: 'Mayor Engagement', value: '22.1%', ad: 'Fitness App Promo' },
    { metric: 'Más Vistas', value: '4.5M', ad: 'Fitness App Promo' }
  ];

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <Card className="border-electric-cyan/20 bg-card/30 backdrop-blur-sm hover:border-electric-cyan/40 transition-all duration-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-electric-cyan/10">
              <Lightbulb className="w-7 h-7 text-electric-cyan" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
                Biblioteca de Inspiración
              </CardTitle>
              <p className="text-base text-muted-foreground font-light">
                Ads ganadores de la industria con análisis detallado de rendimiento
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-tight">Top Performers del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {topPerformers.map((performer, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="border border-border/50 rounded-lg p-4 bg-card/20 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300"
                >
                  <p className="text-sm text-muted-foreground mb-1">{performer.metric}</p>
                  <p className="text-2xl font-bold mb-1 text-foreground">{performer.value}</p>
                  <p className="text-xs text-muted-foreground">{performer.ad}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por industria, plataforma o formato..." 
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <Button variant="outline" className="gap-2 border-border/50 hover:bg-accent/50">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Winning Ads Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-tight">Ads Ganadores Analizados</CardTitle>
            <p className="text-sm text-muted-foreground font-light">Creatividades de alto rendimiento con insights accionables</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList className="bg-card/50">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="image">Imagen</TabsTrigger>
                <TabsTrigger value="carousel">Carrusel</TabsTrigger>
                <TabsTrigger value="story">Story</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {winningAds.map((ad, idx) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="border border-border/50 rounded-lg p-4 bg-card/20 backdrop-blur-sm hover:shadow-lg hover:border-electric-cyan/30 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-muted/30 flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-electric-cyan opacity-80" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-lg mb-1 text-foreground">{ad.title}</h3>
                            <div className="flex gap-2 mb-2">
                              <Badge variant="secondary" className="bg-electric-cyan/10 text-electric-cyan">{ad.platform}</Badge>
                              <Badge variant="outline" className="border-border/50">{ad.industry}</Badge>
                              <Badge variant="outline" className="border-border/50">{ad.format}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-4 gap-4 mb-3 pb-3 border-b border-border/50">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Vistas</p>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-muted-foreground" />
                              <p className="text-sm font-bold text-foreground">{ad.views}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-muted-foreground" />
                              <p className="text-sm font-bold text-foreground">{ad.engagement}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">CTR</p>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-muted-foreground" />
                              <p className="text-sm font-bold text-foreground">{ad.ctr}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">ROI</p>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                              <p className="text-sm font-bold text-green-500">{ad.roi}</p>
                            </div>
                          </div>
                        </div>

                        {/* Insights */}
                        <div className="bg-accent/30 rounded-lg p-3 mb-3 backdrop-blur-sm">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            🎯 Insights Clave
                          </p>
                          <p className="text-sm text-foreground">{ad.insights}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-1 border-border/50">
                            <Eye className="w-3 h-3" />
                            Ver Análisis Completo
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 border-border/50">
                            <Share2 className="w-3 h-3" />
                            Usar como Referencia
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1 border-electric-cyan/30 hover:bg-electric-cyan/10">
                            <Play className="w-3 h-3" />
                            Crear Similar con IA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InspirationLibrary;