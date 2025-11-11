import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Eye, MousePointer, DollarSign, Users, AlertTriangle, BarChart3 } from 'lucide-react';

const CreativePerformanceTracker = () => {
  const creatives = [
    {
      id: 1,
      name: 'Tech Product Video',
      type: 'video',
      status: 'alert',
      impressions: 45230,
      clicks: 892,
      ctr: 1.97,
      ctrTrend: 'down',
      ctrChange: -28,
      spend: 1240,
      conversions: 34,
      cpa: 36.47,
      roas: 4.2,
      fatigue: 78,
      daysActive: 12
    },
    {
      id: 2,
      name: 'Carousel Product Showcase',
      type: 'carousel',
      status: 'winner',
      impressions: 67890,
      clicks: 2156,
      ctr: 3.18,
      ctrTrend: 'up',
      ctrChange: 15,
      spend: 1890,
      conversions: 98,
      cpa: 19.29,
      roas: 7.8,
      fatigue: 23,
      daysActive: 5
    },
    {
      id: 3,
      name: 'Brand Story Image',
      type: 'image',
      status: 'normal',
      impressions: 32100,
      clicks: 578,
      ctr: 1.80,
      ctrTrend: 'stable',
      ctrChange: 2,
      spend: 890,
      conversions: 23,
      cpa: 38.70,
      roas: 3.1,
      fatigue: 45,
      daysActive: 8
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'winner': return 'bg-green-500';
      case 'alert': return 'bg-red-500';
      case 'normal': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'winner': return 'Top Performer';
      case 'alert': return 'Requiere Atención';
      case 'normal': return 'Normal';
      default: return status;
    }
  };

  const getFatigueColor = (fatigue: number) => {
    if (fatigue >= 70) return 'text-red-500';
    if (fatigue >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Creative Performance Tracker</CardTitle>
          <CardDescription className="text-base">
            Seguimiento detallado del rendimiento de cada creatividad publicitaria
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Creatividad</CardTitle>
          <CardDescription>Análisis comparativo de todas las creatividades activas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {creatives.map((creative) => (
            <div key={creative.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(creative.status)}`} />
                    <h3 className="font-semibold text-lg">{creative.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {creative.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Activo por {creative.daysActive} días
                  </p>
                </div>
                <Badge variant={creative.status === 'winner' ? 'default' : creative.status === 'alert' ? 'destructive' : 'secondary'}>
                  {getStatusLabel(creative.status)}
                </Badge>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>Impresiones</span>
                  </div>
                  <p className="text-lg font-semibold">{creative.impressions.toLocaleString()}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MousePointer className="w-3 h-3" />
                    <span>Clicks</span>
                  </div>
                  <p className="text-lg font-semibold">{creative.clicks.toLocaleString()}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <DollarSign className="w-3 h-3" />
                    <span>Gasto</span>
                  </div>
                  <p className="text-lg font-semibold">€{creative.spend.toLocaleString()}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Conversiones</span>
                  </div>
                  <p className="text-lg font-semibold">{creative.conversions}</p>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">CTR</span>
                    <div className="flex items-center gap-1">
                      {creative.ctrTrend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-500" />
                      ) : creative.ctrTrend === 'down' ? (
                        <TrendingDown className="w-3 h-3 text-red-500" />
                      ) : null}
                      <span className={`text-xs ${creative.ctrTrend === 'up' ? 'text-green-500' : creative.ctrTrend === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {creative.ctrChange > 0 ? '+' : ''}{creative.ctrChange}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{creative.ctr}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">CPA</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">€{creative.cpa}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">ROAS</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{creative.roas}x</span>
                  </div>
                </div>
              </div>

              {/* Fatigue Indicator */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Índice de Fatiga Creativa</span>
                  </div>
                  <span className={`text-sm font-bold ${getFatigueColor(creative.fatigue)}`}>
                    {creative.fatigue}%
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${creative.fatigue >= 70 ? 'bg-red-500' : creative.fatigue >= 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${creative.fatigue}%` }}
                  />
                </div>
                {creative.fatigue >= 70 && (
                  <p className="text-xs text-red-500 mt-2">
                    ⚠️ Alta fatiga detectada. Considera actualizar o pausar esta creatividad.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" className="flex-1">
                  <BarChart3 className="w-3 h-3 mr-2" />
                  Ver Detalles
                </Button>
                <Button size="sm" variant="outline">
                  Duplicar
                </Button>
                <Button size="sm" variant="outline">
                  Editar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Rendimiento</CardTitle>
          <CardDescription>Métricas clave comparadas entre creatividades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">CTR Promedio</span>
                <span className="text-sm font-bold">2.32%</span>
              </div>
              {creatives.map((creative) => (
                <div key={creative.id} className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{creative.name}</span>
                    <span>{creative.ctr}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${(creative.ctr / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">ROAS Promedio</span>
                <span className="text-sm font-bold">5.03x</span>
              </div>
              {creatives.map((creative) => (
                <div key={creative.id} className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{creative.name}</span>
                    <span>{creative.roas}x</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ width: `${(creative.roas / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreativePerformanceTracker;
