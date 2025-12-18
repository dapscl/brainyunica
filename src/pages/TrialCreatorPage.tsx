import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { useTrialBrandProfile } from '@/hooks/useTrialBrandProfile';
import { useTrialActivityMetrics } from '@/hooks/useTrialActivityMetrics';
import { supabase } from '@/integrations/supabase/client';
import TrialCreatorPanel from '@/components/trial/TrialCreatorPanel';
import { ArrowLeft, Brain } from 'lucide-react';

const TrialCreatorPage = () => {
  const navigate = useNavigate();
  const { brandProfile, loading: profileLoading } = useTrialBrandProfile();
  const { logActivity } = useTrialActivityMetrics();
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

  if (!isAuthenticated || profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShowcaseHeader />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-electric-cyan flex items-center justify-center animate-pulse">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <p className="text-muted-foreground">Cargando CreatorBrainy...</p>
          </div>
        </div>
      </div>
    );
  }

  // Create brand profile object for the panel
  const panelBrandProfile = {
    brandName: brandProfile?.brand_name || 'Mi Marca',
    tone: brandProfile?.tone || 'profesional',
    style: brandProfile?.style || 'moderno',
    colors: brandProfile?.colors || ['#00D4FF', '#8B5CF6'],
    keywords: brandProfile?.keywords || ['marketing', 'contenido'],
    personality: brandProfile?.personality || 'Innovador y profesional'
  };

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseSEO 
        title="CreatorBrainy | Genera Contenido con IA"
        description="Genera contenido personalizado con tu tono de voz único usando inteligencia artificial"
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

        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-electric-cyan flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-electric-cyan to-purple-accent bg-clip-text text-transparent">
              CreatorBrainy
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Genera contenido único para <span className="text-electric-cyan font-semibold">{panelBrandProfile.brandName}</span> con tu tono de voz personalizado.
          </p>
        </motion.div>

        {/* Full CreatorBrainy Panel */}
        <TrialCreatorPanel 
          brandProfile={panelBrandProfile}
          onGoToDashboard={() => navigate('/trial/dashboard')}
          onActivityLog={logActivity}
        />
      </div>
    </div>
  );
};

export default TrialCreatorPage;
