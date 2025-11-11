import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowRight, Settings, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <Card className="border-purple-accent/20 bg-card/30 backdrop-blur-sm hover:border-purple-accent/40 transition-all duration-500">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-accent/10 backdrop-blur-sm">
              <Sparkles className="w-7 h-7 text-purple-accent" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight text-foreground uppercase">
                AI Media Buyer
              </CardTitle>
              <p className="text-base text-muted-foreground font-light">
                Tu asistente de IA analiza campañas 24/7 y sugiere optimizaciones en tiempo real
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-tight">Insights Automáticos</CardTitle>
            <p className="text-sm text-muted-foreground font-light">Análisis de rendimiento basado en machine learning</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="border border-border/50 rounded-lg p-4 bg-card/20 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{insight.metric}</p>
                    {insight.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <p className="font-bold text-lg mb-1 text-foreground">{insight.value}</p>
                  <p className={`text-xs ${insight.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {insight.change}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold uppercase tracking-tight">Recomendaciones de Optimización</CardTitle>
            <p className="text-sm text-muted-foreground font-light">Acciones sugeridas por IA para maximizar resultados</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="border border-border/50 rounded-lg p-4 bg-card/20 backdrop-blur-sm hover:shadow-lg hover:border-electric-cyan/30 transition-all duration-300"
              >
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
                      <h3 className="font-bold text-foreground">{rec.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {rec.description}
                    </p>
                  </div>
                  <Badge variant={getPriorityColor(rec.priority)} className="ml-2">
                    {getPriorityLabel(rec.priority)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border/50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-electric-cyan">{rec.impact}</p>
                    <p className="text-xs text-muted-foreground">
                      Confianza: {rec.confidence}%
                    </p>
                  </div>
                  <Button size="sm" className="gap-2 bg-electric-cyan hover:bg-electric-cyan/90 text-background">
                    {rec.action}
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Bidding Optimizer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm hover:shadow-[0_0_40px_hsl(220_80%_60%_/_0.3)] transition-all duration-500">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold uppercase tracking-tight">AI Bidding Optimizer</CardTitle>
                <p className="text-sm text-muted-foreground font-light">Optimización automática de pujas en tiempo real</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm font-medium mb-2 text-foreground">🎯 Sistema de Pujas Inteligente Activo</p>
              <p className="text-xs text-muted-foreground">
                La IA ajusta automáticamente las pujas cada 2 horas según rendimiento, competencia y objetivos de ROAS
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card/20 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-medium text-foreground">LinkedIn Ads - Tech Campaign</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Puja aumentada +€2.30 → Proyecta +45 conversiones
                  </p>
                </div>
                <Badge className="bg-green-500 text-background">Optimizado</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card/20 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-medium text-foreground">Meta Ads - Product Launch</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Puja reducida -€1.80 → Ahorra €340/día sin perder conversiones
                  </p>
                </div>
                <Badge className="bg-green-500 text-background">Optimizado</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg bg-card/20 backdrop-blur-sm">
                <div>
                  <p className="text-sm font-medium text-foreground">Google Ads - Brand Search</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sin cambios → Rendimiento óptimo actual
                  </p>
                </div>
                <Badge variant="secondary">Estable</Badge>
              </div>
            </div>

            <Button className="w-full gap-2 bg-blue-500 hover:bg-blue-500/90 text-background uppercase tracking-wide">
              <Settings className="w-4 h-4" />
              Configurar Bidding Strategy
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AIMediaBuyerPanel;