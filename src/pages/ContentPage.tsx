import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Calendar, Eye } from "lucide-react";
import { toast } from "sonner";

interface ContentPiece {
  id: string;
  title: string;
  content_type: string;
  status: string;
  scheduled_at: string;
  created_at: string;
}

const ContentPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [content, setContent] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, [projectId]);

  const loadContent = async () => {
    try {
      // For now, just return empty array since content_pieces table exists
      setContent([]);
    } catch (error) {
      console.error("Error loading content:", error);
      toast.error("Error al cargar contenido");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: "bg-gray-500",
      pending_approval: "bg-yellow-500",
      approved: "bg-green-500",
      scheduled: "bg-blue-500",
      published: "bg-purple-500",
      rejected: "bg-red-500",
    };
    return colors[status] || "bg-gray-500";
  };

  const getTypeIcon = (type: string) => {
    return <FileText className="h-5 w-5" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Contenido</h1>
            <p className="text-muted-foreground">Gestiona tus piezas de contenido</p>
          </div>
          <Button onClick={() => navigate(`/projects/${projectId}/content/new`)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Contenido
          </Button>
        </div>

        {content.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No tienes contenido</h3>
              <p className="text-muted-foreground mb-6">
                Crea tu primera pieza de contenido para comenzar
              </p>
              <Button onClick={() => navigate(`/projects/${projectId}/content/new`)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Contenido
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((piece) => (
              <Card
                key={piece.id}
                className="hover:shadow-glow transition-smooth cursor-pointer"
                onClick={() => navigate(`/content/${piece.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                        {getTypeIcon(piece.content_type)}
                      </div>
                      <CardTitle className="text-lg">{piece.title}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(piece.status)}>
                      {piece.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardDescription>
                    Tipo: {piece.content_type.replace("_", " ")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {piece.scheduled_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(piece.scheduled_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/content/${piece.id}`);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
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

export default ContentPage;