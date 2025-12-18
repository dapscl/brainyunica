import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Image as ImageIcon, 
  FileText, 
  Link2,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
  Save,
  Loader2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { TrialBrandProfile } from '@/hooks/useTrialBrandProfile';

interface BrandConfigPanelProps {
  brandProfile: TrialBrandProfile;
  onSave: (updates: Partial<TrialBrandProfile>) => Promise<void>;
  onClose?: () => void;
}

const ADS_PLATFORMS = [
  { id: 'meta', name: 'Meta Ads', icon: Facebook, color: '#1877F2', description: 'Facebook & Instagram Ads' },
  { id: 'google', name: 'Google Ads', icon: () => <span className="font-bold text-sm">G</span>, color: '#4285F4', description: 'Search, Display & YouTube' },
  { id: 'linkedin', name: 'LinkedIn Ads', icon: Linkedin, color: '#0A66C2', description: 'B2B Advertising' },
  { id: 'tiktok', name: 'TikTok Ads', icon: () => <span className="font-bold text-sm">T</span>, color: '#000000', description: 'Short-form video ads' },
];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: '#1877F2' },
  { id: 'twitter', name: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', icon: () => <span className="font-bold text-sm">T</span>, color: '#000000' },
];

export const BrandConfigPanel = ({ brandProfile, onSave, onClose }: BrandConfigPanelProps) => {
  const [logoUrl, setLogoUrl] = useState(brandProfile.logo_url || '');
  const [description, setDescription] = useState(brandProfile.description || '');
  const [connectedAds, setConnectedAds] = useState<string[]>(
    Array.isArray(brandProfile.connected_ads) ? brandProfile.connected_ads : []
  );
  const [connectedSocial, setConnectedSocial] = useState<string[]>(
    Array.isArray(brandProfile.connected_social) ? brandProfile.connected_social : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [detectedLogo, setDetectedLogo] = useState<string | null>(
    (brandProfile.analysis as any)?.branding?.logo || 
    (brandProfile.analysis as any)?.branding?.images?.logo || 
    null
  );

  const toggleAdsPlatform = (platformId: string) => {
    setConnectedAds(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const toggleSocialPlatform = (platformId: string) => {
    setConnectedSocial(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleUseDetectedLogo = () => {
    if (detectedLogo) {
      setLogoUrl(detectedLogo);
      toast.success('Logo del sitio aplicado');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        logo_url: logoUrl,
        description,
        connected_ads: connectedAds,
        connected_social: connectedSocial,
      });
      toast.success('Configuración de marca guardada');
      onClose?.();
    } catch (error) {
      console.error('Error saving brand config:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Section A: Logo */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            Logo de la Marca
          </CardTitle>
          <CardDescription>
            Actualiza el logo según lo encontrado en el sitio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-6">
            {/* Current/Preview Logo */}
            <Avatar className="w-24 h-24 rounded-xl border-2 border-border/50">
              {logoUrl ? (
                <AvatarImage src={logoUrl} alt="Logo de marca" />
              ) : (
                <AvatarFallback className="rounded-xl bg-gradient-to-r from-electric-cyan to-purple-accent text-white text-2xl font-bold">
                  {brandProfile.brand_name?.charAt(0) || 'B'}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">URL del Logo</Label>
                <Input
                  id="logoUrl"
                  placeholder="https://ejemplo.com/logo.png"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              {detectedLogo && detectedLogo !== logoUrl && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-electric-cyan/10 border border-electric-cyan/30">
                  <Avatar className="w-12 h-12 rounded-lg">
                    <AvatarImage src={detectedLogo} alt="Logo detectado" />
                    <AvatarFallback className="rounded-lg">?</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Logo detectado en el sitio</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{detectedLogo}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={handleUseDetectedLogo}>
                    Usar este
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section B: Description */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-electric-cyan" />
            Descripción de la Marca
          </CardTitle>
          <CardDescription>
            Una breve descripción que define tu marca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe tu marca en pocas palabras. Por ejemplo: Somos una empresa de tecnología enfocada en soluciones innovadoras para pequeñas empresas..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background/50 min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {description.length}/500 caracteres
          </p>
        </CardContent>
      </Card>

      {/* Section C: ADS Platforms */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Link2 className="w-5 h-5 text-green-400" />
            Conectar Plataformas de Ads
          </CardTitle>
          <CardDescription>
            Conecta tus cuentas publicitarias para optimizar campañas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ADS_PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const isConnected = connectedAds.includes(platform.id);
              
              return (
                <div
                  key={platform.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isConnected
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-border/50 hover:border-border'
                  }`}
                  onClick={() => toggleAdsPlatform(platform.id)}
                >
                  <Checkbox checked={isConnected} />
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">{platform.description}</p>
                  </div>
                  {isConnected && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            La conexión completa con APIs estará disponible próximamente
          </p>
        </CardContent>
      </Card>

      {/* Section D: Social Networks */}
      <Card className="bg-card/30 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Instagram className="w-5 h-5 text-pink-400" />
            Conectar Redes Sociales
          </CardTitle>
          <CardDescription>
            Vincula tus perfiles de redes sociales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SOCIAL_PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const isConnected = connectedSocial.includes(platform.id);
              
              return (
                <div
                  key={platform.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    isConnected
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-border/50 hover:border-border'
                  }`}
                  onClick={() => toggleSocialPlatform(platform.id)}
                >
                  <Checkbox checked={isConnected} />
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    <Icon />
                  </div>
                  <span className="text-sm font-medium text-foreground">{platform.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gradient-to-r from-electric-cyan to-purple-accent hover:opacity-90"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};
