import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Sparkles,
  FileText,
  Lightbulb,
  RefreshCw,
  Languages,
  Flame
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

interface DailyActivity {
  date: string;
  count: number;
  label: string;
}

interface TopTrend {
  keyword: string;
  score: number;
  count: number;
}

interface ActivityBreakdown {
  type: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const UsageAnalyticsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [dailyContent, setDailyContent] = useState<DailyActivity[]>([]);
  const [topTrends, setTopTrends] = useState<TopTrend[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<ActivityBreakdown[]>([]);
  const [totalWeekly, setTotalWeekly] = useState(0);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get last 7 days
      const days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date()
      });

      // Load trial activity logs for the week
      const weekStart = subDays(new Date(), 6);
      const { data: activityLogs } = await supabase
        .from('trial_activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString())
        .order('created_at', { ascending: true });

      // Process daily content generation
      const dailyData: DailyActivity[] = days.map(day => {
        const dayStr = format(day, 'yyyy-MM-dd');
        const dayActivities = activityLogs?.filter(a => 
          a.created_at?.startsWith(dayStr)
        ) || [];
        return {
          date: dayStr,
          count: dayActivities.length,
          label: format(day, 'EEE', { locale: es })
        };
      });
      setDailyContent(dailyData);

      // Process activity breakdown by type
      const typeBreakdown: Record<string, number> = {};
      activityLogs?.forEach(log => {
        const type = log.activity_type || 'other';
        typeBreakdown[type] = (typeBreakdown[type] || 0) + 1;
      });

      const activityIcons: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
        copy_generated: { icon: <Sparkles className="w-4 h-4" />, color: 'text-purple-400', label: 'Copys' },
        idea_generated: { icon: <Lightbulb className="w-4 h-4" />, color: 'text-yellow-400', label: 'Ideas' },
        variant_generated: { icon: <RefreshCw className="w-4 h-4" />, color: 'text-cyan-400', label: 'Variantes' },
        improvement: { icon: <TrendingUp className="w-4 h-4" />, color: 'text-green-400', label: 'Mejoras' },
        translation: { icon: <Languages className="w-4 h-4" />, color: 'text-blue-400', label: 'Traducciones' },
      };

      const breakdown: ActivityBreakdown[] = Object.entries(typeBreakdown).map(([type, count]) => ({
        type: activityIcons[type]?.label || type,
        count,
        icon: activityIcons[type]?.icon || <FileText className="w-4 h-4" />,
        color: activityIcons[type]?.color || 'text-muted-foreground'
      })).sort((a, b) => b.count - a.count);

      setWeeklyActivity(breakdown);
      setTotalWeekly(activityLogs?.length || 0);

      // Load top trends
      const { data: trends } = await supabase
        .from('trend_tracking')
        .select('trend_keyword, trend_score')
        .gte('tracked_at', subDays(new Date(), 7).toISOString())
        .order('trend_score', { ascending: false })
        .limit(10);

      if (trends) {
        // Group and count trends
        const trendCounts: Record<string, { score: number; count: number }> = {};
        trends.forEach(t => {
          if (!trendCounts[t.trend_keyword]) {
            trendCounts[t.trend_keyword] = { score: t.trend_score, count: 0 };
          }
          trendCounts[t.trend_keyword].count++;
        });

        const topTrendsData = Object.entries(trendCounts)
          .map(([keyword, data]) => ({
            keyword,
            score: data.score,
            count: data.count
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 5);

        setTopTrends(topTrendsData);
      }

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-electric-cyan" />
          Analytics de Uso
        </h2>
        <Badge variant="outline" className="text-xs">
          Últimos 7 días
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Daily Content Chart */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              Contenido por Día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyContent}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    labelFormatter={(label) => `Día: ${label}`}
                    formatter={(value: number) => [`${value} contenidos`, 'Generados']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-foreground">{totalWeekly}</p>
              <p className="text-xs text-muted-foreground">Total esta semana</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Trends */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              Tendencias Top
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topTrends.length > 0 ? (
              <div className="space-y-3">
                {topTrends.map((trend, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="outline" className="text-xs shrink-0">
                        #{idx + 1}
                      </Badge>
                      <span className="text-sm text-foreground truncate">
                        {trend.keyword}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          trend.score >= 8 ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                          trend.score >= 5 ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                          'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {trend.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center">
                  No hay tendencias registradas.<br/>
                  Actualiza TrendBrainy para ver datos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Breakdown */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Actividad Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyActivity.length > 0 ? (
              <div className="space-y-3">
                {weeklyActivity.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <span className="text-sm text-foreground">
                        {activity.type}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-foreground">
                      {activity.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center">
                  No hay actividad registrada.<br/>
                  Genera contenido para ver estadísticas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UsageAnalyticsPanel;
