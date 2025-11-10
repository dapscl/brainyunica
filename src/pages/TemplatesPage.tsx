import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { AppHeader } from "@/components/layout/AppHeader";
import { DynamicBreadcrumb } from "@/components/navigation/DynamicBreadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, Edit, Trash2 } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: string;
  content: string;
  platform: string | null;
  tags: string[] | null;
  usage_count: number;
  created_at: string;
}

export default function TemplatesPage() {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "general",
    content: "",
    platform: "",
    tags: "",
  });

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates", orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_templates")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Template[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) throw new Error("No session");

      const { error } = await supabase.from("content_templates").insert({
        organization_id: orgId,
        created_by: session.session.user.id,
        name: data.name,
        description: data.description || null,
        category: data.category,
        content: data.content,
        platform: data.platform || null,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", orgId] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: "Plantilla creada correctamente" });
    },
    onError: (error) => {
      toast({ title: "Error al crear plantilla", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("content_templates")
        .update({
          name: data.name,
          description: data.description || null,
          category: data.category,
          content: data.content,
          platform: data.platform || null,
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", orgId] });
      setEditingTemplate(null);
      resetForm();
      toast({ title: "Plantilla actualizada correctamente" });
    },
    onError: (error) => {
      toast({ title: "Error al actualizar plantilla", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("content_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", orgId] });
      toast({ title: "Plantilla eliminada correctamente" });
    },
    onError: (error) => {
      toast({ title: "Error al eliminar plantilla", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "general",
      content: "",
      platform: "",
      tags: "",
    });
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description || "",
      category: template.category,
      content: template.content,
      platform: template.platform || "",
      tags: template.tags?.join(", ") || "",
    });
  };

  const handleSubmit = () => {
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!orgId) {
    navigate("/organizations");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb />
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t("templates.title")}</h1>
            <p className="text-muted-foreground">
              Crea y gestiona plantillas reutilizables de contenido
            </p>
          </div>
          <Dialog open={isCreateDialogOpen || !!editingTemplate} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) {
              setEditingTemplate(null);
              resetForm();
            }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t("templates.create")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? t("templates.edit") : t("templates.create")}
                </DialogTitle>
                <DialogDescription>
                  {editingTemplate ? "Edita los datos de la plantilla" : "Crea una nueva plantilla de contenido reutilizable"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">{t("templates.name")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Anuncio de producto"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">{t("common.description")}</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción breve"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">{t("templates.category")}</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="social">Redes Sociales</SelectItem>
                        <SelectItem value="announcement">Anuncio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="platform">{t("templates.platform")}</Label>
                    <Input
                      id="platform"
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                      placeholder="Ej: Instagram, Twitter"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">{t("templates.content")}</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Contenido de la plantilla. Usa {{variable}} para variables dinámicas"
                    rows={6}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">{t("templates.tags")}</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Etiquetas separadas por comas"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsCreateDialogOpen(false);
                  setEditingTemplate(null);
                  resetForm();
                }}>
                  {t("common.cancel")}
                </Button>
                <Button onClick={handleSubmit}>
                  {t("common.save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t("common.filter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="social">Redes Sociales</SelectItem>
              <SelectItem value="announcement">Anuncio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Cargando plantillas...</div>
        ) : !filteredTemplates || filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay plantillas</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crea tu primera plantilla para comenzar
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Plantilla
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      {template.description && (
                        <CardDescription>{template.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">{template.category}</Badge>
                      {template.platform && (
                        <Badge variant="secondary">{template.platform}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {template.content}
                    </p>
                    {template.tags && template.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {template.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground">
                      Usada {template.usage_count} {template.usage_count === 1 ? "vez" : "veces"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
