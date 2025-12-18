import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { supabase } from '@/integrations/supabase/client';
import TrialCreatorPanel from '@/components/trial/TrialCreatorPanel';
import { ArrowLeft, Brain } from 'lucide-react';

interface BrandProfile {
  brandName: string;
  tone: string;
  style: string;
  colors: string[];
  keywords: string[];
  personality: string;
}

const TrialCreatorPage = () => {
  const navigate = useNavigate();
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/trial');
        return;
      }

      // Load brand profile from user metadata or localStorage
      const storedProfile = localStorage.getItem('trialBrandProfile');
      if (storedProfile) {
        setBrandProfile(JSON.parse(storedProfile));
      } else if (user.user_metadata?.brand_name) {
        setBrandProfile({
          brandName: user.user_metadata.brand_name,
          tone: user.user_metadata.brand_tone || 'profesional',
          style: user.user_metadata.brand_style || 'moderno',
          colors: user.user_metadata.brand_colors || ['#00D4FF', '#8B5CF6'],
          keywords: user.user_metadata.brand_keywords || ['marketing', 'contenido'],
          personality: user.user_metadata.brand_personality || 'Innovador y profesional'
        });
      } else {
        // Default brand profile for testing
        setBrandProfile({
          brandName: 'Mi Marca',
          tone: 'profesional',
          style: 'moderno',
          colors: ['#00D4FF', '#8B5CF6'],
          keywords: ['marketing', 'contenido', 'digital'],
          personality: 'Innovador y profesional'
        });
      }
      setLoading(false);
    };

    loadUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-electric-cyan flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-muted-foreground">Cargando CreatorBrainy...</p>
        </div>
      </div>
    );
  }

  if (!brandProfile) {
    return null;
  }

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
            Genera contenido único para <span className="text-electric-cyan font-semibold">{brandProfile.brandName}</span> con tu tono de voz personalizado.
          </p>
        </motion.div>

        {/* Full CreatorBrainy Panel */}
        <TrialCreatorPanel 
          brandProfile={brandProfile}
          onGoToDashboard={() => navigate('/trial/dashboard')}
        />
      </div>
    </div>
  );
};

export default TrialCreatorPage;
