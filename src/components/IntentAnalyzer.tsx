
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface IntentAnalyzerProps {
  onIntentAnalyzed?: (result: IntentAnalysisResult) => void;
}

export type IntentAnalysisResult = {
  intent: 'high' | 'medium' | 'low';
  score: number;
  keywords: string[];
  message: string;
  analysis: {
    urgency: number;
    budget: number;
    specificity: number;
    stage: 'awareness' | 'consideration' | 'decision';
  };
};

const IntentAnalyzer: React.FC<IntentAnalyzerProps> = ({ onIntentAnalyzed }) => {
  const [message, setMessage] = React.useState<string>('');
  const [analyzing, setAnalyzing] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<IntentAnalysisResult | null>(null);
  const [language, setLanguage] = React.useState<string>('es');

  // Palabras clave de alta intención en español
  const highIntentKeywords = [
    'necesito', 'busco', 'urgente', 'presupuesto', 'cotización',
    'contratar', 'comprar', 'adquirir', 'implementar', 'ayuda con',
    'recomendación', 'proveedor', 'servicio', 'precio', 'costo'
  ];

  // Analizador simplificado para demo
  const analyzeIntent = (text: string): IntentAnalysisResult => {
    const lowerText = text.toLowerCase();
    
    // Contar palabras clave de alta intención
    const keywordMatches = highIntentKeywords.filter(word => lowerText.includes(word));
    
    // Calcular puntuación basada en longitud y palabras clave
    const lengthScore = Math.min(text.length / 100, 1) * 30; // Máximo 30 puntos por longitud
    const keywordScore = (keywordMatches.length / highIntentKeywords.length) * 50; // Máximo 50 puntos por keywords
    
    // Analizar urgencia por palabras como "urgente", "necesito", etc.
    const urgencyKeywords = ['urgente', 'inmediato', 'pronto', 'esta semana', 'lo antes posible'];
    const urgencyScore = urgencyKeywords.some(word => lowerText.includes(word)) ? 
      Math.random() * 30 + 70 : // Alta urgencia
      Math.random() * 50 + 20;  // Urgencia media-baja
    
    // Analizar si menciona presupuesto
    const budgetKeywords = ['presupuesto', 'invertir', 'pagar', 'costo', 'precio'];
    const budgetScore = budgetKeywords.some(word => lowerText.includes(word)) ?
      Math.random() * 30 + 70 : // Menciona presupuesto
      Math.random() * 40 + 30;  // No menciona explícitamente
    
    // Analizar especificidad de la solicitud
    const specificKeywords = ['específicamente', 'exactamente', 'concretamente', 'en particular'];
    const specificScore = specificKeywords.some(word => lowerText.includes(word)) ?
      Math.random() * 20 + 80 : // Muy específico
      Math.random() * 60 + 20;  // Menos específico
      
    // Calcular puntuación total
    const totalScore = lengthScore + keywordScore + (Math.random() * 20); // Añadir algo de aleatoriedad
    
    // Determinar el nivel de intención
    let intent: 'high' | 'medium' | 'low';
    if (totalScore >= 70) intent = 'high';
    else if (totalScore >= 40) intent = 'medium';
    else intent = 'low';
    
    // Determinar etapa del buyer journey
    let stage: 'awareness' | 'consideration' | 'decision';
    if (lowerText.includes('comprar') || lowerText.includes('contratar') || lowerText.includes('adquirir')) {
      stage = 'decision';
    } else if (lowerText.includes('comparar') || lowerText.includes('alternativas') || lowerText.includes('opciones')) {
      stage = 'consideration';
    } else {
      stage = 'awareness';
    }
    
    return {
      intent,
      score: Math.round(totalScore),
      keywords: keywordMatches,
      message: text,
      analysis: {
        urgency: Math.round(urgencyScore),
        budget: Math.round(budgetScore),
        specificity: Math.round(specificScore),
        stage
      }
    };
  };

  const handleAnalyze = () => {
    if (!message.trim()) return;
    
    setAnalyzing(true);
    
    // Simular tiempo de procesamiento
    setTimeout(() => {
      const analysisResult = analyzeIntent(message);
      setResult(analysisResult);
      setAnalyzing(false);
      
      if (onIntentAnalyzed) {
        onIntentAnalyzed(analysisResult);
      }
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analizador de Intención</CardTitle>
        <CardDescription>
          Analiza mensajes para detectar la intención de compra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="language">Idioma</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">Inglés</SelectItem>
                <SelectItem value="auto">Detectar automáticamente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Textarea
            id="message"
            placeholder="Ingresa el mensaje para analizar la intención de compra..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>
        
        <Button 
          onClick={handleAnalyze} 
          disabled={analyzing || !message.trim()}
          className="w-full"
        >
          {analyzing ? 'Analizando...' : 'Analizar Intención'}
        </Button>
        
        {result && (
          <div className="space-y-4 mt-4 border-t pt-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Resultado del análisis</h3>
              <Badge className={
                result.intent === 'high' ? 'bg-intent-high/10 text-intent-high border-intent-high/20' :
                result.intent === 'medium' ? 'bg-intent-medium/10 text-intent-medium border-intent-medium/20' :
                'bg-intent-low/10 text-intent-low border-intent-low/20'
              }>
                {result.intent === 'high' ? 'Alta' : 
                 result.intent === 'medium' ? 'Media' : 'Baja'} Intención
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-sm">Puntuación Global</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    defaultValue={[result.score]} 
                    max={100} 
                    step={1}
                    disabled 
                  />
                  <span className="text-sm font-medium w-8">{result.score}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm">Urgencia</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    defaultValue={[result.analysis.urgency]} 
                    max={100} 
                    step={1}
                    disabled 
                  />
                  <span className="text-sm font-medium w-8">{result.analysis.urgency}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm">Presupuesto</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    defaultValue={[result.analysis.budget]} 
                    max={100} 
                    step={1}
                    disabled 
                  />
                  <span className="text-sm font-medium w-8">{result.analysis.budget}</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm">Especificidad</Label>
                <div className="flex items-center gap-2">
                  <Slider 
                    defaultValue={[result.analysis.specificity]} 
                    max={100} 
                    step={1}
                    disabled 
                  />
                  <span className="text-sm font-medium w-8">{result.analysis.specificity}</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label className="text-sm">Etapa de compra</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {(['awareness', 'consideration', 'decision'] as const).map((stage) => (
                  <div 
                    key={stage}
                    className={`text-center p-2 rounded-md ${
                      result.analysis.stage === stage 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'bg-muted'
                    }`}
                  >
                    <span className="text-xs font-medium">
                      {stage === 'awareness' ? 'Conocimiento' : 
                       stage === 'consideration' ? 'Consideración' : 'Decisión'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {result.keywords.length > 0 && (
              <div>
                <Label className="text-sm">Palabras clave detectadas</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {result.keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="bg-primary/5">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntentAnalyzer;
