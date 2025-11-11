import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/showcase')}
                className="mb-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Inicio
              </Button>
              <h1 className="text-3xl font-bold">Demo de la Plataforma</h1>
              <p className="text-muted-foreground mt-1">
                Explora cómo gestionar múltiples marcas con funcionalidades avanzadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h2 className="text-lg font-semibold mb-2">💡 Demo Interactivo</h2>
          <p className="text-sm text-muted-foreground">
            Este showcase demuestra las capacidades de la plataforma usando 3 marcas ejemplo. 
            Haz clic en cualquier marca para ver cómo funciona la <strong>calendarización</strong>, 
            <strong> publicación multicanal</strong> y <strong>workflow de aprobaciones</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.slug} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${brand.color}`} />
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{brand.name}</CardTitle>
                    <Badge variant="secondary" className="mb-3">
                      {brand.industry}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {brand.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{brand.stats.projects} Proyectos</span>
                  <span>{brand.stats.content} Contenidos</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {brand.stats.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button 
                    className="flex-1 gap-2" 
                    onClick={() => navigate(`/showcase/brands/${brand.slug}/setup`)}
                  >
                    Ver Brand Setup
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => window.open(brand.website, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseBrandsPage;
