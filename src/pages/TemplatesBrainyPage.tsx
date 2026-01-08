import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { supabase } from '@/integrations/supabase/client';
import ContentTemplatesPanel, { ContentTemplate } from '@/components/templates/ContentTemplatesPanel';
import { ArrowLeft, LayoutTemplate } from 'lucide-react';
import { toast } from 'sonner';

const TemplatesBrainyPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/trial');
        return;
      }
      setIsAuthenticated(true);
    };

    checkAuth();
  }, [navigate]);

  const handleGenerateFromTemplate = (template: ContentTemplate, topic: string) => {
    // Store template and topic in sessionStorage for CreatorBrainy
    sessionStorage.setItem('templateStructure', template.structure);
    sessionStorage.setItem('templateName', template.name);
    sessionStorage.setItem('trendTopic', topic);
    navigate('/trial/creator');
    toast.success(`Generando ${template.name} sobre: "${topic}"`);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <ShowcaseHeader />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
              <LayoutTemplate className="w-8 h-8 text-white" />
            </div>
            <p className="text-muted-foreground">Cargando Templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseSEO 
        title="Templates | Plantillas de Contenido"
        description="Plantillas reutilizables para crear contenido de manera rápida y efectiva"
      />
      <ShowcaseHeader />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate('/trial/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Dashboard
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <LayoutTemplate className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Templates de Contenido
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estructuras probadas para crear contenido de alto impacto en segundos.
          </p>
        </motion.div>

        {/* Templates Panel */}
        <ContentTemplatesPanel 
          onGenerateFromTemplate={handleGenerateFromTemplate}
        />
      </div>
    </div>
  );
};

export default TemplatesBrainyPage;
