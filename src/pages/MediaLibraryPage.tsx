import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/layout/AppHeader";
import { DynamicBreadcrumb } from "@/components/navigation/DynamicBreadcrumb";
import { SearchBar } from "@/components/search/SearchBar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageIcon, Video, FileText, Upload, Trash2, Tag, Image as ImageIconLucide } from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  tags: string[];
  description: string | null;
  category: string | null;
  created_at: string;
  width?: number;
  height?: number;
}

const MediaLibraryPage = () => {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    description: "",
    category: "",
    tags: [] as string[],
    tagInput: "",
  });

  useEffect(() => {
    if (orgId) loadMedia();
  }, [orgId]);

  const loadMedia = async () => {
    try {
      if (!orgId) return;

      const { data, error } = await supabase
        .from("media_library")
        .select("*")
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error("Error loading media:", error);
      toast.error("Error al cargar medios");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData({ ...uploadData, file });
    }
  };

  const handleUpload = async () => {
    if (!uploadData.file || !orgId) {
      toast.error("Selecciona un archivo");
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated");

      // Upload file to storage
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${orgId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media-library")
        .upload(filePath, uploadData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("media-library")
        .getPublicUrl(filePath);

      // Determine file type
      const mimeType = uploadData.file.type;
      let fileType = "other";
      if (mimeType.startsWith("image/")) fileType = "image";
      else if (mimeType.startsWith("video/")) fileType = "video";
      else if (mimeType.includes("pdf") || mimeType.includes("document")) fileType = "document";

      // Get image dimensions if image
      let width, height;
      if (fileType === "image") {
        const dimensions = await getImageDimensions(uploadData.file);
        width = dimensions.width;
        height = dimensions.height;
      }

      // Insert metadata into database
      const { error: dbError } = await supabase
        .from("media_library")
        .insert({
          organization_id: orgId,
          uploaded_by: user.id,
          file_name: uploadData.file.name,
          file_url: publicUrl,
          file_type: fileType,
          file_size: uploadData.file.size,
          mime_type: mimeType,
          width,
          height,
          tags: uploadData.tags,
          description: uploadData.description || null,
          category: uploadData.category || null,
        });

      if (dbError) throw dbError;

      toast.success("Archivo subido exitosamente");
      setUploadDialogOpen(false);
      setUploadData({
        file: null,
        description: "",
        category: "",
        tags: [],
        tagInput: "",
      });
      loadMedia();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error al subir archivo");
    } finally {
      setUploading(false);
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDelete = async (mediaId: string, fileUrl: string) => {
    if (!confirm("¿Estás seguro de eliminar este archivo?")) return;

    try {
      // Extract file path from URL
      const urlParts = fileUrl.split('/media-library/');
      if (urlParts.length === 2) {
        const filePath = urlParts[1];
        await supabase.storage.from("media-library").remove([filePath]);
      }

      const { error } = await supabase
        .from("media_library")
        .delete()
        .eq("id", mediaId);

      if (error) throw error;

      toast.success("Archivo eliminado");
      loadMedia();
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("Error al eliminar archivo");
    }
  };

  const addTag = () => {
    if (uploadData.tagInput.trim()) {
      setUploadData({
        ...uploadData,
        tags: [...uploadData.tags, uploadData.tagInput.trim()],
        tagInput: "",
      });
    }
  };

  const removeTag = (tag: string) => {
    setUploadData({
      ...uploadData,
      tags: uploadData.tags.filter(t => t !== tag),
    });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image": return <ImageIcon className="h-6 w-6" />;
      case "video": return <Video className="h-6 w-6" />;
      case "document": return <FileText className="h-6 w-6" />;
      default: return <FileText className="h-6 w-6" />;
    }
  };

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === "all" || item.file_type === filterType;
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const categories = Array.from(new Set(media.map(m => m.category).filter(Boolean))) as string[];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-4 py-8">
        <DynamicBreadcrumb />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <ImageIconLucide className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Biblioteca de Medios</h1>
              <p className="text-muted-foreground">Gestiona tus archivos multimedia</p>
            </div>
          </div>

          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Subir Archivo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Archivo *</Label>
                  <Input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    placeholder="Describe el archivo..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Input
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    placeholder="Ej: Logos, Banners, Productos..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Etiquetas</Label>
                  <div className="flex gap-2">
                    <Input
                      value={uploadData.tagInput}
                      onChange={(e) => setUploadData({ ...uploadData, tagInput: e.target.value })}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="Agregar etiqueta..."
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={handleUpload} disabled={uploading || !uploadData.file} className="w-full">
                  {uploading ? "Subiendo..." : "Subir"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar archivos..."
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="image">Imágenes</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="document">Documentos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredMedia.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ImageIconLucide className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No hay archivos</h3>
              <p className="text-muted-foreground mb-4">
                Sube tu primer archivo multimedia
              </p>
              <Button onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Subir Archivo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="hover:shadow-glow transition-smooth overflow-hidden">
                <div className="relative aspect-square bg-muted flex items-center justify-center">
                  {item.file_type === "image" ? (
                    <img src={item.file_url} alt={item.file_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-muted-foreground">
                      {getFileIcon(item.file_type)}
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-sm truncate">{item.file_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.file_type}</Badge>
                    {item.category && <Badge variant="secondary">{item.category}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                  )}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(item.file_url, '_blank')}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.file_url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibraryPage;
