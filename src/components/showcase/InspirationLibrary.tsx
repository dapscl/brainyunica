import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, TrendingUp, Eye, Heart, Share2, Search, Filter, Play } from 'lucide-react';

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
    {
      id: 4,
      title: 'B2B Lead Generation',
      platform: 'LinkedIn',
      industry: 'SaaS',
      format: 'Video',
      views: '1.2M',
      engagement: '11.3%',
      ctr: '8.9%',
      roi: '6.1x',
      insights: 'Problema específico resuelto, testimonios de C-level, datos concretos',
      thumbnail: '/demo-tech-product-2.jpg'
    },
    {
      id: 5,
      title: 'E-commerce Flash Sale',
      platform: 'Instagram',
      industry: 'Retail',
      format: 'Story',
      views: '3.1M',
      engagement: '18.5%',
      ctr: '12.3%',
      roi: '7.2x',
      insights: 'Urgencia efectiva, precio destacado, proceso de compra simplificado',
      thumbnail: '/demo-eco-product-2.jpg'
    },
    {
      id: 6,
      title: 'Fitness App Promo',
      platform: 'TikTok',
      industry: 'Health Tech',
      format: 'Video',
      views: '4.5M',
      engagement: '22.1%',
      ctr: '14.8%',
      roi: '8.3x',
      insights: 'Trend viral adaptado, música pegajosa, demo de app en acción',
      thumbnail: '/demo-fitness-2.jpg'
    }
  ];

  const topPerformers = [
    { metric: 'Mejor CTR', value: '14.8%', ad: 'Fitness App Promo' },
    { metric: 'Mejor ROI', value: '8.3x', ad: 'Fitness App Promo' },
    { metric: 'Mayor Engagement', value: '22.1%', ad: 'Fitness App Promo' },
    { metric: 'Más Vistas', value: '4.5M', ad: 'Fitness App Promo' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Biblioteca de Inspiración</CardTitle>
              <CardDescription className="text-base">
                Ads ganadores de la industria con análisis detallado de rendimiento
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers del Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {topPerformers.map((performer, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                <p className="text-sm text-muted-foreground mb-1">{performer.metric}</p>
                <p className="text-2xl font-bold mb-1">{performer.value}</p>
                <p className="text-xs text-muted-foreground">{performer.ad}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por industria, plataforma o formato..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Winning Ads Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Ads Ganadores Analizados</CardTitle>
          <CardDescription>Creatividades de alto rendimiento con insights accionables</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="video">Video</TabsTrigger>
              <TabsTrigger value="image">Imagen</TabsTrigger>
              <TabsTrigger value="carousel">Carrusel</TabsTrigger>
              <TabsTrigger value="story">Story</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {winningAds.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-80" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{ad.title}</h3>
                          <div className="flex gap-2 mb-2">
                            <Badge variant="secondary">{ad.platform}</Badge>
                            <Badge variant="outline">{ad.industry}</Badge>
                            <Badge variant="outline">{ad.format}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-4 gap-4 mb-3 pb-3 border-b">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Vistas</p>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm font-semibold">{ad.views}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm font-semibold">{ad.engagement}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">CTR</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm font-semibold">{ad.ctr}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">ROI</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <p className="text-sm font-semibold text-green-500">{ad.roi}</p>
                          </div>
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="bg-accent/50 rounded-lg p-3 mb-3">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          🎯 Insights Clave
                        </p>
                        <p className="text-sm">{ad.insights}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Eye className="w-3 h-3" />
                          Ver Análisis Completo
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Share2 className="w-3 h-3" />
                          Usar como Referencia
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Play className="w-3 h-3" />
                          Crear Similar con IA
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspirationLibrary;
