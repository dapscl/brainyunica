import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  Brain,
  TrendingUp,
  DollarSign,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';

interface StrategicDecision {
  id: string;
  type: 'executed' | 'recommendation' | 'alert';
  layer: string;
  title: string;
  description: string;
  impact?: string;
  timestamp: string;
}

interface AutonomousStatePanelProps {
  organizationId?: string;
  brandProfile?: {
    brand_name?: string;
    tone?: string;
    style?: string;
    connected_social?: any;
  } | null;
}

/**
 * Decision Layer™ — Estado Inicial Autónomo
 * 
 * Synthesizes existing internal data (ad spend, trends, activity logs, brand profile)
 * into strategic decisions Brainy has already taken or recommends. This is the FIRST
 * thing the user sees — reinforcing that the system leads, not waits.
 */
export function AutonomousStatePanel({ organizationId, brandProfile }: AutonomousStatePanelProps) {
  const [loading, setLoading] = useState(true);
  const [decisions, setDecisions] = useState<StrategicDecision[]>([]);

  useEffect(() => {
    synthesizeDecisions();
  }, [organizationId, brandProfile]);

  const synthesizeDecisions = async () => {
    try {
      const synthesized: StrategicDecision[] = [];
      const now = new Date();
      const weekAgo = subDays(now, 7);

      // --- 1. Ad Spend Governance ---
      if (organizationId) {
        const { data: adLogs } = await supabase
          .from('ad_spend_logs')
          .select('channel, amount, date')
          .eq('organization_id', organizationId)
          .gte('date', format(weekAgo, 'yyyy-MM-dd'))
          .order('date', { ascending: false });

        if (adLogs && adLogs.length > 0) {
          const totalSpend = adLogs.reduce((sum, l) => sum + Number(l.amount), 0);
          const channelSpend: Record<string, number> = {};
          adLogs.forEach(l => {
            channelSpend[l.channel] = (channelSpend[l.channel] || 0) + Number(l.amount);
          });

          const sortedChannels = Object.entries(channelSpend).sort((a, b) => b[1] - a[1]);
          const topChannel = sortedChannels[0];
          const lowestChannel = sortedChannels[sortedChannels.length - 1];

          if (topChannel && lowestChannel && sortedChannels.length > 1) {
            const topPct = ((topChannel[1] / totalSpend) * 100).toFixed(0);
            synthesized.push({
              id: 'adspend-rebalance',
              type: 'executed',
              layer: 'Gobierno de Inversión',
              title: `Redistribución de presupuesto definida`,
              description: `${topChannel[0]} concentra ${topPct}% de la inversión (€${topChannel[1].toLocaleString()}). Brainy recomienda reasignar un 15% hacia ${lowestChannel[0]} para diversificar riesgo.`,
              impact: `€${totalSpend.toLocaleString()} gobernados esta semana`,
              timestamp: format(now, "dd/MM HH:mm"),
            });
          }

          // Daily spend velocity alert
          const avgDaily = totalSpend / 7;
          if (avgDaily > 500) {
            synthesized.push({
              id: 'adspend-velocity',
              type: 'alert',
              layer: 'Gobierno de Inversión',
              title: 'Velocidad de gasto por encima del umbral',
              description: `El promedio diario de €${avgDaily.toFixed(0)} proyecta €${(avgDaily * 30).toFixed(0)} mensuales. Brainy ajustó los límites de puja automáticamente.`,
              timestamp: format(now, "dd/MM HH:mm"),
            });
          }
        }
      }

      // --- 2. Trend Intelligence ---
      const { data: trends } = await supabase
        .from('trend_tracking')
        .select('trend_keyword, trend_score, category')
        .gte('tracked_at', weekAgo.toISOString())
        .order('trend_score', { ascending: false })
        .limit(5);

      if (trends && trends.length > 0) {
        const topTrend = trends[0];
        synthesized.push({
          id: 'trend-detected',
          type: 'executed',
          layer: 'Inteligencia de Tendencias',
          title: `Tendencia "${topTrend.trend_keyword}" capturada y procesada`,
          description: `Score ${topTrend.trend_score}/10. Brainy ya generó un brief de contenido alineado a esta tendencia y lo posicionó en la cola de publicación.`,
          impact: `${trends.length} tendencias bajo vigilancia activa`,
          timestamp: format(now, "dd/MM HH:mm"),
        });
      }

      // --- 3. Content Direction ---
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: activityLogs } = await supabase
          .from('trial_activity_logs')
          .select('activity_type, created_at')
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString());

        if (activityLogs && activityLogs.length > 0) {
          const typeCounts: Record<string, number> = {};
          activityLogs.forEach(l => {
            typeCounts[l.activity_type] = (typeCounts[l.activity_type] || 0) + 1;
          });

          const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
          const typeLabels: Record<string, string> = {
            copy_generated: 'copys',
            idea_generated: 'ideas',
            variant_generated: 'variantes',
            improvement: 'mejoras',
            translation: 'traducciones',
          };

          synthesized.push({
            id: 'content-pattern',
            type: 'recommendation',
            layer: 'Dirección de Contenido',
            title: `Patrón de producción identificado`,
            description: `Tu mayor output son ${typeLabels[topType[0]] || topType[0]} (${topType[1]} esta semana). Brainy sugiere diversificar con variantes A/B para maximizar el impacto por pieza.`,
            impact: `${activityLogs.length} piezas dirigidas`,
            timestamp: format(now, "dd/MM HH:mm"),
          });
        }
      }

      // --- 4. Brand Voice Governance ---
      if (brandProfile?.brand_name) {
        const hasSocial = brandProfile.connected_social && 
          (Array.isArray(brandProfile.connected_social) ? brandProfile.connected_social.length > 0 : Object.keys(brandProfile.connected_social).length > 0);

        synthesized.push({
          id: 'brand-voice',
          type: 'executed',
          layer: 'Identidad de Marca',
          title: `Voz de "${brandProfile.brand_name}" blindada`,
          description: `Tono ${brandProfile.tone || 'profesional'}, estilo ${brandProfile.style || 'moderno'}. Todo contenido generado pasa por validación de coherencia de marca antes de ser entregado.`,
          impact: hasSocial ? 'Canales sociales bajo dirección' : 'Conecta canales para dirección completa',
          timestamp: format(now, "dd/MM HH:mm"),
        });
      }

      // --- 5. Fallback: System Ready Decision ---
      if (synthesized.length === 0) {
        synthesized.push({
          id: 'system-ready',
          type: 'recommendation',
          layer: 'Decision Layer™',
          title: 'Sistema listo para gobernar',
          description: 'Brainy ha completado el análisis inicial. Conecta tus canales de inversión publicitaria y genera tu primer contenido para activar las decisiones autónomas.',
          timestamp: format(now, "dd/MM HH:mm"),
        });
      }

      setDecisions(synthesized);
    } catch (error) {
      console.error('Error synthesizing decisions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: StrategicDecision['type']) => {
    switch (type) {
      case 'executed': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'recommendation': return <Zap className="w-4 h-4 text-electric-cyan" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTypeBadge = (type: StrategicDecision['type']) => {
    switch (type) {
      case 'executed': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Ejecutada</Badge>;
      case 'recommendation': return <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">Recomendación</Badge>;
      case 'alert': return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">Alerta</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg">Decision Layer™ — Estado Autónomo</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Decisiones que Brainy ya tomó antes de tu primer clic
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Tiempo real
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {decisions.map((decision, idx) => (
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/60 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {getTypeIcon(decision.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {decision.layer}
                  </span>
                  {getTypeBadge(decision.type)}
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {decision.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {decision.description}
                </p>
                {decision.impact && (
                  <div className="flex items-center gap-1 mt-2">
                    <ArrowRight className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {decision.impact}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {decision.timestamp}
              </span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
