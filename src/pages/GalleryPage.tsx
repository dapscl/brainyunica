import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const GalleryPage = () => {
  const { orgId } = useParams();

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['media-library', orgId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .eq('organization_id', orgId!)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!orgId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Galería de Medios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Galería de Medios</h1>
        <p className="text-muted-foreground">
          Explora todas las imágenes y archivos de tu organización
        </p>
      </div>

      {!mediaFiles || mediaFiles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay archivos</h3>
            <p className="text-muted-foreground text-center">
              Aún no se han subido archivos a la biblioteca de medios
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaFiles.map((file) => (
            <Card key={file.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={file.file_url}
                    alt={file.description || file.file_name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(file.file_url, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = file.file_url;
                        link.download = file.file_name;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </AspectRatio>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold truncate" title={file.file_name}>
                      {file.file_name}
                    </h3>
                    {file.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {file.description}
                      </p>
                    )}
                  </div>

                  {file.category && (
                    <Badge variant="secondary" className="capitalize">
                      {file.category}
                    </Badge>
                  )}

                  {file.tags && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {file.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{file.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(new Date(file.created_at), 'dd MMM yyyy', { locale: es })}
                      </span>
                    </div>
                    {file.width && file.height && (
                      <div>
                        {file.width} × {file.height}
                      </div>
                    )}
                    {file.file_size && (
                      <div>
                        {(file.file_size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
