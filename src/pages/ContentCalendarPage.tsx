import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { DynamicBreadcrumb } from '@/components/navigation/DynamicBreadcrumb';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ContentItem {
  id: string;
  title: string;
  scheduled_date: string;
  publish_status: string;
  social_platforms: any;
}

export default function ContentCalendarPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadContent();
    }
  }, [projectId, selectedDate]);

  const loadContent = async () => {
    try {
      const start = startOfMonth(selectedDate);
      const end = endOfMonth(selectedDate);

      const { data, error } = await supabase
        .from('content_items')
        .select('id, title, scheduled_date, publish_status, social_platforms')
        .eq('project_id', projectId)
        .gte('scheduled_date', start.toISOString())
        .lte('scheduled_date', end.toISOString())
        .order('scheduled_date', { ascending: true });

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Error al cargar el contenido');
    } finally {
      setLoading(false);
    }
  };

  const getContentForDate = (date: Date) => {
    return content.filter(item => 
      item.scheduled_date && isSameDay(new Date(item.scheduled_date), date)
    );
  };

  const selectedDateContent = getContentForDate(selectedDate);

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-muted text-muted-foreground',
      scheduled: 'bg-blue-500/10 text-blue-500',
      published: 'bg-green-500/10 text-green-500',
      failed: 'bg-destructive/10 text-destructive',
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <DynamicBreadcrumb />

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calendario de Contenido</h1>
            <p className="text-muted-foreground">Planifica y gestiona tus publicaciones</p>
          </div>
          <Button onClick={() => navigate(`/projects/${projectId}/content/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Contenido
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(selectedDate, 'MMMM yyyy', { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={es}
                className="rounded-lg border"
                modifiers={{
                  hasContent: (date) => getContentForDate(date).length > 0
                }}
                modifiersClassNames={{
                  hasContent: 'bg-primary/10 font-bold'
                }}
              />
            </CardContent>
          </Card>

          {/* Selected date content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {format(selectedDate, "d 'de' MMMM", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">Cargando...</p>
              ) : selectedDateContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No hay contenido programado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateContent.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => navigate(`/projects/${projectId}/content/${item.id}`)}
                    >
                      <CardContent className="p-4">
                        <p className="font-medium mb-2">{item.title}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getStatusColor(item.publish_status)}>
                            {item.publish_status}
                          </Badge>
                          {Array.isArray(item.social_platforms) && item.social_platforms.map((platform: string) => (
                            <Badge key={platform} variant="secondary" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
