import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Calendar, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Lightbox from '@/components/gallery/Lightbox';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const GalleryPage = () => {
  const { orgId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  // Filter and sort media files
  const filteredAndSortedMedia = mediaFiles
    ?.filter((file) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        file.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;

      // Type filter
      const matchesType = typeFilter === 'all' || file.file_type === typeFilter;

      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date-asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'name-asc':
          return a.file_name.localeCompare(b.file_name);
        case 'name-desc':
          return b.file_name.localeCompare(a.file_name);
        case 'size-desc':
          return (b.file_size || 0) - (a.file_size || 0);
        case 'size-asc':
          return (a.file_size || 0) - (b.file_size || 0);
        default:
          return 0;
      }
    });

  // Get unique categories and types
  const categories = Array.from(new Set(mediaFiles?.map((f) => f.category).filter(Boolean))) as string[];
  const fileTypes = Array.from(new Set(mediaFiles?.map((f) => f.file_type).filter(Boolean))) as string[];

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setTypeFilter('all');
    setSortBy('date-desc');
  };

  const hasActiveFilters = searchQuery !== '' || categoryFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'date-desc';

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

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, descripción o tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de archivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {fileTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Más recientes</SelectItem>
                  <SelectItem value="date-asc">Más antiguos</SelectItem>
                  <SelectItem value="name-asc">Nombre (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Nombre (Z-A)</SelectItem>
                  <SelectItem value="size-desc">Tamaño (Mayor)</SelectItem>
                  <SelectItem value="size-asc">Tamaño (Menor)</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Limpiar filtros
                </Button>
              )}
            </div>

            {/* Results count */}
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredAndSortedMedia?.length || 0} de {mediaFiles?.length || 0} archivos
            </div>
          </div>
        </CardContent>
      </Card>

      {!filteredAndSortedMedia || filteredAndSortedMedia.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Eye className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {hasActiveFilters ? 'No se encontraron resultados' : 'No hay archivos'}
            </h3>
            <p className="text-muted-foreground text-center">
              {hasActiveFilters
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no se han subido archivos a la biblioteca de medios'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMedia.map((file, index) => (
            <Card key={file.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <AspectRatio ratio={16 / 9} className="cursor-pointer" onClick={() => handleImageClick(index)}>
                  <img
                    src={file.file_url}
                    alt={file.description || file.file_name}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(index);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
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

      {/* Lightbox */}
      <Lightbox
        images={filteredAndSortedMedia || []}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default GalleryPage;
