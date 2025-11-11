import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight,
  Upload,
  CreditCard,
  MessageSquare,
  BarChart3,
  FileText,
  CheckCircle2,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube
} from 'lucide-react';
import demoTechstartImage from '@/assets/demo-techstart.jpg';
import demoEcogreenImage from '@/assets/demo-ecogreen.jpg';
import demoFitlifeImage from '@/assets/demo-fitlife.jpg';

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

const ShowcaseBrandSetupPage = () => {
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

  const setupSteps = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Información de Marca",
      description: "Logo, colores corporativos y guía de estilo visual",
      status: "completed",
      details: [
        { label: "Logo Principal", value: "Subido (PNG, 2000x2000px)" },
        { label: "Colores", value: "#2563EB, #1E40AF, #FFFFFF" },
        { label: "Tipografía", value: "Inter, SF Pro" }
      ]
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      title: "Canales Digitales",
      description: "Conecta tus redes sociales y plataformas de publicación",
      status: "completed",
      details: [
        { label: "Facebook", value: "Conectado - @techstartsolutions", connected: true },
        { label: "Instagram", value: "Conectado - @techstart", connected: true },
        { label: "LinkedIn", value: "Conectado - TechStart Solutions", connected: true },
        { label: "Twitter", value: "Conectado - @techstart", connected: true },
        { label: "YouTube", value: "No conectado", connected: false }
      ]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Chat de Respuestas Automáticas",
      description: "Configura chatbot y respuestas automáticas estilo Manychat",
      status: "completed",
      details: [
        { label: "Facebook Messenger", value: "Activo - 89% tasa de respuesta" },
        { label: "Instagram DM", value: "Activo - Respuesta en <2 min" },
        { label: "Respuestas Predefinidas", value: "24 plantillas configuradas" },
        { label: "Palabras Clave", value: "18 triggers activos" }
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Integración de Pagos",
      description: "Tarjeta de crédito para campañas publicitarias",
      status: "completed",
      details: [
        { label: "Método de Pago", value: "Visa •••• 4242" },
        { label: "Presupuesto Mensual", value: "$5,000 USD" },
        { label: "Límite de Gastos", value: "$500 por campaña" },
        { label: "Facturación", value: "Automática al final del mes" }
      ]
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Métricas Clave",
      description: "KPIs y objetivos de seguimiento",
      status: "completed",
      details: [
        { label: "Engagement Rate", value: "Meta: >5%" },
        { label: "Reach Mensual", value: "Meta: 100K+" },
        { label: "Conversiones", value: "Meta: 500+ leads/mes" },
        { label: "ROI Publicitario", value: "Meta: 3.5x ROAS" }
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Documentos y Guidelines",
      description: "Manual de marca, lineamientos y documentación",
      status: "completed",
      details: [
        { label: "Brand Guidelines.pdf", value: "2.4 MB - Subido" },
        { label: "Tone of Voice.docx", value: "890 KB - Subido" },
        { label: "Content Calendar Q1.xlsx", value: "1.2 MB - Subido" },
        { label: "Social Media Policy.pdf", value: "650 KB - Subido" }
      ]
    }
  ];

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
            Volver a Marcas
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
                <Badge className="bg-green-500">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Setup Completo
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                {brand.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Configuración de Marca</h2>
          <p className="text-muted-foreground">
            Todos los elementos necesarios para gestionar esta marca en la plataforma
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {setupSteps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completado
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {step.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">{detail.label}</p>
                        <p className="text-xs text-muted-foreground">{detail.value}</p>
                      </div>
                      {'connected' in detail && (
                        <Badge variant={detail.connected ? "default" : "outline"} className="text-xs">
                          {detail.connected ? "Activo" : "Inactivo"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Integraciones de Plataforma</CardTitle>
            <CardDescription>
              Herramientas conectadas que potencian la gestión de {brand.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    M
                  </div>
                  <span className="font-semibold">Monday.com</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Gestión de proyectos y tareas del equipo
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-8 h-8 text-orange-500" />
                  <span className="font-semibold">Metricool</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Analytics y calendario de contenido
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-8 h-8 text-green-500" />
                  <span className="font-semibold">Manychat</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chatbot y respuestas automáticas
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Facebook className="w-8 h-8 text-blue-600" />
                  <span className="font-semibold">Meta Ads</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Plataforma de publicidad pagada
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Step */}
        <div className="mt-8 flex justify-end">
          <Button 
            size="lg" 
            onClick={() => navigate(`/showcase/brands/${slug}`)}
            className="gap-2"
          >
            Ver Workflow Completo
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseBrandSetupPage;
