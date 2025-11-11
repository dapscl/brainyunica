import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Facebook, Instagram, Linkedin, Twitter, CheckCircle2, Clock, XCircle, AlertCircle, TrendingUp, Users, Eye, DollarSign, MousePointerClick, BarChart3 } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useState } from 'react';
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
        time: '10:00',
        status: 'Publicado',
        approvals: [
          { reviewer: 'Ana García', role: 'Content Manager', status: 'approved', comment: 'Excelente trabajo, listo para publicar' },
          { reviewer: 'Carlos Ruiz', role: 'Brand Manager', status: 'approved', comment: 'Aprobado ✓' }
        ]
      },
      {
        id: 2,
        title: '💻 Nuevo Workspace Digital',
        content: 'Transforma tu espacio de trabajo con nuestras herramientas de última generación. Productividad al máximo nivel 🚀 #WorkSmart #TechTools',
        image: demoTechProduct2,
        platforms: ['linkedin', 'twitter'],
        date: '2025-01-20',
        time: '14:30',
        status: 'Programado',
        approvals: [
          { reviewer: 'Ana García', role: 'Content Manager', status: 'approved', comment: 'Programado para publicación' },
          { reviewer: 'Carlos Ruiz', role: 'Brand Manager', status: 'pending', comment: null }
        ]
      },
      {
        id: 3,
        title: '🎯 Caso de Éxito: Automatización',
        content: 'Cómo ayudamos a una empresa a reducir costos en un 40% mediante automatización inteligente. Lee el caso completo 👇',
        image: demoTechProduct1,
        platforms: ['linkedin'],
        date: '2025-01-25',
        time: '09:00',
        status: 'Borrador',
        approvals: [
          { reviewer: 'Ana García', role: 'Content Manager', status: 'changes_requested', comment: 'Por favor agregar más métricas específicas' },
          { reviewer: 'Carlos Ruiz', role: 'Brand Manager', status: 'pending', comment: null }
        ]
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
        time: '11:00',
        status: 'Publicado',
        approvals: [
          { reviewer: 'Laura Martín', role: 'Sustainability Lead', status: 'approved', comment: 'Mensaje alineado con nuestros valores' },
          { reviewer: 'Pedro López', role: 'Social Media Manager', status: 'approved', comment: 'Perfecto para Instagram' }
        ]
      },
      {
        id: 2,
        title: '♻️ Zero Waste Lifestyle',
        content: 'Pequeños cambios, gran impacto. Descubre cómo nuestros productos reutilizables pueden ayudarte a reducir tu huella ambiental 🌿 #ZeroWaste #Sustainable',
        image: demoEcoProduct2,
        platforms: ['instagram', 'facebook', 'twitter'],
        date: '2025-02-05',
        time: '16:00',
        status: 'Programado',
        approvals: [
          { reviewer: 'Laura Martín', role: 'Sustainability Lead', status: 'approved', comment: 'Excelente enfoque' },
          { reviewer: 'Pedro López', role: 'Social Media Manager', status: 'approved', comment: 'Listo para programar' }
        ]
      },
      {
        id: 3,
        title: '🌍 Día Mundial del Medio Ambiente',
        content: 'Únete a nuestro compromiso por un planeta más limpio. Este mes, por cada compra plantamos un árbol 🌳 #WorldEnvironmentDay',
        image: demoEcoProduct1,
        platforms: ['instagram', 'facebook'],
        date: '2025-02-10',
        time: '12:00',
        status: 'Borrador',
        approvals: [
          { reviewer: 'Laura Martín', role: 'Sustainability Lead', status: 'pending', comment: null },
          { reviewer: 'Pedro López', role: 'Social Media Manager', status: 'pending', comment: null }
        ]
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
        time: '07:00',
        status: 'Publicado',
        approvals: [
          { reviewer: 'María Torres', role: 'Fitness Director', status: 'approved', comment: 'Motivador y claro' },
          { reviewer: 'Juan Pérez', role: 'Marketing Manager', status: 'approved', comment: 'Perfecto timing para el reto' }
        ]
      },
      {
        id: 2,
        title: '🥗 Nutrición para el Éxito',
        content: 'La transformación empieza en la cocina. Descubre cómo preparar tus comidas para alcanzar tus objetivos fitness 💪 #HealthyEating #MealPrep',
        image: demoFitness2,
        platforms: ['instagram', 'facebook'],
        date: '2025-03-05',
        time: '13:00',
        status: 'Programado',
        approvals: [
          { reviewer: 'María Torres', role: 'Fitness Director', status: 'approved', comment: 'Información nutricional validada' },
          { reviewer: 'Juan Pérez', role: 'Marketing Manager', status: 'approved', comment: 'Aprobado para publicación' }
        ]
      },
      {
        id: 3,
        title: '🏆 Testimonios Reales',
        content: 'María perdió 15kg en 3 meses con nuestro programa personalizado. "El mejor cambio de mi vida" - María G. 💪 #Transformation #Success',
        image: demoFitness1,
        platforms: ['instagram', 'facebook'],
        date: '2025-03-10',
        time: '18:00',
        status: 'Borrador',
        approvals: [
          { reviewer: 'María Torres', role: 'Fitness Director', status: 'approved', comment: 'Testimonio verificado' },
          { reviewer: 'Juan Pérez', role: 'Marketing Manager', status: 'changes_requested', comment: 'Necesitamos el consentimiento escrito de la cliente' }
        ]
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 0, 15));
  
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

  const getApprovalIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'changes_requested':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getApprovalText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'changes_requested':
        return 'Cambios solicitados';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
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

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="workflow" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="workflow">Workflow de Aprobación</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="ads">Media Ads</TabsTrigger>
            <TabsTrigger value="reporting">Reporting</TabsTrigger>
          </TabsList>

          {/* Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Workflow de Aprobación</h2>
              <p className="text-muted-foreground">
                Sistema de revisión y aprobación multi-nivel para control de calidad del contenido
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
                      <span className="text-muted-foreground">•</span>
                      <Clock className="w-4 h-4" />
                      {example.time}
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

                    {/* Approval Workflow */}
                    <div className="space-y-2 pt-2 border-t">
                      <h4 className="text-xs font-semibold text-muted-foreground">Workflow de Aprobación</h4>
                      {example.approvals.map((approval: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <Avatar className="w-6 h-6 mt-0.5">
                            <AvatarFallback className="text-[10px]">
                              {approval.reviewer.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium truncate">{approval.reviewer}</span>
                              {getApprovalIcon(approval.status)}
                            </div>
                            <p className="text-muted-foreground text-[10px]">{approval.role}</p>
                            {approval.comment && (
                              <p className="text-muted-foreground mt-1 text-[11px] italic">
                                "{approval.comment}"
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className="text-[10px] shrink-0"
                          >
                            {getApprovalText(approval.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Calendario de Contenido</h2>
              <p className="text-muted-foreground">
                Visualiza y gestiona tu contenido programado, publicado y en borrador
              </p>
            </div>

            <div className="grid md:grid-cols-[300px_1fr] gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Enero 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Publicado</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Programado</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                      <span>Borrador</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {brand.examples.map((example: any) => (
                  <Card key={example.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img 
                          src={example.image} 
                          alt={example.title}
                          className="w-20 h-20 rounded object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{example.title}</h3>
                            <Badge className={statusColors[example.status]}>
                              {example.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {example.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(example.date).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {example.time}
                            </div>
                            <div className="flex gap-1">
                              {example.platforms.map((platform: string) => {
                                const Icon = platformIcons[platform];
                                return <Icon key={platform} className="w-3 h-3" />;
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Media Ads Tab */}
          <TabsContent value="ads" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Panel de Media Ads</h2>
              <p className="text-muted-foreground">
                Monitorea el rendimiento de tus campañas publicitarias en Meta, Google y otras plataformas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inversión Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">$182,909</span>
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Impresiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">489,982</span>
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Alcance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">208,353</span>
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Resultados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">13,864</span>
                    <MousePointerClick className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campañas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Campaña de Lanzamiento', results: 32, cost: '$49,420', impressions: 46084, reach: 38446, status: 'Activo' },
                    { name: 'Reels - Contenido Social', results: 57, cost: '$28,108', impressions: 27566, reach: 16873, status: 'Activo' },
                    { name: 'Remarketing - Conversiones', results: 409, cost: '$225,498', impressions: 403622, reach: 160165, status: 'Activo' },
                    { name: 'Awareness - Marca', results: 12226, cost: '$182,909', impressions: 489982, reach: 208353, status: 'Activo' },
                  ].map((campaign, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{campaign.name}</h4>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{campaign.results} Resultados</span>
                          <span>•</span>
                          <span>{campaign.impressions.toLocaleString()} Impresiones</span>
                          <span>•</span>
                          <span>{campaign.reach.toLocaleString()} Alcance</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{campaign.cost}</div>
                        <Badge variant="outline" className="mt-1">{campaign.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reporting Tab */}
          <TabsContent value="reporting" className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Panel de Reporting</h2>
              <p className="text-muted-foreground">
                Analiza el rendimiento de tu contenido y campañas con métricas detalladas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">8.4%</span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-xs text-green-500 mt-1">+2.3% vs mes anterior</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Contenido Publicado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">24</span>
                    <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">En este mes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">ROI Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">3.2x</span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-xs text-green-500 mt-1">+0.8x vs mes anterior</p>
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
                      { platform: 'Instagram', posts: 8, engagement: '12.4%', reach: 45200, icon: Instagram },
                      { platform: 'Facebook', posts: 6, engagement: '6.8%', reach: 32100, icon: Facebook },
                      { platform: 'LinkedIn', posts: 5, engagement: '5.2%', reach: 18900, icon: Linkedin },
                      { platform: 'Twitter', posts: 5, engagement: '4.1%', reach: 15600, icon: Twitter },
                    ].map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex items-center gap-4">
                          <Icon className="w-5 h-5 text-muted-foreground" />
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
                  <div className="space-y-4">
                    {brand.examples.slice(0, 3).map((example: any, idx: number) => (
                      <div key={idx} className="flex gap-3">
                        <img 
                          src={example.image} 
                          alt={example.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{example.title}</h4>
                          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                            <span>2.4k likes</span>
                            <span>•</span>
                            <span>180 comments</span>
                            <span>•</span>
                            <span>45 shares</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShowcaseBrandDetailPage;
