import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, AlertTriangle, DollarSign, Zap, Plus, RefreshCw } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGoogle } from "react-icons/fa";
import { useAdSpendLogs, useAdSpendMetrics, useBulkAddAdSpend } from "@/hooks/useAdSpend";
import { useUserOrganizations } from "@/hooks/useUserOrganizations";
import { Skeleton } from "@/components/ui/skeleton";
import { format, subDays, startOfMonth, endOfMonth, subMonths } from "date-fns";

const calculatePricing = (adSpend: number) => {
  if (adSpend <= 5000) {
    return {
      tier: "Starter",
      basePrice: 199,
      percentage: 4,
      calculatedCost: 199 + (adSpend * 0.04),
      maxCost: 399,
      nextTierAt: 5000,
      progress: (adSpend / 5000) * 100,
    };
  } else if (adSpend <= 25000) {
    return {
      tier: "Professional",
      basePrice: 399,
      percentage: 3,
      calculatedCost: 399 + (adSpend * 0.03),
      maxCost: 1149,
      nextTierAt: 25000,
      progress: ((adSpend - 5000) / 20000) * 100,
    };
  } else {
    return {
      tier: "Enterprise",
      basePrice: 1149,
      percentage: 2,
      calculatedCost: 1149 + (adSpend * 0.02),
      maxCost: null,
      nextTierAt: null,
      progress: 100,
    };
  }
};

export function AdSpendTracker() {
  const { organizations } = useUserOrganizations();
  const currentOrgId = organizations?.[0]?.id;

  // Get current month date range
  const today = new Date();
  const currentMonthStart = format(startOfMonth(today), 'yyyy-MM-dd');
  const currentMonthEnd = format(endOfMonth(today), 'yyyy-MM-dd');

  // Get data from Supabase
  const { data: logs, isLoading: logsLoading } = useAdSpendLogs(currentOrgId, currentMonthStart, currentMonthEnd);
  const { data: metrics, isLoading: metricsLoading } = useAdSpendMetrics(currentOrgId, currentMonthStart, currentMonthEnd);
  const bulkAddMutation = useBulkAddAdSpend();

  // Calculate current month spend
  const currentMonthSpend = metrics?.total_spend ? Number(metrics.total_spend) : 0;
  
  // Channel breakdown from real data
  const channelBreakdown = metrics?.channel_breakdown 
    ? Object.entries(metrics.channel_breakdown).map(([channel, spend]) => ({
        channel: channel.includes('Facebook') ? 'Facebook Ads' : channel.includes('LinkedIn') ? 'LinkedIn Ads' : 'Google Ads',
        spend: Number(spend),
        icon: channel.includes('Facebook') ? FaFacebook : channel.includes('LinkedIn') ? FaLinkedin : FaGoogle,
        color: channel.includes('Facebook') ? "hsl(var(--primary))" : channel.includes('LinkedIn') ? "hsl(var(--accent))" : "hsl(var(--secondary))",
      }))
    : [];

  const pricing = calculatePricing(currentMonthSpend);
  const projectedMonthlySpend = currentMonthSpend * 1.15;
  const projectedCost = calculatePricing(projectedMonthlySpend);
  const showAlert = pricing.progress > 85;
  const isLoading = logsLoading || metricsLoading;

  // Generate demo data
  const handleGenerateDemoData = async () => {
    if (!currentOrgId) return;

    const demoLogs = [];
    const channels = ['Facebook', 'LinkedIn', 'Google'];
    
    // Generate data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      
      channels.forEach(channel => {
        const amount = Math.floor(Math.random() * 1000) + 500;
        demoLogs.push({
          organization_id: currentOrgId,
          channel,
          amount,
          date,
          campaign_id: `campaign-${channel.toLowerCase()}-${i}`,
          campaign_name: `${channel} Campaign ${Math.floor(i / 7) + 1}`,
          metadata: {},
        });
      });
    }

    await bulkAddMutation.mutateAsync(demoLogs);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Demo Data Generator */}
      {currentMonthSpend === 0 && (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Comenzar con Datos de Demo
            </CardTitle>
            <CardDescription>
              No hay datos de ad spend aún. Genera datos de demostración para ver el dashboard en acción.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerateDemoData}
              disabled={bulkAddMutation.isPending}
              className="w-full md:w-auto"
            >
              {bulkAddMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generando datos...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generar Datos Demo
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Alert when approaching tier limit */}
      {showAlert && pricing.nextTierAt && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle>Próximo al límite del tier {pricing.tier}</AlertTitle>
          <AlertDescription>
            Has utilizado €{currentMonthSpend.toLocaleString()} de €{pricing.nextTierAt.toLocaleString()} disponibles. 
            Considera actualizar tu plan para obtener mejores tarifas.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Month Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Inversión Acumulada (Mayo)</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              €{currentMonthSpend.toLocaleString()}
              <Badge variant="secondary" className="text-xs font-normal">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tier actual: {pricing.tier}</span>
                <span className="font-medium">{pricing.progress.toFixed(0)}%</span>
              </div>
              <Progress value={pricing.progress} className="h-2" />
              {pricing.nextTierAt && (
                <p className="text-xs text-muted-foreground">
                  €{(pricing.nextTierAt - currentMonthSpend).toLocaleString()} hasta el siguiente tier
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Costo Plataforma (Este Mes)</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              €{pricing.calculatedCost.toFixed(0)}
              <Badge variant="outline" className="text-xs font-normal">
                {pricing.percentage}% Ad Spend
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base mensual:</span>
                <span>€{pricing.basePrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Variable ({pricing.percentage}%):</span>
                <span>€{(pricing.calculatedCost - pricing.basePrice).toFixed(0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Proyección Fin de Mes</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              €{projectedMonthlySpend.toFixed(0)}
              <Badge variant="secondary" className="text-xs font-normal">
                <Zap className="h-3 w-3 mr-1" />
                Estimado
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Costo proyectado:</span>
                <span className="font-medium">€{projectedCost.calculatedCost.toFixed(0)}</span>
              </div>
              {projectedCost.tier !== pricing.tier && (
                <p className="text-xs text-warning flex items-center gap-1 mt-2">
                  <AlertTriangle className="h-3 w-3" />
                  Cambiaría a tier {projectedCost.tier}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Canal Publicitario</CardTitle>
          <CardDescription>Distribución de inversión en el mes actual</CardDescription>
        </CardHeader>
        <CardContent>
          {channelBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No hay datos de canales disponibles
            </p>
          ) : (
            <div className="space-y-4">
              {channelBreakdown.map((channel) => {
              const Icon = channel.icon;
              const percentage = (channel.spend / currentMonthSpend) * 100;
              return (
                <div key={channel.channel} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5" style={{ color: channel.color }} />
                      </div>
                      <div>
                        <p className="font-medium">{channel.channel}</p>
                        <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}% del total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">€{channel.spend.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">este mes</p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Note about historical data */}
      <Card>
        <CardHeader>
          <CardTitle>Datos en Tiempo Real</CardTitle>
          <CardDescription>
            El sistema está conectado a Supabase y mostrando datos reales de tu organización. 
            Los gráficos históricos se generarán automáticamente a medida que agregues más datos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Total de registros: <span className="font-semibold text-foreground">{logs?.length || 0}</span></p>
            <p>Última actualización: <span className="font-semibold text-foreground">{format(today, 'dd/MM/yyyy HH:mm')}</span></p>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Comparison Chart - Commented out until we have historical data */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Evolución Mensual de Ad Spend</CardTitle>
          <CardDescription>Comparación de inversión publicitaria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={[]}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`€${value.toLocaleString()}`, 'Ad Spend']}
              />
              <Area 
                type="monotone" 
                dataKey="spend" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSpend)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* Daily Breakdown by Channel - Commented out until we have enough data */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Distribución Semanal por Canal</CardTitle>
          <CardDescription>Inversión diaria desglosada por plataforma publicitaria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[]}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `€${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => `€${value.toLocaleString()}`}
              />
              <Legend 
                wrapperStyle={{ fontSize: '12px' }}
                iconType="circle"
              />
              <Bar dataKey="facebook" fill="hsl(var(--primary))" name="Facebook" radius={[4, 4, 0, 0]} />
              <Bar dataKey="linkedin" fill="hsl(var(--accent))" name="LinkedIn" radius={[4, 4, 0, 0]} />
              <Bar dataKey="google" fill="hsl(var(--secondary))" name="Google" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      {/* Upgrade Plan CTA */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Optimiza tu Inversión
              </CardTitle>
              <CardDescription className="mt-2">
                {pricing.tier === "Enterprise" 
                  ? "Estás en el plan Enterprise con las mejores tarifas (2% de ad spend)"
                  : `Actualiza al siguiente tier para obtener mejores tarifas y ahorrar en costos variables`
                }
              </CardDescription>
            </div>
            {pricing.tier !== "Enterprise" && (
              <Button className="bg-gradient-primary hover:opacity-90">
                Actualizar Plan
              </Button>
            )}
          </div>
        </CardHeader>
        {pricing.tier !== "Enterprise" && (
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tier actual:</p>
                <p className="font-semibold">{pricing.tier} - {pricing.percentage}% ad spend</p>
              </div>
              <div>
                <p className="text-muted-foreground">Próximo tier:</p>
                <p className="font-semibold">
                  {pricing.tier === "Starter" ? "Professional - 3%" : "Enterprise - 2%"} ad spend
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
