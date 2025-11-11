import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, AlertTriangle, DollarSign, Zap } from "lucide-react";
import { FaFacebook, FaLinkedin, FaGoogle } from "react-icons/fa";

// Mock data - en producción vendría de Supabase
const currentMonthSpend = 18500;
const channelBreakdown = [
  { channel: "Facebook Ads", spend: 8200, icon: FaFacebook, color: "hsl(var(--primary))" },
  { channel: "LinkedIn Ads", spend: 6800, icon: FaLinkedin, color: "hsl(var(--accent))" },
  { channel: "Google Ads", spend: 3500, icon: FaGoogle, color: "hsl(var(--secondary))" },
];

const monthlyComparison = [
  { month: "Ene", spend: 12400 },
  { month: "Feb", spend: 15200 },
  { month: "Mar", spend: 14800 },
  { month: "Abr", spend: 16500 },
  { month: "May", spend: 18500 },
];

const dailySpend = [
  { day: "Lun", facebook: 1200, linkedin: 980, google: 450 },
  { day: "Mar", facebook: 1350, linkedin: 1100, google: 520 },
  { day: "Mié", facebook: 1180, linkedin: 950, google: 480 },
  { day: "Jue", facebook: 1420, linkedin: 1200, google: 610 },
  { day: "Vie", facebook: 1310, linkedin: 1050, google: 530 },
  { day: "Sáb", facebook: 920, linkedin: 780, google: 380 },
  { day: "Dom", facebook: 820, linkedin: 740, google: 330 },
];

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
  const pricing = calculatePricing(currentMonthSpend);
  const projectedMonthlySpend = currentMonthSpend * 1.15; // Proyección con 15% de crecimiento
  const projectedCost = calculatePricing(projectedMonthlySpend);

  const showAlert = pricing.progress > 85;

  return (
    <div className="space-y-6">
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
        </CardContent>
      </Card>

      {/* Monthly Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución Mensual de Ad Spend</CardTitle>
          <CardDescription>Comparación de inversión publicitaria en los últimos 5 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyComparison}>
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
      </Card>

      {/* Daily Breakdown by Channel */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución Semanal por Canal</CardTitle>
          <CardDescription>Inversión diaria desglosada por plataforma publicitaria</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailySpend}>
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
      </Card>

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
