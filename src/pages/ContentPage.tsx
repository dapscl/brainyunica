import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { DynamicBreadcrumb } from '@/components/navigation/DynamicBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, FileText, Calendar, List } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ContentPiece {
  id: string;
  title: string;
  content_type: string;
  status: string;
  scheduled_date: string;
  publish_status: string;
  social_platforms: any;
}

export default function ContentPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadContent();
    }
  }, [projectId]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('id, title, content_type, status, scheduled_date, publish_status, social_platforms')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-muted text-muted-foreground',
      review: 'bg-yellow-500/10 text-yellow-500',
      approved: 'bg-green-500/10 text-green-500',
      published: 'bg-blue-500/10 text-blue-500',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  const getTypeIcon = () => {
    return FileText;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="container mx-auto px-4 py-8">
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <DynamicBreadcrumb />

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contenido</h1>
            <p className="text-muted-foreground">Gestiona todo tu contenido en un solo lugar</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/projects/${projectId}/calendar`)}>
              <Calendar className="h-4 w-4 mr-2" />
              Calendario
            </Button>
            <Button variant="outline" onClick={() => navigate(`/projects/${projectId}/queue`)}>
              <List className="h-4 w-4 mr-2" />
              Cola
            </Button>
            <Button onClick={() => navigate(`/projects/${projectId}/content/new`)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Contenido
            </Button>
          </div>
        </div>

        {content.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground mb-4">No hay contenido aún</p>
              <Button onClick={() => navigate(`/projects/${projectId}/content/new`)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primer Contenido
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item) => {
              const Icon = getTypeIcon();
              return (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => navigate(`/projects/${projectId}/content/${item.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.publish_status && item.publish_status !== 'draft' && (
                          <Badge variant="outline">{item.publish_status}</Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="capitalize">{item.content_type}</span>
                      </div>
                      {item.scheduled_date && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(item.scheduled_date), 'PPp', { locale: es })}</span>
                        </div>
                      )}
                      {Array.isArray(item.social_platforms) && item.social_platforms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.social_platforms.map((platform: string) => (
                            <Badge key={platform} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
