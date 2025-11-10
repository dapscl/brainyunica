import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/layout/AppHeader";
import { DynamicBreadcrumb } from "@/components/navigation/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/content/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, ArrowLeft, Calendar, Tag } from "lucide-react";

export default function ContentEditorPage() {
  const { contentId, projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<any>({
    title: "",
    content_type: "post",
    status: "draft",
    content: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (contentId && contentId !== "new") {
      loadContent();
    }
  }, [contentId]);

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("id", contentId)
        .single();

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error("Error loading content:", error);
      toast.error("Error al cargar el contenido");
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const contentData = {
        ...content,
        project_id: projectId,
        created_by: user.id,
      };

      if (contentId === "new") {
        const { error } = await supabase
          .from("content_items")
          .insert(contentData);
        if (error) throw error;
        toast.success("Contenido creado");
        navigate(-1);
      } else {
        const { error } = await supabase
          .from("content_items")
          .update(contentData)
          .eq("id", contentId);
        if (error) throw error;
        toast.success("Contenido actualizado");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Error al guardar");
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
      setNewTag("");
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
              {contentId === "new" ? "Nuevo Contenido" : "Editar Contenido"}
            </h1>
          </div>
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contenido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título</Label>
                  <Input
                    value={content.title}
                    onChange={(e) =>
                      setContent({ ...content, title: e.target.value })
                    }
                    placeholder="Título del contenido"
                  />
                </div>
                <div>
                  <Label>Contenido</Label>
                  <RichTextEditor
                    content={content.content}
                    onChange={(newContent) =>
                      setContent({ ...content, content: newContent })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

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
                    value={content.scheduled_date || ""}
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
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
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
