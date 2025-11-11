import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseBreadcrumbs } from '@/components/showcase/ShowcaseBreadcrumbs';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { useTranslation } from 'react-i18next';
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
  Play,
  CheckCircle2,
  Clock,
  MessageSquare,
  Bot,
  Zap
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
import AIMediaBuyerPanel from '@/components/showcase/AIMediaBuyerPanel';
import CreativePerformanceTracker from '@/components/showcase/CreativePerformanceTracker';
import MultiChannelCommunication from '@/components/showcase/MultiChannelCommunication';

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
  const { t } = useTranslation();
  
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
            <Button onClick={() => navigate('/brands')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calendar data for November 2024
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

  // Content pieces
  const contentPieces = [
    { id: 1, title: "Campaña de Verano 2024", copy: "☀️ ¡El verano está aquí! Descubre nuestras ofertas exclusivas...", format: "video", promoted: true, platforms: ["facebook", "instagram"], status: "Publicado", image: demoTechProduct1 },
    { id: 2, title: "Lanzamiento de Producto", copy: "🚀 Presentamos nuestra última innovación. Únete al futuro hoy...", format: "image", promoted: false, platforms: ["linkedin"], status: "Programado", image: demoTechProduct2 },
    { id: 3, title: "Historia de Cliente", copy: "💼 Cómo ayudamos a duplicar las ventas en 3 meses...", format: "carousel", promoted: true, platforms: ["facebook", "instagram", "linkedin"], status: "Publicado", image: demoEcoProduct1 },
    { id: 4, title: "Tutorial de Uso", copy: "📚 Aprende a sacarle el máximo provecho en 5 minutos...", format: "video", promoted: false, platforms: ["instagram"], status: "Publicado", image: demoEcoProduct2 },
    { id: 5, title: "Oferta Especial", copy: "🎁 Solo por 48 horas: 40% OFF en toda la tienda...", format: "image", promoted: true, platforms: ["facebook"], status: "Programado", image: demoFitness1 },
    { id: 6, title: "Testimonios", copy: "⭐ Escucha lo que nuestros clientes tienen para decir...", format: "carousel", promoted: false, platforms: ["linkedin"], status: "Publicado", image: demoFitness2 },
    { id: 7, title: "Behind The Scenes", copy: "🎬 Descubre cómo creamos la magia detrás de cámaras...", format: "video", promoted: true, platforms: ["instagram"], status: "Publicado", image: demoTechProduct1 },
    { id: 8, title: "Infografía", copy: "📊 5 datos que debes saber sobre la industria en 2024...", format: "image", promoted: false, platforms: ["linkedin"], status: "Publicado", image: demoTechProduct2 },
    { id: 9, title: "Colección Nueva", copy: "✨ Presentamos nuestra colección de primavera exclusiva...", format: "carousel", promoted: true, platforms: ["facebook", "instagram"], status: "Programado", image: demoEcoProduct1 },
    { id: 10, title: "Demo de Producto", copy: "🎥 Mira cómo funciona en tiempo real con nuestro demo...", format: "video", promoted: false, platforms: ["facebook"], status: "Publicado", image: demoEcoProduct2 },
    { id: 11, title: "Promoción Flash", copy: "⚡ Flash Sale: Solo las próximas 3 horas. No te lo pierdas...", format: "image", promoted: true, platforms: ["facebook", "instagram"], status: "Programado", image: demoFitness1 },
    { id: 12, title: "Case Study", copy: "📈 Estudio de caso completo: De 0 a 100K en 6 meses...", format: "carousel", promoted: false, platforms: ["linkedin"], status: "Publicado", image: demoFitness2 },
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

  // Ads data
  const adsChannels = [
    { name: "Meta Ads", icon: <Facebook className="w-4 h-4" />, active: true },
    { name: "LinkedIn Ads", icon: <Linkedin className="w-4 h-4" />, active: true },
    { name: "Google Ads", icon: <Target className="w-4 h-4" />, active: false },
  ];

  const adsCampaigns = [
    { name: "Campaña Verano Premium 2024", status: "Activa", budget: "$1,500", spent: "$1,247", impressions: "45.2K", reach: "32.1K", clicks: "3,421", ctr: "7.56%", conversions: "287", cpc: "$0.36", roas: "4.2x", channel: "Meta Ads", channelIcon: <Facebook className="w-4 h-4 text-blue-600" /> },
    { name: "Lanzamiento Producto Q4", status: "Activa", budget: "$2,000", spent: "$1,856", impressions: "67.8K", reach: "51.2K", clicks: "5,234", ctr: "7.72%", conversions: "412", cpc: "$0.35", roas: "5.1x", channel: "Meta Ads", channelIcon: <Facebook className="w-4 h-4 text-blue-600" /> },
    { name: "Retargeting Profesional B2B", status: "Activa", budget: "$800", spent: "$654", impressions: "28.3K", reach: "19.7K", clicks: "2,145", ctr: "7.58%", conversions: "156", cpc: "$0.30", roas: "3.8x", channel: "LinkedIn Ads", channelIcon: <Linkedin className="w-4 h-4 text-blue-700" /> },
  ];

  // Monday tasks
  const mondayTasks = [
    { id: 1, title: "Diseño de campaña Q1", assignee: "María G.", status: "En progreso", priority: "Alta", dueDate: "15 Nov" },
    { id: 2, title: "Revisión de copy publicitario", assignee: "Carlos R.", status: "Completada", priority: "Media", dueDate: "12 Nov" },
    { id: 3, title: "Producción de video reels", assignee: "Ana M.", status: "Por hacer", priority: "Alta", dueDate: "18 Nov" },
    { id: 4, title: "Análisis de métricas mensuales", assignee: "Pedro L.", status: "En progreso", priority: "Media", dueDate: "20 Nov" },
  ];

  // Manychat responses
  const chatResponses = [
    { id: 1, platform: "Facebook Messenger", user: "Juan Pérez", message: "¿Tienen envío gratis?", response: "¡Sí! Envío gratis en compras mayores a $50", time: "Hace 2 min", status: "Respondido" },
    { id: 2, platform: "Instagram DM", user: "María López", message: "Horarios de atención", response: "Estamos disponibles de lunes a viernes, 9am-6pm", time: "Hace 5 min", status: "Respondido" },
    { id: 3, platform: "Facebook Messenger", user: "Carlos Ruiz", message: "Precio del producto X", response: "Buscando información...", time: "Hace 1 min", status: "Procesando" },
    { id: 4, platform: "Instagram DM", user: "Laura Torres", message: "¿Hacen descuentos?", response: "¡Sí! Actualmente tenemos 20% OFF en toda la tienda", time: "Hace 8 min", status: "Respondido" },
  ];

  const statusColors: Record<string, string> = {
    'Publicado': 'bg-green-500/10 text-green-600 border-green-500/20',
    'Programado': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Borrador': 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  };

  return (
    <div className="min-h-screen bg-background dark">
      <ShowcaseSEO
        title={`${brand.name} - ${t('showcase.brandDetail.title', 'Brand Detail')}`}
        description={brand.description}
        path={`/brands/${slug}`}
      />
      <ShowcaseHeader />
      
      <div className="container mx-auto px-4 py-6">
        <ShowcaseBreadcrumbs />
      </div>

      {/* Brand Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(`/brands/${slug}/setup`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Setup
            </Button>
            <div className="text-sm text-muted-foreground">
              Setup → <span className="text-foreground font-medium">Workflow</span>
            </div>
          </div>
          
          <div className="flex items-start gap-8">
            <img 
              src={brand.logo} 
              alt={brand.name}
              className="w-32 h-32 rounded-2xl object-cover border-2 border-electric-cyan/30 shadow-glow-cyan"
            />
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight">{brand.name}</h1>
                <Badge variant="outline" className="border-electric-cyan/30 text-electric-cyan bg-electric-cyan/10 text-base px-4 py-1">{brand.industry}</Badge>
              </div>
              <p className="text-muted-foreground text-lg font-light max-w-3xl leading-relaxed">
                {brand.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 space-y-20">
        {/* Monday - Gestión de Tareas */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow">
                M
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Gestión de Proyectos</h2>
                <p className="text-muted-foreground font-light text-lg">
                  Tareas, asignaciones y seguimiento de equipo en tiempo real
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-card/30 backdrop-blur-sm border-purple-accent/20">
            <CardContent className="p-8">
              <div className="space-y-3">
                {mondayTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === "Completada" ? "bg-green-500" :
                      task.status === "En progreso" ? "bg-blue-500" : "bg-gray-400"
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{task.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>👤 {task.assignee}</span>
                        <span>📅 {task.dueDate}</span>
                      </div>
                    </div>
                    <Badge variant={task.priority === "Alta" ? "destructive" : "secondary"} className="text-xs">
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {task.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Calendario Mensual */}
        <section>
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-glow">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight">Calendario de Publicaciones</h2>
                <p className="text-muted-foreground font-light text-lg">
                  Vista mensual completa con todas las piezas programadas
                </p>
              </div>
            </div>
          </div>

          <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-7 gap-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-3">
                    {day}
                  </div>
                ))}
                {[...Array(5)].map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px]"></div>
                ))}
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

        {/* Grilla de Contenido */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Biblioteca de Contenido del Mes</h2>
              <p className="text-muted-foreground">
                12 piezas creadas y programadas para diversas plataformas
              </p>
            </div>
            <Button size="lg" onClick={() => navigate(`/brands/${slug}/create-content`)}>
              Crear Nuevo Contenido
            </Button>
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

        {/* AI Media Buyer */}
        <section className="mb-16">
          <AIMediaBuyerPanel />
        </section>

        {/* Creative Performance Tracker */}
        <section className="mb-16">
          <CreativePerformanceTracker />
        </section>

        {/* Multi-Channel Communication */}
        <section className="mb-16">
          <MultiChannelCommunication />
        </section>

        {/* Respuestas Automáticas */}
        <section>
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Chat de Respuestas Automáticas</h2>
                  <p className="text-muted-foreground">
                    Monitoreo en tiempo real de mensajes y respuestas automatizadas
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate(`/brands/${slug}/chat-automation`)}>
                Ver Sistema Completo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Estadísticas de Respuesta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Tasa de Respuesta</span>
                    <span className="text-2xl font-bold text-green-600">94%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Tiempo Promedio</span>
                    <span className="text-2xl font-bold">1.8 min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Mensajes Hoy</span>
                    <span className="text-2xl font-bold">127</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Captura de Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Leads Capturados</span>
                    <span className="text-2xl font-bold">1,243</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Tasa de Conversión</span>
                    <span className="text-2xl font-bold text-green-600">34%</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => navigate(`/brands/${slug}/lead-capture`)}
                  >
                    Ver Sistema de Leads
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {chatResponses.map((chat) => (
                    <div key={chat.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold">
                            {chat.user.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{chat.user}</p>
                            <p className="text-xs text-muted-foreground">{chat.platform}</p>
                          </div>
                        </div>
                        <Badge variant={chat.status === "Respondido" ? "default" : "secondary"} className="text-xs">
                          {chat.status}
                        </Badge>
                      </div>
                      <div className="pl-10 space-y-1">
                        <p className="text-xs bg-muted/50 p-2 rounded">💬 {chat.message}</p>
                        <p className="text-xs bg-primary/10 p-2 rounded">🤖 {chat.response}</p>
                        <p className="text-xs text-muted-foreground">{chat.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Panel de Media Ads */}
        <section>
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Panel de Inversión Publicitaria</h2>
                  <p className="text-muted-foreground">
                    Monitoreo en tiempo real de campañas
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
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
                <Button size="lg" onClick={() => navigate(`/brands/${slug}/create-campaign`)}>
                  Crear Nueva Campaña
                </Button>
              </div>
            </div>
          </div>

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

        {/* AI Video Generator (Creatify) */}
        <section>
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Generador de Video con IA</h2>
                  <p className="text-muted-foreground">
                    Convierte URLs en videos profesionales con avatares AI en minutos
                  </p>
                </div>
              </div>
              <Button size="lg" onClick={() => navigate(`/brands/${slug}/video-generator`)}>
                Abrir Generador de Video
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-purple-500" />
                  Videos Generados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Este Mes</span>
                    <span className="text-2xl font-bold text-purple-600">24</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Tiempo Ahorrado</span>
                    <span className="text-2xl font-bold">18h</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium">Engagement Promedio</span>
                    <span className="text-2xl font-bold text-green-600">9.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Testing Automático
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Crea variantes automáticas de tus videos para A/B testing y optimización de rendimiento
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Variantes creadas</span>
                    <span className="font-semibold">48</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tests A/B activos</span>
                    <span className="font-semibold">6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  Avatares AI Disponibles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Emma', 'Marcus', 'Sofia', 'David'].map((avatar) => (
                    <div key={avatar} className="flex items-center gap-3 p-2 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                        {avatar[0]}
                      </div>
                      <span className="text-sm font-medium">{avatar}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inspiration Library */}
        <section>
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Biblioteca de Inspiración</h2>
                  <p className="text-muted-foreground">
                    Ads ganadores de la industria con análisis detallado de rendimiento
                  </p>
                </div>
              </div>
              <Button size="lg" onClick={() => navigate(`/brands/${slug}/inspiration`)}>
                Explorar Biblioteca
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { metric: 'Ads Analizados', value: '847', icon: Eye },
              { metric: 'Mejor CTR', value: '14.8%', icon: MousePointerClick },
              { metric: 'Mejor ROI', value: '8.3x', icon: TrendingUp },
              { metric: 'Industrias', value: '24', icon: Target }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {stat.metric}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 3 Ads de Alto Rendimiento</CardTitle>
              <CardDescription>Creatividades destacadas de este mes con métricas excepcionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'SaaS Product Launch', platform: 'LinkedIn', ctr: '8.5%', roi: '5.2x', views: '2.4M' },
                  { title: 'Fitness Challenge', platform: 'Instagram', ctr: '9.1%', roi: '4.8x', views: '1.8M' },
                  { title: 'Eco Product Showcase', platform: 'Facebook', ctr: '7.2%', roi: '3.9x', views: '980K' }
                ].map((ad, idx) => (
                  <div key={idx} className="border rounded-lg p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold mb-1">{ad.title}</h4>
                      <Badge variant="outline">{ad.platform}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-semibold text-green-600">{ad.ctr}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">ROI</p>
                        <p className="font-semibold text-green-600">{ad.roi}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Views</p>
                        <p className="font-semibold">{ad.views}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Reporting en Tiempo Real */}
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Reporting en Tiempo Real</h2>
                <p className="text-muted-foreground">
                  KPIs actualizados al instante con métricas de rendimiento
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">8.4%</span>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  +2.3% vs mes anterior
                </p>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '84%' }} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Contenido Publicado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">24</span>
                  <Clock className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground">
                  En este mes
                </p>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '80%' }} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">ROI Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl font-bold">3.2x</span>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  +0.8x vs mes anterior
                </p>
                <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '90%' }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { platform: 'Instagram', posts: 8, engagement: '12.4%', reach: 45200, icon: Instagram, color: 'text-pink-500' },
                    { platform: 'Facebook', posts: 6, engagement: '6.8%', reach: 32100, icon: Facebook, color: 'text-blue-600' },
                    { platform: 'LinkedIn', posts: 5, engagement: '5.2%', reach: 18900, icon: Linkedin, color: 'text-blue-700' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                        <Icon className={`w-6 h-6 ${item.color}`} />
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{item.platform}</span>
                            <span className="text-sm text-muted-foreground">{item.posts} posts</span>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{item.engagement} engagement</span>
                            <span>•</span>
                            <span>{item.reach.toLocaleString()} alcance</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contenido Mejor Performante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentPieces.slice(0, 3).map((piece, idx) => (
                    <div key={idx} className="flex gap-3 p-3 border rounded-lg">
                      <img 
                        src={piece.image} 
                        alt={piece.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{piece.title}</h4>
                        <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                          <span>2.4k likes</span>
                          <span>•</span>
                          <span>180 comments</span>
                          <span>•</span>
                          <span>45 shares</span>
                        </div>
                        <div className="mt-2 flex gap-1">
                          {piece.platforms.map((platform) => (
                            <div key={platform} className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShowcaseBrandDetailPage;
