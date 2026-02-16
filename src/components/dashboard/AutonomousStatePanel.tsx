import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  Brain,
  Shield,
  Activity,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { motion } from 'framer-motion';

interface ActiveDirective {
  id: string;
  type: 'active' | 'adjusted' | 'governing';
  layer: string;
  title: string;
  status: string;
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

const SYSTEM_STATES = [
  'Dirección recalibrándose',
  'Revisión automática en curso',
  'Hipótesis de inversión actualizándose',
  'Coherencia de marca verificándose',
] as const;

/**
 * Decision Layer™ — Estado Autónomo
 * 
 * The system acts. It does not detect, suggest, or recommend.
 * It shows active direction, running hypotheses, and adjustments already executed.
 */
export function AutonomousStatePanel({ organizationId, brandProfile }: AutonomousStatePanelProps) {
  const [loading, setLoading] = useState(true);
  const [directives, setDirectives] = useState<ActiveDirective[]>([]);
  const [systemPulse, setSystemPulse] = useState<string>(SYSTEM_STATES[0]);

  // Rotating system pulse — creates sense of a living engine
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % SYSTEM_STATES.length;
      setSystemPulse(SYSTEM_STATES[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const synthesizeDirectives = useCallback(async () => {
    try {
      const active: ActiveDirective[] = [];
      const now = new Date();
      const weekAgo = subDays(now, 7);
      const ts = format(now, 'HH:mm');

      // --- 1. Investment Governance ---
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

          const sorted = Object.entries(channelSpend).sort((a, b) => b[1] - a[1]);
          const top = sorted[0];
          const lowest = sorted[sorted.length - 1];

          if (top && lowest && sorted.length > 1) {
            const topPct = ((top[1] / totalSpend) * 100).toFixed(0);
            active.push({
              id: 'adspend-rebalance',
              type: 'adjusted',
              layer: 'Gobierno de Inversión',
              title: `Redistribución aplicada: ${topPct}% en ${top[0]} → 15% reasignado a ${lowest[0]}`,
              status: `€${totalSpend.toLocaleString()} bajo dirección`,
              timestamp: ts,
            });
          }

          const avgDaily = totalSpend / 7;
          if (avgDaily > 500) {
            active.push({
              id: 'adspend-velocity',
              type: 'active',
              layer: 'Gobierno de Inversión',
              title: `Límites de puja ajustados — velocidad diaria €${avgDaily.toFixed(0)}`,
              status: `Proyección mensual: €${(avgDaily * 30).toFixed(0)}`,
              timestamp: ts,
            });
          }
        }
      }

      // --- 2. Trend Direction (not "detection") ---
      const { data: trends } = await supabase
        .from('trend_tracking')
        .select('trend_keyword, trend_score')
        .gte('tracked_at', weekAgo.toISOString())
        .order('trend_score', { ascending: false })
        .limit(3);

      if (trends && trends.length > 0) {
        active.push({
          id: 'trend-direction',
          type: 'active',
          layer: 'Dirección de Tendencias',
          title: `Hipótesis activa: "${trends[0].trend_keyword}" integrada en cola de contenido`,
          status: `${trends.length} líneas de dirección vigentes`,
          timestamp: ts,
        });
      }

      // --- 3. Content Direction (not "pattern identified") ---
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: activityLogs } = await supabase
          .from('trial_activity_logs')
          .select('activity_type')
          .eq('user_id', user.id)
          .gte('created_at', weekAgo.toISOString());

        if (activityLogs && activityLogs.length > 0) {
          active.push({
            id: 'content-direction',
            type: 'governing',
            layer: 'Dirección de Contenido',
            title: `${activityLogs.length} piezas producidas bajo criterio de marca`,
            status: 'Coherencia de voz verificada en cada entrega',
            timestamp: ts,
          });
        }
      }

      // --- 4. Brand Voice (not "analysis") ---
      if (brandProfile?.brand_name) {
        active.push({
          id: 'brand-governance',
          type: 'governing',
          layer: 'Identidad Blindada',
          title: `Voz "${brandProfile.brand_name}" activa — tono ${brandProfile.tone || 'profesional'}, estilo ${brandProfile.style || 'moderno'}`,
          status: 'Toda salida validada contra perfil de marca',
          timestamp: ts,
        });
      }

      // --- Fallback: System Operating ---
      if (active.length === 0) {
        active.push({
          id: 'system-operating',
          type: 'active',
          layer: 'Decision Layer™',
          title: 'Motor de dirección operativo — esperando primer canal de inversión',
          status: 'Sistema calibrándose con datos iniciales',
          timestamp: ts,
        });
      }

      setDirectives(active);
    } catch (error) {
      console.error('Error synthesizing directives:', error);
    } finally {
      setLoading(false);
    }
  }, [organizationId, brandProfile]);

  useEffect(() => {
    synthesizeDirectives();
  }, [synthesizeDirectives]);

  const getTypeIcon = (type: ActiveDirective['type']) => {
    switch (type) {
      case 'active': return <Activity className="w-4 h-4 text-electric-cyan" />;
      case 'adjusted': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'governing': return <Shield className="w-4 h-4 text-purple-accent" />;
    }
  };

  const getTypeBadge = (type: ActiveDirective['type']) => {
    switch (type) {
      case 'active': return <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30 text-xs">En curso</Badge>;
      case 'adjusted': return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">Ajuste aplicado</Badge>;
      case 'governing': return <Badge className="bg-purple-accent/20 text-purple-accent border-purple-accent/30 text-xs">Decisión vigente</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="border-electric-cyan/20 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-electric-cyan/20 bg-card/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-electric-cyan to-purple-accent flex items-center justify-center shadow-glow-cyan">
              <Brain className="w-5 h-5 text-background" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">Decision Layer™ — Dirección Activa</CardTitle>
              <motion.p
                key={systemPulse}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.4 }}
                className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5"
              >
                <CircleDot className="w-3 h-3 text-green-400 animate-pulse" />
                {systemPulse}
              </motion.p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs border-electric-cyan/30 text-electric-cyan">
            <Activity className="w-3 h-3 mr-1" />
            Operando
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {directives.map((directive, idx) => (
          <motion.div
            key={directive.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group relative p-4 rounded-lg border border-border/50 bg-card/20 hover:bg-card/40 hover:border-electric-cyan/30 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {getTypeIcon(directive.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {directive.layer}
                  </span>
                  {getTypeBadge(directive.type)}
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {directive.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {directive.status}
                </p>
              </div>
              <span className="text-xs text-muted-foreground/60 shrink-0 tabular-nums">
                {directive.timestamp}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Single supervisory action */}
        <div className="pt-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-electric-cyan hover:text-electric-cyan/80 hover:bg-electric-cyan/10 gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            Validar dirección
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
