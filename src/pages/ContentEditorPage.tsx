import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/layout/AppHeader';
import { DynamicBreadcrumb } from '@/components/navigation/DynamicBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/content/RichTextEditor';
import { SocialMediaSelector } from '@/components/content/SocialMediaSelector';
import { ContentPreview } from '@/components/content/ContentPreview';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Save, X, Eye, Tag } from 'lucide-react';

export default function ContentEditorPage() {
  const { contentId, projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>({
    title: '',
    content: '',
    content_type: 'post',
    status: 'draft',
    tags: [],
    post_text: '',
    social_platforms: [],
    media_urls: [],
    publish_status: 'draft',
  });
  const [newTag, setNewTag] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (contentId && contentId !== 'new') {
      loadContent();
    }
  }, [contentId]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('id', contentId)
        .single();

      if (error) throw error;

      if (data) {
        setContent({
          title: data.title || '',
          content: data.content || '',
          content_type: data.content_type || 'post',
          status: data.status || 'draft',
          scheduled_date: data.scheduled_date || '',
          tags: data.tags || [],
          post_text: data.post_text || '',
          social_platforms: Array.isArray(data.social_platforms) ? data.social_platforms : [],
          media_urls: Array.isArray(data.media_urls) ? data.media_urls : [],
          publish_status: data.publish_status || 'draft',
        });
      }
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Error al cargar el contenido');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const contentData = {
        title: content.title,
        content: content.content,
        content_type: content.content_type,
        status: content.status,
        scheduled_date: content.scheduled_date || null,
        tags: content.tags,
        post_text: content.post_text,
        social_platforms: content.social_platforms,
        media_urls: content.media_urls,
        publish_status: content.social_platforms.length > 0 && content.scheduled_date ? 'scheduled' : 'draft',
        project_id: projectId,
        brand_id: projectId,
        created_by: user.id,
      };

      if (contentId === 'new') {
        const { error } = await supabase
          .from('content_items')
          .insert(contentData);
        if (error) throw error;
        toast.success('Contenido creado');
        navigate(-1);
      } else {
        const { error } = await supabase
          .from('content_items')
          .update(contentData)
          .eq('id', contentId);
        if (error) throw error;
        toast.success('Contenido actualizado');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (newTag && !content.tags?.includes(newTag)) {
      setContent({
        ...content,
        tags: [...(content.tags || []), newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setContent({
      ...content,
      tags: content.tags?.filter((t: string) => t !== tag) || [],
    });
  };

  return (
    <>
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">
              {contentId === 'new' ? 'Nuevo Contenido' : 'Editar Contenido'}
            </h1>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Contenido</TabsTrigger>
                <TabsTrigger value="social">Redes Sociales</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contenido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        value={content.title}
                        onChange={(e) => setContent({ ...content, title: e.target.value })}
                        placeholder="Título del contenido"
                      />
                    </div>

                    <div>
                      <Label>Contenido</Label>
                      <RichTextEditor
                        content={content.content}
                        onChange={(newContent) => setContent({ ...content, content: newContent })}
                        placeholder="Escribe tu contenido aquí..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Publicación en Redes Sociales</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <SocialMediaSelector
                      selectedPlatforms={content.social_platforms}
                      onChange={(platforms) => setContent({ ...content, social_platforms: platforms })}
                    />

                    <div>
                      <Label htmlFor="post_text">Texto de Publicación</Label>
                      <Textarea
                        id="post_text"
                        value={content.post_text}
                        onChange={(e) => setContent({ ...content, post_text: e.target.value })}
                        placeholder="Escribe el texto que se publicará en redes sociales..."
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {content.post_text.length} caracteres
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="media_url">URL de Media (opcional)</Label>
                      <Input
                        id="media_url"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value) {
                              setContent({
                                ...content,
                                media_urls: [...content.media_urls, input.value]
                              });
                              input.value = '';
                            }
                          }
                        }}
                      />
                      {content.media_urls.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {content.media_urls.map((url: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              Media {idx + 1}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                  setContent({
                                    ...content,
                                    media_urls: content.media_urls.filter((_: any, i: number) => i !== idx)
                                  });
                                }}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showPreview ? 'Ocultar' : 'Ver'} Vista Previa
                    </Button>

                    {showPreview && content.social_platforms.length > 0 && (
                      <div className="grid gap-4 mt-4">
                        {content.social_platforms.map((platform: string) => (
                          <ContentPreview
                            key={platform}
                            platform={platform}
                            text={content.post_text}
                            mediaUrls={content.media_urls}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={content.content_type}
                    onValueChange={(value) =>
                      setContent({ ...content, content_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="image">Imagen</SelectItem>
                      <SelectItem value="story">Historia</SelectItem>
                      <SelectItem value="article">Artículo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Estado</Label>
                  <Select
                    value={content.status}
                    onValueChange={(value) =>
                      setContent({ ...content, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Borrador</SelectItem>
                      <SelectItem value="review">En Revisión</SelectItem>
                      <SelectItem value="approved">Aprobado</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Archivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fecha Programada</Label>
                  <Input
                    type="datetime-local"
                    value={content.scheduled_date || ''}
                    onChange={(e) =>
                      setContent({ ...content, scheduled_date: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Etiquetas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nueva etiqueta"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button onClick={addTag} variant="outline">
                    Añadir
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {content.tags?.map((tag: string) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
