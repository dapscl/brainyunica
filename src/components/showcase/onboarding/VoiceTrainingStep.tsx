import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Sparkles, Volume2 } from 'lucide-react';

interface VoiceTrainingStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

const VoiceTrainingStep = ({ data, onUpdate }: VoiceTrainingStepProps) => {
  const toneOptions = [
    { value: 'professional', label: 'Profesional', description: 'Formal, confiable y orientado a negocios' },
    { value: 'friendly', label: 'Amigable', description: 'Cercano, accesible y conversacional' },
    { value: 'enthusiastic', label: 'Entusiasta', description: 'Energético, motivador y positivo' },
    { value: 'empathetic', label: 'Empático', description: 'Comprensivo, cálido y de apoyo' },
    { value: 'witty', label: 'Ingenioso', description: 'Inteligente, con humor sutil' },
    { value: 'luxury', label: 'Premium/Lujo', description: 'Sofisticado, exclusivo y refinado' }
  ];

  const exampleResponses = [
    {
      question: '¿Cuáles son los horarios de atención?',
      response: data.tone === 'professional' 
        ? 'Nuestro horario de atención al cliente es de lunes a viernes de 9:00 a 18:00 hrs. Para consultas urgentes fuera de este horario, puede contactarnos a través de nuestro formulario en línea.'
        : data.tone === 'friendly'
        ? '¡Hola! 👋 Estamos aquí para ti de lunes a viernes, de 9 am a 6 pm. Si necesitas algo fuera de ese horario, déjanos un mensaje y te respondemos al día siguiente sin falta.'
        : data.tone === 'enthusiastic'
        ? '¡Genial que preguntes! 🎉 Nuestro equipo está listo para ayudarte de lunes a viernes de 9:00 a 18:00. ¡Nos encantaría resolver todas tus dudas!'
        : 'Entendemos que tu tiempo es valioso. Estamos disponibles de lunes a viernes de 9:00 a 18:00 hrs para brindarte la mejor atención posible.'
    }
  ];

  const handleChange = (field: string, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
          <Volume2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Tono de Voz de tu Marca</h2>
        <p className="text-muted-foreground">
          Entrena la IA para que responda en el estilo único de tu marca
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">IA Entrenada con tu Voz de Marca</p>
              <p className="text-sm text-muted-foreground">
                El sistema aprenderá tu tono, valores y estilo de comunicación para generar respuestas 
                automáticas coherentes con tu identidad de marca en chat automation, email y redes sociales.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalidad de Marca</CardTitle>
          <CardDescription>Define cómo quieres que tu marca se comunique</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tone">Tono Principal *</Label>
            <Select value={data.tone || ''} onValueChange={(value) => handleChange('tone', value)}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Selecciona el tono de comunicación" />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.tone && (
            <div className="p-4 border rounded-lg bg-accent/50 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Ejemplo de Respuesta</span>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">
                  Pregunta: "¿Cuáles son los horarios de atención?"
                </div>
                <div className="text-sm bg-background p-3 rounded border">
                  {exampleResponses[0].response}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Valores de Marca</CardTitle>
          <CardDescription>Palabras clave que definen tu marca (opcional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandValues">Valores y Atributos</Label>
            <Textarea 
              id="brandValues"
              placeholder="Ej: Innovación, Transparencia, Sostenibilidad, Calidad, Compromiso con el cliente..."
              rows={3}
              value={data.brandValues || ''}
              onChange={(e) => handleChange('brandValues', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avoidWords">Palabras o Frases a Evitar (opcional)</Label>
            <Textarea 
              id="avoidWords"
              placeholder="Ej: barato, low cost, oferta limitada..."
              rows={2}
              value={data.avoidWords || ''}
              onChange={(e) => handleChange('avoidWords', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Términos que no se alinean con tu marca y deben evitarse en las comunicaciones
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ejemplos de Comunicación</CardTitle>
          <CardDescription>
            Proporciona ejemplos reales de cómo tu marca se comunica (opcional pero muy recomendado)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="communicationExamples">Textos de Ejemplo</Label>
            <Textarea 
              id="communicationExamples"
              placeholder="Pega ejemplos de posts, emails o mensajes que representen bien tu estilo de comunicación..."
              rows={6}
              value={data.communicationExamples || ''}
              onChange={(e) => handleChange('communicationExamples', e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Cuantos más ejemplos proporciones, mejor entenderá la IA tu estilo único
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Aplicaciones del Tono de Voz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Chat Automation</p>
                <p className="text-xs text-muted-foreground">Respuestas automáticas en todos los canales</p>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Volume2 className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Generación de Contenido</p>
                <p className="text-xs text-muted-foreground">Posts, captions y descripciones con IA</p>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Email Marketing</p>
                <p className="text-xs text-muted-foreground">Comunicaciones multicanal consistentes</p>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceTrainingStep;
