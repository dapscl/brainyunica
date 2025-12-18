import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  History, 
  Copy, 
  Sparkles, 
  Lightbulb, 
  RefreshCw, 
  Languages,
  Clock,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Brain
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityLog {
  id: string;
  activity_type: string;
  content_preview: string;
  metadata: any;
  created_at: string;
}

interface ContentHistoryPanelProps {
  onSelectContent?: (content: string) => void;
  onClose?: () => void;
}

const activityIcons: Record<string, React.ReactNode> = {
  'copy_generated': <Sparkles className="w-4 h-4" />,
  'ideas_generated': <Lightbulb className="w-4 h-4" />,
  'variants_generated': <RefreshCw className="w-4 h-4" />,
  'improved': <TrendingUp className="w-4 h-4" />,
  'translated': <Languages className="w-4 h-4" />,
};

const activityLabels: Record<string, string> = {
  'copy_generated': 'Copy',
  'ideas_generated': 'Ideas',
  'variants_generated': 'Variantes',
  'improved': 'Mejora',
  'translated': 'Traducción',
};

const activityColors: Record<string, string> = {
  'copy_generated': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'ideas_generated': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'variants_generated': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'improved': 'bg-green-500/20 text-green-400 border-green-500/30',
  'translated': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const ContentHistoryPanel = ({ onSelectContent, onClose }: ContentHistoryPanelProps) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('trial_activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Error cargando historial');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Contenido copiado al portapapeles');
  };

  const handleReuseContent = (content: string) => {
    onSelectContent?.(content);
    toast.success('Contenido seleccionado para reutilizar');
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.activity_type === filter);

  const renderAnalysis = (metadata: any) => {
    if (!metadata?.analysis) return null;

    const { strengths, improvements, opportunities } = metadata.analysis;

    return (
      <div className="mt-4 space-y-3">
        {strengths && strengths.length > 0 && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <h5 className="text-sm font-semibold text-green-400 flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Fortalezas
            </h5>
            <ul className="space-y-1">
              {strengths.map((s: string, i: number) => (
                <li key={i} className="text-xs text-muted-foreground">• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {improvements && improvements.length > 0 && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <h5 className="text-sm font-semibold text-yellow-400 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Áreas de Mejora
            </h5>
            <ul className="space-y-1">
              {improvements.map((s: string, i: number) => (
                <li key={i} className="text-xs text-muted-foreground">• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {opportunities && opportunities.length > 0 && (
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <h5 className="text-sm font-semibold text-cyan-400 flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" />
              Oportunidades
            </h5>
            <ul className="space-y-1">
              {opportunities.map((s: string, i: number) => (
                <li key={i} className="text-xs text-muted-foreground">• {s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderJulianVersion = (metadata: any) => {
    if (!metadata?.julianKoenigVersion) return null;

    const jk = metadata.julianKoenigVersion;

    return (
      <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30">
        <h5 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4" />
          Versión Julian Koenig
        </h5>
        
        {jk.fullCopy && (
          <p className="text-sm text-foreground italic mb-3">"{jk.fullCopy}"</p>
        )}
        
        {jk.content && (
          <p className="text-sm text-foreground italic mb-3">"{jk.content}"</p>
        )}

        {jk.variant && (
          <p className="text-sm text-foreground italic mb-3">"{jk.variant}"</p>
        )}

        {jk.bigIdea && (
          <div className="mb-2">
            <span className="text-xs text-amber-400">Gran Idea: </span>
            <span className="text-sm text-foreground">{jk.bigIdea}</span>
          </div>
        )}

        {jk.headline && (
          <div className="mb-2">
            <span className="text-xs text-amber-400">Titular: </span>
            <span className="text-sm text-foreground font-semibold">"{jk.headline}"</span>
          </div>
        )}

        {jk.philosophy && (
          <p className="text-xs text-muted-foreground mt-2 italic">
            💡 {jk.philosophy}
          </p>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-electric-cyan" />
            <span className="text-muted-foreground">Cargando historial...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-electric-cyan/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <History className="w-5 h-5 text-electric-cyan" />
            Historial de Contenidos
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          {Object.entries(activityLabels).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key)}
              className="gap-1"
            >
              {activityIcons[key]}
              {label}
            </Button>
          ))}
        </div>

        {/* History List */}
        <ScrollArea className="h-[500px] pr-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay contenidos en el historial</p>
              <p className="text-sm">Los contenidos que generes aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredLogs.map((log, idx) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="bg-background/50 border-border/50 hover:border-electric-cyan/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={activityColors[log.activity_type] || 'bg-muted'}>
                                {activityIcons[log.activity_type]}
                                <span className="ml-1">{activityLabels[log.activity_type] || log.activity_type}</span>
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(log.created_at), "d MMM, HH:mm", { locale: es })}
                              </span>
                            </div>

                            <p className="text-sm text-foreground line-clamp-2">
                              {log.content_preview || 'Sin vista previa'}
                            </p>

                            {log.metadata?.platform && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                {log.metadata.platform}
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                            >
                              {expandedId === log.id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {expandedId === log.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border/50"
                            >
                              {/* Full Content */}
                              {log.metadata?.fullContent && (
                                <div className="mb-4">
                                  <h5 className="text-sm font-semibold mb-2">Contenido Completo</h5>
                                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                                    {log.metadata.fullContent}
                                  </p>
                                </div>
                              )}

                              {/* Julian Koenig Version */}
                              {renderJulianVersion(log.metadata)}

                              {/* Analysis */}
                              {renderAnalysis(log.metadata)}

                              {/* Actions */}
                              <div className="flex gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopyContent(log.metadata?.fullContent || log.content_preview)}
                                  className="gap-1"
                                >
                                  <Copy className="w-3 h-3" />
                                  Copiar
                                </Button>
                                {onSelectContent && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleReuseContent(log.metadata?.fullContent || log.content_preview)}
                                    className="gap-1 bg-electric-cyan hover:bg-electric-cyan/80"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    Reutilizar
                                  </Button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ContentHistoryPanel;
