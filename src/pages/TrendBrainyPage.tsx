import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
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
  CheckCircle2,
  PenTool,
  Building2,
  Globe,
  Plus,
  X,
  Wand2,
  Bell
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
  isRelevant?: boolean; // true = industry trend, false = general trend
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

interface BrandProfile {
  id: string;
  brand_name: string;
  brand_type: string | null;
  keywords: string[] | null;
  analysis: Record<string, unknown> | null;
}

const TrendBrainyPage = () => {
  const navigate = useNavigate();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [trendTypeFilter, setTrendTypeFilter] = useState<'all' | 'industry' | 'general'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [savingKeywords, setSavingKeywords] = useState(false);
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);
  const [previousIndustryCount, setPreviousIndustryCount] = useState<number>(0);

  const handleCreateFromTrend = (trendKeyword: string) => {
    // Store the trend in sessionStorage to pass to CreatorBrainy
    sessionStorage.setItem('trendTopic', trendKeyword);
    navigate('/trial/creator');
    toast.success(`Creando contenido sobre: "${trendKeyword}"`);
  };

  // Extract keywords from brand analysis
  const extractKeywordsFromAnalysis = (analysis: Record<string, any>): string[] => {
    const keywords: Set<string> = new Set();
    
    // Extract from brandIdentity
    if (analysis.brandIdentity) {
      const bi = analysis.brandIdentity;
      if (bi.industry) keywords.add(bi.industry.toLowerCase());
      if (bi.keywords && Array.isArray(bi.keywords)) {
        bi.keywords.forEach((kw: string) => keywords.add(kw.toLowerCase()));
      }
      if (bi.valueProposition) {
        // Extract key terms from value proposition
        const terms = bi.valueProposition.split(/\s+/).filter((t: string) => t.length > 5);
        terms.slice(0, 3).forEach((t: string) => keywords.add(t.toLowerCase().replace(/[.,;:!?]/g, '')));
      }
    }
    
    // Extract from SEO analysis
    if (analysis.webAnalysis?.seo?.keywords && Array.isArray(analysis.webAnalysis.seo.keywords)) {
      analysis.webAnalysis.seo.keywords.slice(0, 5).forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    
    // Extract from copywriting analysis
    if (analysis.webAnalysis?.copyAnalysis?.keyPhrases && Array.isArray(analysis.webAnalysis.copyAnalysis.keyPhrases)) {
      analysis.webAnalysis.copyAnalysis.keyPhrases.slice(0, 3).forEach((kw: string) => keywords.add(kw.toLowerCase()));
    }
    
    // Extract from Instagram analysis
    if (analysis.instagramAnalysis?.topHashtags && Array.isArray(analysis.instagramAnalysis.topHashtags)) {
      analysis.instagramAnalysis.topHashtags.slice(0, 3).forEach((ht: string) => 
        keywords.add(ht.toLowerCase().replace('#', ''))
      );
    }
    
    return Array.from(keywords).filter(k => k.length > 2).slice(0, 10);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load brand profile first
      const { data: profile } = await supabase
        .from('trial_brand_profiles')
        .select('id, brand_name, brand_type, keywords, analysis')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setBrandProfile(profile as BrandProfile);
        // Load custom keywords from profile (stored in keywords array after brand keywords)
        const analysis = profile.analysis as Record<string, any> || {};
        
        // Load custom keywords
        if (analysis.customKeywords && Array.isArray(analysis.customKeywords)) {
          setCustomKeywords(analysis.customKeywords);
        }
        
        // Extract suggested keywords from brand analysis
        const extractedSuggestions = extractKeywordsFromAnalysis(analysis);
        setSuggestedKeywords(extractedSuggestions);
      }

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

  const saveCustomKeywords = async (keywords: string[]) => {
    if (!brandProfile?.id) return;
    
    setSavingKeywords(true);
    try {
      const currentAnalysis = (brandProfile.analysis as Record<string, any>) || {};
      const updatedAnalysis = {
        ...currentAnalysis,
        customKeywords: keywords
      };

      const { error } = await supabase
        .from('trial_brand_profiles')
        .update({ analysis: updatedAnalysis })
        .eq('id', brandProfile.id);

      if (error) throw error;
      
      // Update local state
      setBrandProfile(prev => prev ? {
        ...prev,
        analysis: updatedAnalysis
      } : null);
    } catch (error) {
      console.error('Error saving keywords:', error);
      toast.error('Error al guardar keywords');
    } finally {
      setSavingKeywords(false);
    }
  };

  const addCustomKeyword = async () => {
    const trimmed = newKeyword.trim().toLowerCase();
    if (trimmed && !customKeywords.includes(trimmed)) {
      const newKeywords = [...customKeywords, trimmed];
      setCustomKeywords(newKeywords);
      setNewKeyword('');
      await saveCustomKeywords(newKeywords);
      toast.success(`Keyword "${trimmed}" guardada`);
    }
  };

  const removeCustomKeyword = async (keyword: string) => {
    const newKeywords = customKeywords.filter(k => k !== keyword);
    setCustomKeywords(newKeywords);
    await saveCustomKeywords(newKeywords);
  };

  const refreshTrends = async () => {
    setRefreshing(true);
    try {
      // Extract brand context for personalized trends
      const brandKeywords = Array.isArray(brandProfile?.keywords) 
        ? brandProfile.keywords 
        : [];
      
      // Combine brand keywords with custom keywords
      const allKeywords = [...brandKeywords, ...customKeywords];
      
      // Get industry from analysis if available
      const analysis = brandProfile?.analysis as Record<string, any> || {};
      const brandIndustry = analysis?.brandIdentity?.industry || 
                           analysis?.industry || 
                           'marketing';

      const response = await supabase.functions.invoke('trend-collector', {
        body: { 
          categories: ['marketing', 'technology', 'social', 'advertising', 'latam'],
          brandContext: {
            name: brandProfile?.brand_name || '',
            keywords: allKeywords,
            industry: brandIndustry,
            type: brandProfile?.brand_type || 'website'
          }
        }
      });

      if (response.error) throw response.error;

      // Use the real-time trends from the API response
      if (response.data.topTrends && response.data.topTrends.length > 0) {
        const liveTrends: Trend[] = response.data.topTrends.map((t: any, idx: number) => ({
          id: `live-${idx}-${Date.now()}`,
          trend_keyword: t.keyword,
          trend_score: t.score,
          category: t.category,
          source: t.source,
          tracked_at: new Date().toISOString(),
          metadata: null,
          isRelevant: t.isRelevant || false
        }));
        
        // Merge with existing trends, prioritizing new ones
        setTrends(prev => {
          const newTrends = [...liveTrends];
          prev.forEach(t => {
            if (!newTrends.some(nt => nt.trend_keyword === t.trend_keyword)) {
              newTrends.push(t);
            }
          });
          return newTrends.sort((a, b) => b.trend_score - a.trend_score).slice(0, 50);
        });
        // Check for new industry trends and notify
        const newIndustryTrends = liveTrends.filter(t => t.isRelevant);
        if (newIndustryTrends.length > previousIndustryCount && previousIndustryCount > 0) {
          const newCount = newIndustryTrends.length - previousIndustryCount;
          toast.success(
            `🔔 ${newCount} nueva${newCount > 1 ? 's' : ''} tendencia${newCount > 1 ? 's' : ''} relevante${newCount > 1 ? 's' : ''} para tu industria`,
            {
              description: newIndustryTrends[0]?.trend_keyword,
              duration: 8000,
              action: {
                label: 'Ver',
                onClick: () => setTrendTypeFilter('industry')
              }
            }
          );
        }
        setPreviousIndustryCount(newIndustryTrends.length);
      }

      toast.success(`Se recolectaron ${response.data.trendsCollected} tendencias personalizadas para ${brandProfile?.brand_name || 'tu marca'}`);
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
  
  // Apply both category and trend type filters
  const filteredTrends = trends.filter(t => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesTrendType = trendTypeFilter === 'all' || 
      (trendTypeFilter === 'industry' && t.isRelevant) || 
      (trendTypeFilter === 'general' && !t.isRelevant);
    return matchesCategory && matchesTrendType;
  });

  const topTrends = trends.slice(0, 5);
  
  // Count trends by type
  const industryTrendsCount = trends.filter(t => t.isRelevant).length;
  const generalTrendsCount = trends.filter(t => !t.isRelevant).length;

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

        {/* Custom Keywords Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-card/30 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Hash className="w-5 h-5 text-electric-cyan" />
                Keywords personalizadas
              </CardTitle>
              <CardDescription>
                Agrega palabras clave adicionales para refinar las tendencias de tu industria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-3">
                <Input
                  placeholder="Ej: motos, aventura, outdoor..."
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomKeyword()}
                  className="flex-1 bg-background/50"
                  disabled={savingKeywords}
                />
                <Button onClick={addCustomKeyword} size="sm" className="gap-1" disabled={savingKeywords}>
                  {savingKeywords ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Agregar
                </Button>
              </div>
              {/* Suggested keywords from analysis */}
              {suggestedKeywords.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wand2 className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-muted-foreground">Sugerencias del análisis de tu marca:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestedKeywords
                      .filter(kw => !customKeywords.includes(kw) && !brandProfile?.keywords?.includes(kw))
                      .map((kw, idx) => (
                        <Badge 
                          key={`suggested-${idx}`} 
                          variant="outline" 
                          className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 cursor-pointer hover:bg-yellow-500/20 transition-colors"
                          onClick={async () => {
                            const newKeywords = [...customKeywords, kw];
                            setCustomKeywords(newKeywords);
                            await saveCustomKeywords(newKeywords);
                            toast.success(`Keyword "${kw}" agregada`);
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {kw}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {/* Show brand keywords from profile */}
                {brandProfile?.keywords?.map((kw, idx) => (
                  <Badge 
                    key={`brand-${idx}`} 
                    variant="outline" 
                    className="bg-purple-500/20 text-purple-400 border-purple-500/30"
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    {kw}
                  </Badge>
                ))}
                {/* Show custom keywords with remove option */}
                {customKeywords.map((kw, idx) => (
                  <Badge 
                    key={`custom-${idx}`} 
                    variant="outline" 
                    className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30 pr-1"
                  >
                    {kw}
                    <button
                      onClick={() => removeCustomKeyword(kw)}
                      className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {(!brandProfile?.keywords?.length && !customKeywords.length && !suggestedKeywords.length) && (
                  <span className="text-sm text-muted-foreground">
                    No hay keywords configuradas. Agrega keywords para personalizar tus tendencias.
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Trends Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
                className={`bg-card/50 border-border/50 hover:border-orange-500/30 transition-all ${
                  trend.isRelevant ? 'ring-1 ring-green-500/30' : ''
                }`}
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
                  <div className="flex flex-wrap gap-1">
                    {/* Industry vs General badge */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        trend.isRelevant 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                          : 'bg-muted/50 text-muted-foreground border-border/50'
                      }`}
                    >
                      {trend.isRelevant ? (
                        <><Building2 className="w-3 h-3 mr-1" />Tu industria</>
                      ) : (
                        <><Globe className="w-3 h-3 mr-1" />General</>
                      )}
                    </Badge>
                  </div>
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
            {/* Quick filter by trend type */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm text-muted-foreground">Filtro rápido:</span>
              <div className="flex gap-2">
                <Button
                  variant={trendTypeFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTrendTypeFilter('all')}
                  className="gap-1"
                >
                  Todas ({trends.length})
                </Button>
                <Button
                  variant={trendTypeFilter === 'industry' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTrendTypeFilter('industry')}
                  className={`gap-1 ${trendTypeFilter === 'industry' ? 'bg-green-600 hover:bg-green-700' : 'hover:bg-green-500/10 hover:border-green-500/30'}`}
                >
                  <Building2 className="w-3 h-3" />
                  Tu industria ({industryTrendsCount})
                </Button>
                <Button
                  variant={trendTypeFilter === 'general' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTrendTypeFilter('general')}
                  className="gap-1"
                >
                  <Globe className="w-3 h-3" />
                  General ({generalTrendsCount})
                </Button>
              </div>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize text-xs"
                >
                  {cat === 'all' ? 'Todas categorías' : cat}
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
                  <Card className={`bg-card/30 border-border/50 hover:border-electric-cyan/30 transition-all h-full ${
                    trend.isRelevant ? 'ring-1 ring-green-500/20' : ''
                  }`}>
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
                          {/* Industry vs General badge */}
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              trend.isRelevant 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                : 'bg-muted/50 text-muted-foreground border-border/50'
                            }`}
                          >
                            {trend.isRelevant ? (
                              <><Building2 className="w-3 h-3 mr-1" />Tu industria</>
                            ) : (
                              <><Globe className="w-3 h-3 mr-1" />General</>
                            )}
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

                      {/* Category badge */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs mb-3 ${categoryColors[trend.category || 'default'] || categoryColors.default}`}
                      >
                        {trend.category || 'General'}
                      </Badge>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(trend.tracked_at), { addSuffix: true, locale: es })}
                        </span>
                        <span>{trend.source}</span>
                      </div>

                      {/* Generate Content Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 hover:bg-purple-500/10 hover:border-purple-500/30"
                        onClick={() => handleCreateFromTrend(trend.trend_keyword)}
                      >
                        <PenTool className="w-3 h-3" />
                        Crear contenido
                      </Button>
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
