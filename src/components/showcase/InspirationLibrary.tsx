import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, TrendingUp, Eye, Heart, Share2, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import adExample1 from '@/assets/showcase-ad-example-1.jpg';
import adExample2 from '@/assets/showcase-ad-example-2.jpg';
import adExample3 from '@/assets/showcase-ad-example-3.jpg';
import adExample4 from '@/assets/showcase-ad-example-4.jpg';

const InspirationLibrary = () => {
  const { t } = useTranslation();
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
      thumbnail: adExample1
    },
    {
      id: 2,
      title: 'Fitness Challenge Campaign',
      platform: 'Instagram',
      industry: 'Health & Wellness',
      format: 'Story',
      views: '1.8M',
      engagement: '15.2%',
      ctr: '9.1%',
      roi: '4.8x',
      insights: 'Storytelling emocional, transformación antes/después, comunidad activa',
      thumbnail: adExample2
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
      thumbnail: adExample3
    },
    {
      id: 4,
      title: 'Luxury Accessories Collection',
      platform: 'Instagram',
      industry: 'Fashion',
      format: 'Carousel',
      views: '1.2M',
      engagement: '14.3%',
      ctr: '8.8%',
      roi: '6.1x',
      insights: 'Fotografía editorial premium, uso estratégico de colores dorados, aspiracional',
      thumbnail: adExample4
    }
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
                {t('showcase.inspirationLibrary.title')}
              </CardTitle>
              <p className="text-base text-muted-foreground font-light">
                {t('showcase.inspirationLibrary.subtitle')}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {winningAds.map((ad, idx) => (
                  <motion.div
                    key={ad.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="border border-border/50 rounded-lg overflow-hidden bg-card/20 backdrop-blur-sm hover:shadow-lg hover:border-electric-cyan/30 transition-all duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden bg-muted/30">
                      <img 
                        src={ad.thumbnail} 
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <h3 className="font-bold text-base mb-2 text-foreground line-clamp-2">{ad.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="bg-electric-cyan/10 text-electric-cyan text-xs">{ad.platform}</Badge>
                          <Badge variant="outline" className="border-border/50 text-xs">{ad.industry}</Badge>
                          <Badge variant="outline" className="border-border/50 text-xs">{ad.format}</Badge>
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-border/50">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t('showcase.inspirationLibrary.metrics.views')}</p>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm font-bold text-foreground">{ad.views}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t('showcase.inspirationLibrary.metrics.engagement')}</p>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm font-bold text-foreground">{ad.engagement}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t('showcase.inspirationLibrary.metrics.ctr')}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm font-bold text-foreground">{ad.ctr}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">{t('showcase.inspirationLibrary.metrics.roi')}</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <p className="text-sm font-bold text-green-500">{ad.roi}</p>
                          </div>
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="bg-accent/30 rounded-lg p-2 mb-3 backdrop-blur-sm">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          🎯 {t('showcase.inspirationLibrary.metrics.keyInsights')}
                        </p>
                        <p className="text-xs text-foreground line-clamp-2">{ad.insights}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="w-full text-xs border-border/50">
                          <Eye className="w-3 h-3 mr-1" />
                          {t('showcase.inspirationLibrary.actions.viewFullAnalysis')}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full text-xs border-electric-cyan/30 hover:bg-electric-cyan/10">
                          <Share2 className="w-3 h-3 mr-1" />
                          {t('showcase.inspirationLibrary.actions.createSimilarAI')}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default InspirationLibrary;