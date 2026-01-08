import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  TrendingUp,
  Sparkles,
  RefreshCw,
  Clock,
  ExternalLink,
  Lightbulb,
  ArrowRight,
  Flame,
  Hash,
  Target,
  Zap,
  FileText,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Trend {
  id: string;
  trend_keyword: string;
  trend_score: number;
  category: string | null;
  source: string;
  tracked_at: string;
  metadata: unknown;
}

interface ContentSuggestion {
  id: string;
  title: string;
  description: string | null;
  content_draft: string | null;
  suggestion_type: string;
  trend_score: number | null;
  status: string;
  source: string | null;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  marketing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  technology: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  social: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  advertising: 'bg-green-500/20 text-green-400 border-green-500/30',
  latam: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  default: 'bg-muted/50 text-muted-foreground border-border/50',
};

const TrendBrainyPage = () => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load trends from last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [trendsResult, suggestionsResult] = await Promise.all([
        supabase
          .from('trend_tracking')
          .select('*')
          .gte('tracked_at', weekAgo.toISOString())
          .order('trend_score', { ascending: false })
          .limit(50),
        supabase
          .from('content_suggestions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20)
      ]);

      if (trendsResult.data) {
        setTrends(trendsResult.data);
      }

      if (suggestionsResult.data) {
        setSuggestions(suggestionsResult.data);
      }
    } catch (error) {
      console.error('Error loading trends:', error);
      toast.error('Error al cargar tendencias');
    } finally {
      setLoading(false);
    }
  };

  const refreshTrends = async () => {
    setRefreshing(true);
    try {
      const response = await supabase.functions.invoke('trend-collector', {
        body: { categories: ['marketing', 'technology', 'social', 'advertising', 'latam'] }
      });

      if (response.error) throw response.error;

      toast.success(`Se recolectaron ${response.data.trendsCollected} tendencias`);
      await loadData();
    } catch (error) {
      console.error('Error refreshing trends:', error);
      toast.error('Error al actualizar tendencias');
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast.success('Copiado al portapapeles');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const categories = ['all', ...new Set(trends.map(t => t.category).filter(Boolean))] as string[];
  
  const filteredTrends = selectedCategory === 'all' 
    ? trends 
    : trends.filter(t => t.category === selectedCategory);

  const topTrends = trends.slice(0, 5);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-red-400';
    if (score >= 5) return 'text-orange-400';
    if (score >= 3) return 'text-yellow-400';
    return 'text-muted-foreground';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ShowcaseHeader />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseSEO 
        title="TrendBrainy | Tendencias y Sugerencias"
        description="Descubre las tendencias más relevantes y recibe sugerencias de contenido automáticas"
      />
      <ShowcaseHeader />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                TrendBrainy
              </h1>
              <p className="text-muted-foreground mt-2">
                Tendencias en tiempo real y sugerencias de contenido con IA
              </p>
            </div>
            <Button 
              onClick={refreshTrends} 
              disabled={refreshing}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar tendencias'}
            </Button>
          </div>
        </motion.div>

        {/* Top Trends Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Top Tendencias
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {topTrends.map((trend, idx) => (
              <Card 
                key={trend.id} 
                className="bg-card/50 border-border/50 hover:border-orange-500/30 transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      #{idx + 1}
                    </Badge>
                    <span className={`text-lg font-bold ${getScoreColor(trend.trend_score)}`}>
                      {trend.trend_score}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-foreground line-clamp-2 mb-2">
                    {trend.trend_keyword}
                  </p>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${categoryColors[trend.category || 'default'] || categoryColors.default}`}
                  >
                    {trend.category || 'General'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="trends" className="gap-2">
              <Hash className="w-4 h-4" />
              Tendencias ({trends.length})
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Sugerencias ({suggestions.length})
            </TabsTrigger>
          </TabsList>

          {/* Trends Tab */}
          <TabsContent value="trends">
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat === 'all' ? 'Todas' : cat}
                </Button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrends.map((trend, idx) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="bg-card/30 border-border/50 hover:border-electric-cyan/30 transition-all h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            trend.trend_score >= 5 ? 'bg-orange-500/20' : 'bg-muted/50'
                          }`}>
                            {trend.trend_score >= 8 ? (
                              <Flame className="w-4 h-4 text-orange-400" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={categoryColors[trend.category || 'default'] || categoryColors.default}
                          >
                            {trend.category || 'General'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className={`w-4 h-4 ${getScoreColor(trend.trend_score)}`} />
                          <span className={`font-bold ${getScoreColor(trend.trend_score)}`}>
                            {trend.trend_score}
                          </span>
                        </div>
                      </div>
                      
                      <p className="font-medium text-foreground mb-2 line-clamp-2">
                        {trend.trend_keyword}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(trend.tracked_at), { addSuffix: true, locale: es })}
                        </span>
                        <span>{trend.source}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredTrends.length === 0 && (
              <Card className="bg-card/30 border-dashed">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No hay tendencias para esta categoría</p>
                  <Button variant="outline" className="mt-4" onClick={refreshTrends}>
                    Buscar tendencias
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions">
            <div className="space-y-4">
              {suggestions.map((suggestion, idx) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="bg-card/50 border-border/50 hover:border-purple-500/30 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {suggestion.suggestion_type}
                              </Badge>
                              {suggestion.trend_score && (
                                <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
                                  Score: {suggestion.trend_score}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(suggestion.created_at), { addSuffix: true, locale: es })}
                        </span>
                      </div>

                      {suggestion.description && (
                        <p className="text-sm text-muted-foreground mb-4">
                          {suggestion.description}
                        </p>
                      )}

                      {suggestion.content_draft && (
                        <div className="bg-muted/30 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Borrador de contenido
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(suggestion.content_draft!, suggestion.id)}
                              className="h-7 px-2"
                            >
                              {copiedId === suggestion.id ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {suggestion.content_draft}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={
                            suggestion.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              : suggestion.status === 'accepted'
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-muted/50 text-muted-foreground'
                          }
                        >
                          {suggestion.status === 'pending' ? 'Pendiente' : suggestion.status === 'accepted' ? 'Aceptada' : suggestion.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="gap-1">
                          Usar sugerencia
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {suggestions.length === 0 && (
                <Card className="bg-card/30 border-dashed">
                  <CardContent className="p-12 text-center">
                    <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No hay sugerencias de contenido aún</p>
                    <p className="text-sm text-muted-foreground">
                      Las sugerencias se generan automáticamente cuando hay tendencias relevantes para tu marca
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-purple-500/10 border-orange-500/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">¿Cómo funciona TrendBrainy?</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    TrendBrainy analiza más de 40 fuentes RSS de marketing, tecnología y redes sociales cada semana. 
                    Identifica las tendencias más relevantes y genera sugerencias de contenido personalizadas para tu marca.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Actualización semanal automática</Badge>
                    <Badge variant="outline" className="text-xs">40+ fuentes RSS</Badge>
                    <Badge variant="outline" className="text-xs">Sugerencias con IA</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TrendBrainyPage;
