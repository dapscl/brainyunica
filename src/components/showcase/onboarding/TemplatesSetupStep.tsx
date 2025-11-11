import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, Sparkles, MessageSquare, Video, 
  Image as ImageIcon, Calendar, Target, Rocket
} from 'lucide-react';

interface TemplatesSetupStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const TemplatesSetupStep = ({ data, onUpdate }: TemplatesSetupStepProps) => {
  const chatTemplates = [
    {
      id: 'welcome',
      name: 'Welcome Series',
      description: 'Secuencia de bienvenida automática de 5 mensajes',
      icon: MessageSquare,
      recommended: true
    },
    {
      id: 'faq',
      name: 'FAQ Automático',
      description: '20+ respuestas predefinidas con detección inteligente',
      icon: MessageSquare,
      recommended: true
    },
    {
      id: 'lead_qualifier',
      name: 'Lead Qualifier',
      description: 'Calificación automática con scoring',
      icon: Target,
      recommended: false
    }
  ];

  const contentTemplates = [
    {
      id: 'product_launch',
      name: 'Product Launch Campaign',
      description: '6 posts coordinados para lanzamiento de producto',
      icon: Rocket,
      type: 'Campaña',
      pieces: 6
    },
    {
      id: 'weekly_tips',
      name: 'Weekly Tips Series',
      description: 'Serie educativa semanal con formato consistente',
      icon: Calendar,
      type: 'Serie',
      pieces: 4
    },
    {
      id: 'testimonial',
      name: 'Customer Testimonial',
      description: 'Plantilla para compartir testimonios de clientes',
      icon: ImageIcon,
      type: 'Individual',
      pieces: 1
    },
    {
      id: 'video_promo',
      name: 'Video Promotion',
      description: 'Template para promocionar videos con CTA claro',
      icon: Video,
      type: 'Individual',
      pieces: 1
    }
  ];

  const toggleTemplate = (category: string, templateId: string) => {
    const key = `${category}Templates`;
    const current = data[key] || [];
    const updated = current.includes(templateId)
      ? current.filter((id: string) => id !== templateId)
      : [...current, templateId];
    onUpdate({ ...data, [key]: updated });
  };

  const isSelected = (category: string, templateId: string) => {
    const key = `${category}Templates`;
    return (data[key] || []).includes(templateId);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Templates y Configuración Inicial</h2>
        <p className="text-muted-foreground">
          Selecciona templates para comenzar rápidamente con contenido pre-configurado
        </p>
      </div>

      <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <div>
              <p className="font-medium">¡Configuración Casi Completa!</p>
              <p className="text-sm text-muted-foreground">
                Selecciona los templates que necesites y estarás listo para comenzar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Automation Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Templates de Chat Automation
          </CardTitle>
          <CardDescription>
            Flujos de conversación pre-configurados listos para usar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chatTemplates.map((template) => {
              const Icon = template.icon;
              const selected = isSelected('chat', template.id);
              
              return (
                <div
                  key={template.id}
                  onClick={() => toggleTemplate('chat', template.id)}
                  className={`
                    p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${selected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        {template.recommended && (
                          <Badge variant="default" className="text-xs">
                            Recomendado
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    {selected && (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Templates de Contenido
          </CardTitle>
          <CardDescription>
            Plantillas de posts y campañas para tus redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentTemplates.map((template) => {
              const Icon = template.icon;
              const selected = isSelected('content', template.id);
              
              return (
                <div
                  key={template.id}
                  onClick={() => toggleTemplate('content', template.id)}
                  className={`
                    p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${selected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {template.pieces} {template.pieces === 1 ? 'pieza' : 'piezas'}
                      </p>
                    </div>
                    {selected && (
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">
                  {(data.chatTemplates || []).length}
                </p>
                <p className="text-xs text-muted-foreground">Templates Chat</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">
                  {(data.contentTemplates || []).length}
                </p>
                <p className="text-xs text-muted-foreground">Templates Contenido</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">
                  {(data.channels || []).length}
                </p>
                <p className="text-xs text-muted-foreground">Canales Conectados</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">
                  {data.tone ? '✓' : '–'}
                </p>
                <p className="text-xs text-muted-foreground">Tono de Voz</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-3 text-sm text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <p>
                  <strong>Todo listo para comenzar.</strong> Podrás agregar más templates y configuraciones desde el dashboard.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplatesSetupStep;
