import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { DynamicBreadcrumb } from '@/components/navigation/DynamicBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, CheckCircle, XCircle, AlertCircle, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  post_text: string;
  scheduled_date: string;
  publish_status: string;
  social_platforms: any;
  published_at: string;
}

const PLATFORM_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
};

export default function PublicationQueuePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('scheduled');

  useEffect(() => {
    if (projectId) {
      loadContent();
    }
  }, [projectId, activeTab]);

  const loadContent = async () => {
    try {
      let query = supabase
        .from('content_items')
        .select('id, title, post_text, scheduled_date, publish_status, social_platforms, published_at')
        .eq('project_id', projectId);

      if (activeTab === 'scheduled') {
        query = query.eq('publish_status', 'scheduled');
      } else if (activeTab === 'published') {
        query = query.eq('publish_status', 'published');
      } else if (activeTab === 'failed') {
        query = query.eq('publish_status', 'failed');
      }

      query = query.order('scheduled_date', { ascending: activeTab === 'scheduled' });

      const { data, error } = await query;

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Error al cargar la cola de publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'published':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      published: 'bg-green-500/10 text-green-500 border-green-500/20',
      failed: 'bg-destructive/10 text-destructive border-destructive/20',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <DynamicBreadcrumb />

        <div>
          <h1 className="text-3xl font-bold mb-2">Cola de Publicaciones</h1>
          <p className="text-muted-foreground">Gestiona tus publicaciones programadas y publicadas</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="scheduled">Programadas</TabsTrigger>
            <TabsTrigger value="published">Publicadas</TabsTrigger>
            <TabsTrigger value="failed">Fallidas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Cargando...</p>
                </CardContent>
              </Card>
            ) : content.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">
                    No hay publicaciones {activeTab === 'scheduled' ? 'programadas' : activeTab === 'published' ? 'publicadas' : 'fallidas'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              content.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate(`/projects/${projectId}/content/${item.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getStatusIcon(item.publish_status)}
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                          {item.post_text && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {item.post_text}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getStatusColor(item.publish_status)}>
                              {item.publish_status}
                            </Badge>
                            {Array.isArray(item.social_platforms) && item.social_platforms.map((platform: string) => {
                              const Icon = PLATFORM_ICONS[platform as keyof typeof PLATFORM_ICONS];
                              return Icon ? (
                                <Badge key={platform} variant="outline" className="gap-1">
                                  <Icon className="h-3 w-3" />
                                  {platform}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {item.scheduled_date && (
                          <p>
                            {format(new Date(item.scheduled_date), "d MMM yyyy, HH:mm", { locale: es })}
                          </p>
                        )}
                        {item.published_at && activeTab === 'published' && (
                          <p className="text-xs mt-1">
                            Publicado: {format(new Date(item.published_at), "d MMM HH:mm", { locale: es })}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
