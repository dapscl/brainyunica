import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import demoTechstartImage from '@/assets/demo-techstart.jpg';
import demoEcogreenImage from '@/assets/demo-ecogreen.jpg';
import demoFitlifeImage from '@/assets/demo-fitlife.jpg';

const brands = [
  {
    slug: 'techstart',
    name: 'TechStart Solutions',
    industry: 'Tecnología',
    description: 'Startup de tecnología innovadora enfocada en soluciones empresariales basadas en IA y automatización.',
    logo: demoTechstartImage,
    website: 'https://techstart.demo',
    stats: {
      projects: 4,
      content: 12,
      platforms: ['LinkedIn', 'Twitter', 'Facebook']
    },
    color: 'bg-blue-500'
  },
  {
    slug: 'ecogreen',
    name: 'EcoGreen Products',
    industry: 'Sostenibilidad',
    description: 'Marca ecológica comprometida con productos sustentables y educación ambiental para un futuro más verde.',
    logo: demoEcogreenImage,
    website: 'https://ecogreen.demo',
    stats: {
      projects: 3,
      content: 8,
      platforms: ['Instagram', 'Facebook', 'Twitter']
    },
    color: 'bg-green-500'
  },
  {
    slug: 'fitlife',
    name: 'FitLife Gym',
    industry: 'Fitness',
    description: 'Cadena de gimnasios premium con enfoque en entrenamientos personalizados y bienestar integral.',
    logo: demoFitlifeImage,
    website: 'https://fitlife.demo',
    stats: {
      projects: 5,
      content: 15,
      platforms: ['Instagram', 'Facebook', 'TikTok']
    },
    color: 'bg-orange-500'
  }
];

const ShowcaseBrandsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseSEO 
        title={t('showcase.brands.title', 'Brands')}
        description={t('showcase.brands.description', 'Explore how to manage multiple brands with advanced AI-powered features')}
        path="/brands"
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-20">
        <ShowcaseBreadcrumbs />
        
        <motion.div 
          className="mt-12 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="outline" className="mb-6 px-6 py-3 text-electric-cyan border-electric-cyan/30 bg-electric-cyan/5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Demo Interactivo
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">
            <span className="text-foreground">{t('showcase.brands.heading', 'Demo de la')}</span>{' '}
            <span className="text-electric-cyan">Plataforma</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">
            {t('showcase.brands.subheading', 'Explora cómo gestionar múltiples marcas con funcionalidades avanzadas')}
          </p>
        </motion.div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-20">
        <motion.div 
          className="mb-12 p-8 bg-card/30 backdrop-blur-sm rounded-2xl border border-electric-cyan/20"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-3 text-foreground">💡 Demo Interactivo</h2>
          <p className="text-muted-foreground font-light">
            Este showcase demuestra las capacidades de la plataforma usando 3 marcas ejemplo. 
            Haz clic en cualquier marca para ver cómo funciona la <span className="text-electric-cyan font-medium">calendarización</span>, 
            <span className="text-electric-cyan font-medium"> publicación multicanal</span> y <span className="text-electric-cyan font-medium">workflow de aprobaciones</span>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-glow-cyan transition-all duration-500 bg-card/50 backdrop-blur-sm border border-border/50 hover:border-electric-cyan/50 group">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute top-4 left-4 w-4 h-4 rounded-full ${brand.color} shadow-glow animate-pulse`} />
                </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-3 font-bold">{brand.name}</CardTitle>
                    <Badge variant="outline" className="mb-3 border-electric-cyan/30 text-electric-cyan bg-electric-cyan/10">
                      {brand.industry}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 font-light text-base">
                  {brand.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground font-medium">
                  <span>{brand.stats.projects} Proyectos</span>
                  <span>{brand.stats.content} Contenidos</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {brand.stats.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs border-border/50">
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 gap-2 bg-gradient-to-r from-electric-cyan to-electric-cyan/90 hover:opacity-90 text-background font-bold" 
                    onClick={() => navigate(`/brands/${brand.slug}/setup`)}
                  >
                    Ver Brand Setup
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="border-electric-cyan/30 hover:bg-electric-cyan/10 hover:border-electric-cyan/50"
                    onClick={() => window.open(brand.website, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseBrandsPage;
