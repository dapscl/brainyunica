import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

export const PlatformComparison = () => {
  const features = [
    {
      category: "Gestión de Redes Sociales",
      description: "Planificación, calendarización y publicación multicanal",
      traditional: "Plataforma separada con dashboard complejo",
      brainy: "Gestión conversacional vía WhatsApp con IA"
    },
    {
      category: "Automatización de Chat",
      description: "Respuestas automáticas y flujos conversacionales",
      traditional: "Herramienta dedicada con flujos visuales",
      brainy: "Integrado nativamente con gestión de contenido"
    },
    {
      category: "Campañas Publicitarias",
      description: "Media buying, optimización y seguimiento de ROI",
      traditional: "Plataforma de paid media independiente",
      brainy: "AI Media Buyer con recomendaciones en tiempo real"
    },
    {
      category: "Gestión de Proyectos",
      description: "Tareas, aprobaciones y colaboración de equipo",
      traditional: "Software de project management por separado",
      brainy: "Flujo de aprobaciones integrado en WhatsApp"
    },
    {
      category: "Analytics y Reporting",
      description: "Métricas, dashboards y reportes exportables",
      traditional: "Datos dispersos en múltiples plataformas",
      brainy: "Vista unificada en tiempo real de todo el ecosistema"
    },
    {
      category: "Generación de Contenido",
      description: "Creación de copys, imágenes y videos con IA",
      traditional: "No incluido - requiere herramientas adicionales",
      brainy: "Generador multimodal (texto, imagen, video) integrado"
    },
    {
      category: "Captura de Leads",
      description: "Formularios, segmentación y nurturing",
      traditional: "CRM o herramienta de marketing automation separada",
      brainy: "Sistema de leads con automatización conversacional"
    },
    {
      category: "Tendencias e Inspiración",
      description: "Monitoreo de trends y biblioteca de referencias",
      traditional: "Investigación manual o suscripciones extra",
      brainy: "Análisis automático semanal con sugerencias de contenido"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="outline" className="mb-4 px-4 py-2">
          Comparativa
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Una Plataforma que Reemplaza Todo
        </h2>
        <p className="text-xl text-muted-foreground">
          En lugar de contratar 4-6 herramientas diferentes, BrainybyUnica centraliza todas 
          las capacidades que necesitas para gestionar tu marketing digital desde un solo lugar.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="lg:col-span-1 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-center">Funcionalidad</CardTitle>
          </CardHeader>
        </Card>
        <Card className="lg:col-span-1 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <X className="w-5 h-5 text-destructive" />
              Enfoque Tradicional
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="lg:col-span-1 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 text-primary">
              <Check className="w-5 h-5" />
              BrainybyUnica
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-3">
        {features.map((feature, idx) => (
          <div key={idx} className="grid lg:grid-cols-3 gap-4 items-start">
            <Card className="h-full">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{feature.category}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
            
            <Card className="h-full bg-muted/30">
              <CardContent className="p-4 flex items-center gap-3">
                <X className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm">{feature.traditional}</p>
              </CardContent>
            </Card>

            <Card className="h-full bg-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm font-medium">{feature.brainy}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 mt-12">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-3">El Resultado</h3>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <p className="text-4xl font-bold text-primary mb-2">-70%</p>
              <p className="text-sm text-muted-foreground">Reducción en costos de herramientas</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">5x</p>
              <p className="text-sm text-muted-foreground">Más rápido en aprobaciones</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-2">100%</p>
              <p className="text-sm text-muted-foreground">Visibilidad unificada</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
