import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowRight, Settings } from 'lucide-react';

const AIMediaBuyerPanel = () => {
  const recommendations = [
    {
      id: 1,
      type: 'optimization',
      priority: 'high',
      title: 'Aumentar presupuesto en LinkedIn',
      description: 'El ROI de LinkedIn está 45% por encima del promedio. Recomendamos incrementar el presupuesto en €500.',
      impact: '+€2,250 ingresos estimados',
      confidence: 92,
      action: 'Aplicar ahora'
    },
    {
      id: 2,
      type: 'alert',
      priority: 'medium',
      title: 'Fatiga creativa detectada',
      description: 'El CTR de "Tech Product Video" ha caído 28% en los últimos 3 días. Hora de actualizar el creativos.',
      impact: 'Previene pérdida de €800',
      confidence: 87,
      action: 'Ver creativos'
    },
    {
      id: 3,
      type: 'opportunity',
      priority: 'medium',
      title: 'Nueva audiencia potencial',
      description: 'IA detectó una audiencia similar con alta intención de compra. CPA proyectado: €12 (40% menor).',
      impact: '+120 conversiones/mes',
      confidence: 79,
      action: 'Crear campaña'
    }
  ];

  const insights = [
    {
      metric: 'Mejor horario de publicación',
      value: '18:00 - 21:00',
      trend: 'up',
      change: '+34% engagement'
    },
    {
      metric: 'Canal con mejor ROI',
      value: 'LinkedIn Ads',
      trend: 'up',
      change: '5.2x ROAS'
    },
    {
      metric: 'Audiencia top',
      value: 'Tech Managers 35-44',
      trend: 'up',
      change: '€8.50 CPA'
    },
    {
      metric: 'Creativos bajo rendimiento',
      value: '3 ads necesitan refresh',
      trend: 'down',
      change: '-22% CTR'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Media Prioridad';
      case 'low': return 'Baja Prioridad';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Media Buyer</CardTitle>
              <CardDescription className="text-base">
                Tu asistente de IA analiza campañas 24/7 y sugiere optimizaciones en tiempo real
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Automáticos</CardTitle>
          <CardDescription>Análisis de rendimiento basado en machine learning</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm text-muted-foreground">{insight.metric}</p>
                  {insight.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <p className="font-semibold text-lg mb-1">{insight.value}</p>
                <p className={`text-xs ${insight.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {insight.change}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones de Optimización</CardTitle>
          <CardDescription>Acciones sugeridas por IA para maximizar resultados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {rec.type === 'alert' ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    ) : rec.type === 'optimization' ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    )}
                    <h3 className="font-semibold">{rec.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {rec.description}
                  </p>
                </div>
                <Badge variant={getPriorityColor(rec.priority)}>
                  {getPriorityLabel(rec.priority)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">{rec.impact}</p>
                  <p className="text-xs text-muted-foreground">
                    Confianza: {rec.confidence}%
                  </p>
                </div>
                <Button size="sm" className="gap-2">
                  {rec.action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Bidding Optimizer */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-xl">AI Bidding Optimizer</CardTitle>
              <CardDescription>Optimización automática de pujas en tiempo real</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">🎯 Sistema de Pujas Inteligente Activo</p>
            <p className="text-xs text-muted-foreground">
              La IA ajusta automáticamente las pujas cada 2 horas según rendimiento, competencia y objetivos de ROAS
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div>
                <p className="text-sm font-medium">LinkedIn Ads - Tech Campaign</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Puja aumentada +€2.30 → Proyecta +45 conversiones
                </p>
              </div>
              <Badge variant="default" className="bg-green-500">Optimizado</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div>
                <p className="text-sm font-medium">Meta Ads - Product Launch</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Puja reducida -€1.80 → Ahorra €340/día sin perder conversiones
                </p>
              </div>
              <Badge variant="default" className="bg-green-500">Optimizado</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
              <div>
                <p className="text-sm font-medium">Google Ads - Brand Search</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Sin cambios → Rendimiento óptimo actual
                </p>
              </div>
              <Badge variant="secondary">Estable</Badge>
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs font-medium mb-3">Configuración del Optimizador:</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Frecuencia: Cada 2 horas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Objetivo ROAS: 4.0x mínimo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Límite ajuste: ±30%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Machine Learning: Activo</span>
              </div>
            </div>
          </div>

          <Button className="w-full gap-2">
            <Settings className="w-4 h-4" />
            Configurar Bidding Strategy
          </Button>
        </CardContent>
      </Card>

      {/* Auto-optimization Status */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Auto-Optimización</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">AI Bidding Optimizer</span>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Redistribución inteligente de presupuesto</span>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Pausado automático de bajo rendimiento</span>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium">Scaling automático de ganadores</span>
              </div>
              <Badge variant="default">Activo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMediaBuyerPanel;
