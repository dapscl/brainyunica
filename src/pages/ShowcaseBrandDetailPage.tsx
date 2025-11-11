import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Video,
  Image as ImageIcon,
  Layers,
  Megaphone,
  Facebook,
  Instagram,
  Linkedin,
  Target,
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  Users,
  Play
} from 'lucide-react';
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
  },
  ecogreen: {
    name: 'EcoGreen Products',
    industry: 'Sostenibilidad',
    logo: demoEcogreenImage,
    description: 'Marca ecológica comprometida con productos sustentables y educación ambiental para un futuro más verde.',
  },
  fitlife: {
    name: 'FitLife Gym',
    industry: 'Fitness',
    logo: demoFitlifeImage,
    description: 'Cadena de gimnasios premium con enfoque en entrenamientos personalizados y bienestar integral.',
  }
};

const platformIcons: Record<string, any> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
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
            <CardDescription>La marca que buscas no existe en nuestro demo.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/showcase/brands')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calendar data for November 2024 with icons for each day
  const calendarData = [
    { day: 3, icon: <Video className="w-3 h-3" />, type: "video", promoted: true },
    { day: 5, icon: <ImageIcon className="w-3 h-3" />, type: "image", promoted: false },
    { day: 7, icon: <Layers className="w-3 h-3" />, type: "carousel", promoted: true },
    { day: 10, icon: <Video className="w-3 h-3" />, type: "video", promoted: false },
    { day: 12, icon: <ImageIcon className="w-3 h-3" />, type: "image", promoted: true },
    { day: 14, icon: <Layers className="w-3 h-3" />, type: "carousel", promoted: false },
    { day: 17, icon: <Video className="w-3 h-3" />, type: "video", promoted: true },
    { day: 19, icon: <ImageIcon className="w-3 h-3" />, type: "image", promoted: false },
    { day: 21, icon: <Layers className="w-3 h-3" />, type: "carousel", promoted: true },
    { day: 24, icon: <Video className="w-3 h-3" />, type: "video", promoted: false },
    { day: 26, icon: <ImageIcon className="w-3 h-3" />, type: "image", promoted: true },
    { day: 28, icon: <Layers className="w-3 h-3" />, type: "carousel", promoted: false },
  ];

  // Content pieces grid (12 pieces)
  const contentPieces = [
    { 
      id: 1, 
      title: "Campaña de Verano 2024", 
      copy: "☀️ ¡El verano está aquí! Descubre nuestras ofertas exclusivas...", 
      format: "video", 
      promoted: true, 
      platforms: ["facebook", "instagram"], 
      status: "Publicado",
      image: demoTechProduct1
    },
    { 
      id: 2, 
      title: "Lanzamiento de Producto", 
      copy: "🚀 Presentamos nuestra última innovación. Únete al futuro hoy...", 
      format: "image", 
      promoted: false, 
      platforms: ["linkedin"], 
      status: "Programado",
      image: demoTechProduct2
    },
    { 
      id: 3, 
      title: "Historia de Cliente", 
      copy: "💼 Cómo ayudamos a duplicar las ventas en 3 meses...", 
      format: "carousel", 
      promoted: true, 
      platforms: ["facebook", "instagram", "linkedin"], 
      status: "Publicado",
      image: demoEcoProduct1
    },
    { 
      id: 4, 
      title: "Tutorial de Uso", 
      copy: "📚 Aprende a sacarle el máximo provecho en 5 minutos...", 
      format: "video", 
      promoted: false, 
      platforms: ["instagram"], 
      status: "Publicado",
      image: demoEcoProduct2
    },
    { 
      id: 5, 
      title: "Oferta Especial", 
      copy: "🎁 Solo por 48 horas: 40% OFF en toda la tienda...", 
      format: "image", 
      promoted: true, 
      platforms: ["facebook"], 
      status: "Programado",
      image: demoFitness1
    },
    { 
      id: 6, 
      title: "Testimonios", 
      copy: "⭐ Escucha lo que nuestros clientes tienen para decir...", 
      format: "carousel", 
      promoted: false, 
      platforms: ["linkedin"], 
      status: "Publicado",
      image: demoFitness2
    },
    { 
      id: 7, 
      title: "Behind The Scenes", 
      copy: "🎬 Descubre cómo creamos la magia detrás de cámaras...", 
      format: "video", 
      promoted: true, 
      platforms: ["instagram"], 
      status: "Publicado",
      image: demoTechProduct1
    },
    { 
      id: 8, 
      title: "Infografía", 
      copy: "📊 5 datos que debes saber sobre la industria en 2024...", 
      format: "image", 
      promoted: false, 
      platforms: ["linkedin"], 
      status: "Publicado",
      image: demoTechProduct2
    },
    { 
      id: 9, 
      title: "Colección Nueva", 
      copy: "✨ Presentamos nuestra colección de primavera exclusiva...", 
      format: "carousel", 
      promoted: true, 
      platforms: ["facebook", "instagram"], 
      status: "Programado",
      image: demoEcoProduct1
    },
    { 
      id: 10, 
      title: "Demo de Producto", 
      copy: "🎥 Mira cómo funciona en tiempo real con nuestro demo...", 
      format: "video", 
      promoted: false, 
      platforms: ["facebook"], 
      status: "Publicado",
      image: demoEcoProduct2
    },
    { 
      id: 11, 
      title: "Promoción Flash", 
      copy: "⚡ Flash Sale: Solo las próximas 3 horas. No te lo pierdas...", 
      format: "image", 
      promoted: true, 
      platforms: ["facebook", "instagram"], 
      status: "Programado",
      image: demoFitness1
    },
    { 
      id: 12, 
      title: "Case Study", 
      copy: "📈 Estudio de caso completo: De 0 a 100K en 6 meses...", 
      format: "carousel", 
      promoted: false, 
      platforms: ["linkedin"], 
      status: "Publicado",
      image: demoFitness2
    },
  ];

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "video": return <Video className="w-4 h-4" />;
      case "image": return <ImageIcon className="w-4 h-4" />;
      case "carousel": return <Layers className="w-4 h-4" />;
      default: return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    const Icon = platformIcons[platform];
    return Icon ? <Icon className="w-3 h-3" /> : null;
  };

  // Media Ads data
  const adsChannels = [
    { name: "Meta Ads", icon: <Facebook className="w-4 h-4" />, active: true, color: "bg-blue-600" },
    { name: "LinkedIn Ads", icon: <Linkedin className="w-4 h-4" />, active: true, color: "bg-blue-700" },
    { name: "Google Ads", icon: <Target className="w-4 h-4" />, active: false, color: "bg-gray-400" },
  ];

  const adsCampaigns = [
    {
      name: "Campaña Verano Premium 2024",
      status: "Activa",
      budget: "$1,500",
      spent: "$1,247",
      impressions: "45.2K",
      reach: "32.1K",
      clicks: "3,421",
      ctr: "7.56%",
      conversions: "287",
      cpc: "$0.36",
      roas: "4.2x",
      channel: "Meta Ads",
      channelIcon: <Facebook className="w-4 h-4 text-blue-600" />
    },
    {
      name: "Lanzamiento Producto Q4",
      status: "Activa",
      budget: "$2,000",
      spent: "$1,856",
      impressions: "67.8K",
      reach: "51.2K",
      clicks: "5,234",
      ctr: "7.72%",
      conversions: "412",
      cpc: "$0.35",
      roas: "5.1x",
      channel: "Meta Ads",
      channelIcon: <Facebook className="w-4 h-4 text-blue-600" />
    },
    {
      name: "Retargeting Profesional B2B",
      status: "Activa",
      budget: "$800",
      spent: "$654",
      impressions: "28.3K",
      reach: "19.7K",
      clicks: "2,145",
      ctr: "7.58%",
      conversions: "156",
      cpc: "$0.30",
      roas: "3.8x",
      channel: "LinkedIn Ads",
      channelIcon: <Linkedin className="w-4 h-4 text-blue-700" />
    },
  ];

  const statusColors: Record<string, string> = {
    'Publicado': 'bg-green-500/10 text-green-600 border-green-500/20',
    'Programado': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Borrador': 'bg-gray-500/10 text-gray-600 border-gray-500/20'
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
            Volver al Demo
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

      {/* Content */}
      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Calendario Mensual */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Calendario de Publicaciones - Noviembre 2024</h2>
            <p className="text-muted-foreground">
              Vista mensual completa con todas las piezas programadas, publicadas y en borrador
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-3">
                    {day}
                  </div>
                ))}
                
                {/* Empty cells for first week offset (November 2024 starts on Friday) */}
                {[...Array(5)].map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px]"></div>
                ))}
                
                {/* November days */}
                {[...Array(30)].map((_, i) => {
                  const day = i + 1;
                  const contentForDay = calendarData.find(c => c.day === day);
                  return (
                    <div 
                      key={day} 
                      className={`relative p-3 border rounded-lg min-h-[100px] transition-all hover:shadow-sm ${
                        contentForDay ? 'bg-primary/5 border-primary/30 hover:border-primary/50' : 'bg-muted/20 hover:bg-muted/30'
                      }`}
                    >
                      <div className="text-sm font-semibold mb-2 text-foreground">{day}</div>
                      {contentForDay && (
                        <div className="flex flex-col items-center justify-center gap-2 mt-2">
                          <div className="text-primary p-2 bg-primary/10 rounded-md">
                            {contentForDay.icon}
                          </div>
                          {contentForDay.promoted && (
                            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded">
                              <Megaphone className="w-3 h-3 text-orange-600" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Video className="w-4 h-4 text-primary" />
                  <span>Video</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  <span>Imagen</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-primary" />
                  <span>Carrusel</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Megaphone className="w-4 h-4 text-orange-600" />
                  <span>Promocionado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Grilla de Piezas de Contenido */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Biblioteca de Contenido del Mes</h2>
            <p className="text-muted-foreground">
              12 piezas creadas y programadas para diversas plataformas sociales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {contentPieces.map((piece) => (
              <Card key={piece.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={piece.image} 
                    alt={piece.title}
                    className="w-full h-full object-cover"
                  />
                  {piece.promoted && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg">
                      <Megaphone className="w-3 h-3" />
                      Promocionado
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {getFormatIcon(piece.format)}
                      <span className="text-xs font-medium capitalize">{piece.format}</span>
                    </div>
                    <Badge variant="outline" className={statusColors[piece.status]}>
                      {piece.status}
                    </Badge>
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-2 line-clamp-1">{piece.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{piece.copy}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {piece.platforms.map((platform) => (
                      <div 
                        key={platform} 
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {getPlatformIcon(platform)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Panel de Media Ads */}
        <section>
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Panel de Inversión Publicitaria</h2>
                <p className="text-muted-foreground">
                  Monitoreo en tiempo real de campañas en múltiples canales
                </p>
              </div>
              <div className="flex gap-2">
                {adsChannels.map((channel, index) => (
                  <Badge 
                    key={index} 
                    variant={channel.active ? "default" : "outline"}
                    className="flex items-center gap-2 px-3 py-1.5"
                  >
                    {channel.icon}
                    <span>{channel.name}</span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Métricas Generales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Inversión Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$4,300</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gastado: $3,757 <span className="text-green-600">(87.4%)</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Impresiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">141.3K</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5% vs mes anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Alcance Único
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">103K</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.3% vs mes anterior
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4" />
                  Conversiones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">855</div>
                <p className="text-xs text-green-600 mt-1">
                  ROI: <span className="font-semibold">4.2x</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Campañas Detalladas */}
          <Card>
            <CardHeader>
              <CardTitle>Campañas Activas en Tiempo Real</CardTitle>
              <CardDescription>
                Métricas detalladas de rendimiento por campaña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adsCampaigns.map((campaign, index) => (
                  <div key={index} className="p-5 border rounded-lg space-y-4 hover:shadow-md transition-all hover:border-primary/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg">{campaign.name}</h4>
                          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {campaign.channelIcon}
                          <span className="text-sm text-muted-foreground">{campaign.channel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          Presupuesto
                        </p>
                        <p className="font-semibold text-lg">{campaign.budget}</p>
                        <p className="text-xs text-muted-foreground">
                          Gastado: <span className="font-medium">{campaign.spent}</span>
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Impresiones
                        </p>
                        <p className="font-semibold text-lg">{campaign.impressions}</p>
                        <p className="text-xs text-muted-foreground">
                          Alcance: <span className="font-medium">{campaign.reach}</span>
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MousePointerClick className="w-3 h-3" />
                          Clics
                        </p>
                        <p className="font-semibold text-lg">{campaign.clicks}</p>
                        <p className="text-xs text-muted-foreground">
                          CTR: <span className="font-medium text-green-600">{campaign.ctr}</span>
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          Conversiones
                        </p>
                        <p className="font-semibold text-lg">{campaign.conversions}</p>
                        <p className="text-xs text-muted-foreground">
                          CPC: <span className="font-medium">{campaign.cpc}</span>
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          ROAS
                        </p>
                        <p className="font-semibold text-lg text-green-600">{campaign.roas}</p>
                        <p className="text-xs text-green-600 font-medium">
                          Excelente
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ShowcaseBrandDetailPage;
