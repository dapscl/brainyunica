import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import InspirationLibrary from '@/components/showcase/InspirationLibrary';

const ShowcaseInspirationLibraryPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/brands/${slug}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Biblioteca de Inspiración</h1>
              <p className="text-muted-foreground mt-1">
                Ads ganadores de la industria con análisis detallado de rendimiento
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <InspirationLibrary />
      </div>
    </div>
  );
};

export default ShowcaseInspirationLibraryPage;
