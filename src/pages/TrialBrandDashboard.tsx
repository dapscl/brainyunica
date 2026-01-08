import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShowcaseHeader } from '@/components/showcase/ShowcaseHeader';
import { ShowcaseSEO } from '@/components/showcase/ShowcaseSEO';
import { BrandConfigPanel } from '@/components/trial/BrandConfigPanel';
import { useTrialBrandProfile } from '@/hooks/useTrialBrandProfile';
import { useTrialActivityMetrics } from '@/hooks/useTrialActivityMetrics';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import UsageAnalyticsPanel from '@/components/dashboard/UsageAnalyticsPanel';
import UpgradeModal from '@/components/trial/UpgradeModal';
import {
  Sparkles,
  Calendar,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Brain,
  Lock,
  ArrowRight,
  Settings,
  Clock,
  CheckCircle2,
  Star,
  Zap,
  FileText,
  Megaphone,
  Crown,
  Video,
  Lightbulb,
  RefreshCw,
  Languages,
  LayoutTemplate
} from 'lucide-react';

interface BrainyModule {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  isActive: boolean;
  route?: string;
  features: string[];
  comingSoon?: boolean;
}

const TrialBrandDashboard = () => {
  const navigate = useNavigate();
  const { brandProfile, loading: profileLoading, saveProfile, loadProfile } = useTrialBrandProfile();
  const { metrics, loading: metricsLoading } = useTrialActivityMetrics();
  const [daysRemaining, setDaysRemaining] = useState(45);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/trial');
        return;
      }
      
      // Calculate trial days remaining
      const createdAt = new Date(user.created_at);
      const trialEnd = new Date(createdAt.getTime() + 45 * 24 * 60 * 60 * 1000);
      const now = new Date();
      const remaining = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      setDaysRemaining(remaining);
    };

    checkAuth();
  }, [navigate]);

  const brainyModules: BrainyModule[] = [
    {
      id: 'creator',
      name: 'CreatorBrainy',
      description: 'Genera contenido con tu tono de voz único. Copys, ideas y variantes para todas tus redes.',
      icon: <Sparkles className="w-8 h-8" />,
      color: 'text-purple-400',
      gradient: 'from-purple-500 to-pink-500',
      isActive: true,
      route: '/trial/creator',
      features: ['Generación de copys', 'Ideas de contenido', 'Variantes A/B', 'Mejora de textos', 'Traducciones']
    },
    {
      id: 'templates',
      name: 'TemplatesBrainy',
      description: 'Plantillas reutilizables para diferentes formatos de contenido.',
      icon: <LayoutTemplate className="w-8 h-8" />,
      color: 'text-indigo-400',
      gradient: 'from-indigo-500 to-purple-500',
      isActive: true,
      route: '/trial/templates',
      features: ['Posts', 'Stories', 'Reels', 'Carruseles', 'Hilos']
    },
    {
      id: 'calendar',
      name: 'CalendarBrainy',
      description: 'Planifica y programa tu contenido. Vista mensual con drag & drop y programación inteligente.',
      icon: <Calendar className="w-8 h-8" />,
      color: 'text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
      isActive: true,
      route: '/trial/calendar',
      features: ['Calendario visual', 'Drag & drop', 'Vista semana/mes', 'Programación automática', 'Cola de publicación']
    },
    {
      id: 'trends',
      name: 'TrendBrainy',
      description: 'Detecta tendencias relevantes para tu marca y genera contenido viral.',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'text-orange-400',
      gradient: 'from-orange-500 to-red-500',
      isActive: true,
      route: '/trial/trends',
      features: ['Trending topics', 'Análisis de competencia', 'Sugerencias virales', 'Alertas de tendencias']
    },
    {
      id: 'ads',
      name: 'AdBrainy',
      description: 'Optimiza tus campañas publicitarias con IA. ROAS predicho y sugerencias automáticas.',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'text-cyan-400',
      gradient: 'from-cyan-500 to-green-500',
      isActive: false,
      comingSoon: true,
      features: ['Meta Ads', 'Google Ads', 'LinkedIn Ads', 'Optimización ROAS', 'Presupuesto inteligente']
    },
    {
      id: 'chat',
      name: 'ChatBrainy',
      description: 'Automatiza respuestas en WhatsApp, Instagram y Facebook con tu tono de voz.',
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'text-green-400',
      gradient: 'from-green-500 to-emerald-500',
      isActive: false,
      comingSoon: true,
      features: ['WhatsApp Business', 'Instagram DM', 'Facebook Messenger', 'Respuestas con IA']
    },
    {
      id: 'video',
      name: 'VideoBrainy',
      description: 'Genera videos cortos automáticos para Reels, TikTok y Shorts.',
      icon: <Video className="w-8 h-8" />,
      color: 'text-red-400',
      gradient: 'from-red-500 to-pink-500',
      isActive: false,
      comingSoon: true,
      features: ['Reels automáticos', 'TikTok clips', 'YouTube Shorts', 'Edición con IA']
    }
  ];

  const quickStats = [
    { 
      label: 'Contenidos generados', 
      value: metrics.totalContents.toString(), 
      icon: <FileText className="w-5 h-5" />,
      color: 'text-purple-400'
    },
    { 
      label: 'Copys creados', 
      value: metrics.copiesGenerated.toString(), 
      icon: <Sparkles className="w-5 h-5" />,
      color: 'text-pink-400'
    },
    { 
      label: 'Ideas generadas', 
      value: metrics.ideasGenerated.toString(), 
      icon: <Lightbulb className="w-5 h-5" />,
      color: 'text-yellow-400'
    },
    { 
      label: 'Actividad hoy', 
      value: metrics.todayActivity.toString(), 
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-green-400'
    }
  ];

  const handleModuleClick = (module: BrainyModule) => {
    if (module.isActive && module.route) {
      navigate(module.route);
    } else {
      toast.info(`${module.name} estará disponible pronto. ¡Estamos trabajando en ello!`);
    }
  };

  const handleUpgradeClick = () => {
    setShowUpgradeModal(true);
  };

  const handleSaveBrandConfig = async (updates: Partial<typeof brandProfile>) => {
    if (!brandProfile) return;
    
    await saveProfile({
      ...brandProfile,
      ...updates,
    } as any);
    
    await loadProfile();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShowcaseHeader />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ShowcaseSEO 
        title="Dashboard | Brainy Trial"
        description="Tu centro de control para todas las herramientas de Brainy"
      />
      <ShowcaseHeader />

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Trial Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-electric-cyan/10 via-purple-accent/10 to-electric-cyan/10 border-electric-cyan/30">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-electric-cyan to-purple-accent flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Trial Premium Activo</p>
                  <p className="text-sm text-muted-foreground">
                    Te quedan <span className="text-electric-cyan font-bold">{daysRemaining} días</span> de prueba gratuita
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <Progress value={(45 - daysRemaining) / 45 * 100} className="w-32 h-2" />
                </div>
                <Button 
                  variant="default"
                  className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90"
                  onClick={handleUpgradeClick}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 rounded-2xl shadow-glow-cyan">
                {brandProfile?.logo_url ? (
                  <AvatarImage src={brandProfile.logo_url} alt={brandProfile.brand_name} className="object-cover" />
                ) : null}
                <AvatarFallback className="rounded-2xl bg-gradient-to-r from-electric-cyan to-purple-accent text-white text-3xl font-bold">
                  {brandProfile?.brand_name?.charAt(0) || 'B'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {brandProfile?.brand_name || 'Tu Marca'}
                </h1>
                {brandProfile?.description && (
                  <p className="text-sm text-muted-foreground mt-1 max-w-md line-clamp-2">
                    {brandProfile.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-purple-accent/20 text-purple-accent border-purple-accent/30">
                    {brandProfile?.tone || 'Profesional'}
                  </Badge>
                  <Badge className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30">
                    {brandProfile?.style || 'Moderno'}
                  </Badge>
                  {brandProfile?.connected_social && brandProfile.connected_social.length > 0 && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {brandProfile.connected_social.length} RRSS
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Button variant="outline" className="gap-2" onClick={() => setShowConfigModal(true)}>
              <Settings className="w-4 h-4" />
              Configurar marca
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {quickStats.map((stat, idx) => (
            <Card key={idx} className="bg-card/30 backdrop-blur-sm border-border/50 hover:border-electric-cyan/30 transition-colors">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{metricsLoading ? '-' : stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Activity Summary */}
        {metrics.totalContents > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-10"
          >
            <Card className="bg-gradient-to-br from-purple-accent/10 to-electric-cyan/10 border-purple-accent/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-electric-cyan" />
                  Resumen de Actividad
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-400">{metrics.copiesGenerated}</p>
                    <p className="text-xs text-muted-foreground">Copys</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">{metrics.ideasGenerated}</p>
                    <p className="text-xs text-muted-foreground">Ideas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400">{metrics.variantsGenerated}</p>
                    <p className="text-xs text-muted-foreground">Variantes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{metrics.improvements}</p>
                    <p className="text-xs text-muted-foreground">Mejoras</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{metrics.translations}</p>
                    <p className="text-xs text-muted-foreground">Traducciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <UsageAnalyticsPanel />
        </motion.div>

        {/* Brainy Modules Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-accent" />
            Tus Herramientas Brainy
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brainyModules.map((module, idx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Card 
                  className={`relative overflow-hidden transition-all duration-300 h-full ${
                    module.isActive 
                      ? 'bg-card/50 border-electric-cyan/30 hover:border-electric-cyan/60 hover:shadow-glow-cyan cursor-pointer' 
                      : 'bg-card/20 border-border/30 opacity-75'
                  }`}
                  onClick={() => handleModuleClick(module)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    {module.isActive ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Activo
                      </Badge>
                    ) : (
                      <Badge className="bg-muted/50 text-muted-foreground border-border/50">
                        <Clock className="w-3 h-3 mr-1" />
                        Próximamente
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${module.gradient} flex items-center justify-center text-white mb-4 ${!module.isActive ? 'grayscale opacity-50' : ''}`}>
                      {module.icon}
                    </div>
                    <CardTitle className={`text-xl ${!module.isActive ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {module.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {/* Features List */}
                    <div className="space-y-2 mb-4">
                      {module.features.slice(0, 3).map((feature, featureIdx) => (
                        <div 
                          key={featureIdx}
                          className={`flex items-center gap-2 text-sm ${
                            module.isActive ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {module.isActive ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground/50" />
                          )}
                          {feature}
                        </div>
                      ))}
                      {module.features.length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{module.features.length - 3} más
                        </p>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button 
                      className={`w-full ${
                        module.isActive 
                          ? `bg-gradient-to-r ${module.gradient} hover:opacity-90 text-white`
                          : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                      }`}
                      disabled={!module.isActive}
                    >
                      {module.isActive ? (
                        <>
                          Abrir
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Próximamente
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-accent/20 via-background to-electric-cyan/20 border-purple-accent/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-accent to-electric-cyan flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Desbloquea todas las herramientas
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Actualiza a un plan premium para acceder a CalendarBrainy, AdBrainy, ChatBrainy y todas las funcionalidades avanzadas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90 text-background font-semibold"
                  onClick={handleUpgradeClick}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Ver planes premium
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/trial/creator')}
                >
                  Seguir con CreatorBrainy
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal open={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />

      {/* Brand Config Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-electric-cyan" />
              Configurar Marca
            </DialogTitle>
          </DialogHeader>
          {brandProfile && (
            <BrandConfigPanel 
              brandProfile={brandProfile}
              onSave={handleSaveBrandConfig}
              onClose={() => setShowConfigModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrialBrandDashboard;
