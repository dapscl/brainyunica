import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import demoTechstartImage from '@/assets/demo-techstart.jpg';
import demoEcogreenImage from '@/assets/demo-ecogreen.jpg';
import demoFitlifeImage from '@/assets/demo-fitlife.jpg';
import demoTechProduct1 from '@/assets/demo-tech-product-1.jpg';
import demoTechProduct2 from '@/assets/demo-tech-product-2.jpg';
import demoEcoProduct1 from '@/assets/demo-eco-product-1.jpg';
import demoEcoProduct2 from '@/assets/demo-eco-product-2.jpg';
import demoFitness1 from '@/assets/demo-fitness-1.jpg';
import demoFitness2 from '@/assets/demo-fitness-2.jpg';

const brandData: Record<string, any> = {
  techstart: {
    name: 'TechStart Solutions',
    industry: 'Tecnología',
    logo: demoTechstartImage,
    description: 'Startup de tecnología innovadora enfocada en soluciones empresariales basadas en IA y automatización.',
    examples: [
      {
        id: 1,
        title: '🚀 Lanzamiento Producto Innovador',
        content: '¡Estamos emocionados de presentar nuestra nueva solución tecnológica! 💻 Descubre cómo puede transformar tu negocio. #TechInnovation #NewProduct',
        image: demoTechProduct1,
        platforms: ['linkedin', 'facebook', 'twitter'],
        date: '2025-01-15',
        status: 'Publicado'
      },
      {
        id: 2,
        title: '💻 Nuevo Workspace Digital',
        content: 'Transforma tu espacio de trabajo con nuestras herramientas de última generación. Productividad al máximo nivel 🚀 #WorkSmart #TechTools',
        image: demoTechProduct2,
        platforms: ['linkedin', 'twitter'],
        date: '2025-01-20',
        status: 'Programado'
      },
      {
        id: 3,
        title: '🎯 Caso de Éxito: Automatización',
        content: 'Cómo ayudamos a una empresa a reducir costos en un 40% mediante automatización inteligente. Lee el caso completo 👇',
        image: demoTechProduct1,
        platforms: ['linkedin'],
        date: '2025-01-25',
        status: 'Borrador'
      }
    ]
  },
  ecogreen: {
    name: 'EcoGreen Products',
    industry: 'Sostenibilidad',
    logo: demoEcogreenImage,
    description: 'Marca ecológica comprometida con productos sustentables y educación ambiental para un futuro más verde.',
    examples: [
      {
        id: 1,
        title: '🌱 Tips de Reciclaje',
        content: '¿Sabías que reciclar correctamente puede reducir tu huella de carbono hasta un 50%? 🌍 Aquí te compartimos 5 tips esenciales. #EcoFriendly #Sustainability',
        image: demoEcoProduct1,
        platforms: ['instagram', 'facebook'],
        date: '2025-02-01',
        status: 'Publicado'
      },
      {
        id: 2,
        title: '♻️ Zero Waste Lifestyle',
        content: 'Pequeños cambios, gran impacto. Descubre cómo nuestros productos reutilizables pueden ayudarte a reducir tu huella ambiental 🌿 #ZeroWaste #Sustainable',
        image: demoEcoProduct2,
        platforms: ['instagram', 'facebook', 'twitter'],
        date: '2025-02-05',
        status: 'Programado'
      },
      {
        id: 3,
        title: '🌍 Día Mundial del Medio Ambiente',
        content: 'Únete a nuestro compromiso por un planeta más limpio. Este mes, por cada compra plantamos un árbol 🌳 #WorldEnvironmentDay',
        image: demoEcoProduct1,
        platforms: ['instagram', 'facebook'],
        date: '2025-02-10',
        status: 'Borrador'
      }
    ]
  },
  fitlife: {
    name: 'FitLife Gym',
    industry: 'Fitness',
    logo: demoFitlifeImage,
    description: 'Cadena de gimnasios premium con enfoque en entrenamientos personalizados y bienestar integral.',
    examples: [
      {
        id: 1,
        title: '💪 Día 1 del Reto',
        content: '¡Bienvenidos al Reto 30 Días! 🏋️ Hoy empezamos con una rutina básica de calentamiento. ¿Estás listo para transformarte? #FitnessChallenge #FitLife',
        image: demoFitness1,
        platforms: ['instagram', 'facebook'],
        date: '2025-03-01',
        status: 'Publicado'
      },
      {
        id: 2,
        title: '🥗 Nutrición para el Éxito',
        content: 'La transformación empieza en la cocina. Descubre cómo preparar tus comidas para alcanzar tus objetivos fitness 💪 #HealthyEating #MealPrep',
        image: demoFitness2,
        platforms: ['instagram', 'facebook'],
        date: '2025-03-05',
        status: 'Programado'
      },
      {
        id: 3,
        title: '🏆 Testimonios Reales',
        content: 'María perdió 15kg en 3 meses con nuestro programa personalizado. "El mejor cambio de mi vida" - María G. 💪 #Transformation #Success',
        image: demoFitness1,
        platforms: ['instagram', 'facebook'],
        date: '2025-03-10',
        status: 'Borrador'
      }
    ]
  }
};

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter
};

const ShowcaseBrandDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const brand = slug ? brandData[slug] : null;

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Marca no encontrada</CardTitle>
            <CardDescription>La marca que buscas no existe en nuestro portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/showcase/brands')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Portfolio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    'Publicado': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Programado': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Borrador': 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/showcase/brands')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Portfolio
          </Button>
          
          <div className="flex items-start gap-6">
            <img 
              src={brand.logo} 
              alt={brand.name}
              className="w-24 h-24 rounded-lg object-cover border"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{brand.name}</h1>
                <Badge variant="secondary">{brand.industry}</Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {brand.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Examples */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Ejemplos de Contenido</h2>
          <p className="text-muted-foreground">
            Contenido creado y gestionado para esta marca
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brand.examples.map((example: any) => (
            <Card key={example.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={example.image} 
                  alt={example.title}
                  className="w-full h-full object-cover"
                />
                <Badge 
                  className={`absolute top-3 right-3 ${statusColors[example.status]}`}
                >
                  {example.status}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">
                  {example.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(example.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {example.content}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {example.platforms.map((platform: string) => {
                    const Icon = platformIcons[platform];
                    return (
                      <div 
                        key={platform}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs"
                      >
                        <Icon className="w-3 h-3" />
                        <span className="capitalize">{platform}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseBrandDetailPage;
