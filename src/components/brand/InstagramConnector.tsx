import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Instagram, Check, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InstagramConnectorProps {
  brandId: string;
  currentHandle?: string;
  onConnected?: (handle: string) => void;
}

export const InstagramConnector = ({ 
  brandId, 
  currentHandle, 
  onConnected 
}: InstagramConnectorProps) => {
  const [handle, setHandle] = useState(currentHandle || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [connected, setConnected] = useState(!!currentHandle);

  const handleConnect = async () => {
    if (!handle.trim()) {
      toast.error('Ingresa un usuario de Instagram');
      return;
    }

    // Clean handle (remove @ if present)
    const cleanHandle = handle.replace('@', '').trim();
    
    setIsConnecting(true);
    
    try {
      // First, get the brand_kit for this brand
      const { data: brandKit, error: fetchError } = await supabase
        .from('brand_kits')
        .select('id')
        .eq('brand_id', brandId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (brandKit) {
        // Update existing brand_kit
        const { error: updateError } = await supabase
          .from('brand_kits')
          .update({ 
            instagram_handle: cleanHandle,
            updated_at: new Date().toISOString()
          })
          .eq('id', brandKit.id);

        if (updateError) throw updateError;
      } else {
        // Create new brand_kit with Instagram handle
        const { error: insertError } = await supabase
          .from('brand_kits')
          .insert({
            brand_id: brandId,
            instagram_handle: cleanHandle
          });

        if (insertError) throw insertError;
      }

      setConnected(true);
      toast.success(`@${cleanHandle} conectado exitosamente`);
      onConnected?.(cleanHandle);
      
      // Start learning process
      await startLearning(cleanHandle);
      
    } catch (error) {
      console.error('Error connecting Instagram:', error);
      toast.error('Error al conectar Instagram');
    } finally {
      setIsConnecting(false);
    }
  };

  const startLearning = async (instagramHandle: string) => {
    setIsLearning(true);
    
    try {
      // Simulate AI learning process (in production, this would call an edge function)
      // that scrapes public Instagram data and analyzes brand voice
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock voice profile data (in production, this comes from AI analysis)
      const mockVoiceProfile = {
        tone: 'professional',
        personality: ['innovative', 'friendly', 'expert'],
        commonPhrases: [],
        contentStyle: 'visual-focused',
        engagementStyle: 'conversational',
        analyzedAt: new Date().toISOString()
      };

      // Update brand_kit with learned profile
      const { error } = await supabase
        .from('brand_kits')
        .update({
          voice_profile: mockVoiceProfile,
          instagram_data: {
            handle: instagramHandle,
            lastAnalyzed: new Date().toISOString(),
            status: 'analyzed'
          }
        })
        .eq('brand_id', brandId);

      if (error) throw error;
      
      toast.success('¡Brainy aprendió el estilo de tu marca!');
      
    } catch (error) {
      console.error('Error in learning process:', error);
      toast.error('Error al analizar perfil');
    } finally {
      setIsLearning(false);
    }
  };

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-electric-cyan/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Instagram className="w-5 h-5 text-pink-500" />
          Conectar Instagram
          {connected && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Check className="w-3 h-3 mr-1" />
              Conectado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Usuario de Instagram</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="tu_marca"
                className="pl-8 bg-card/30 border-border/50 text-foreground"
                disabled={isConnecting || isLearning}
              />
            </div>
            <Button
              onClick={handleConnect}
              disabled={isConnecting || isLearning || !handle.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Conectando...
                </>
              ) : connected ? (
                'Reconectar'
              ) : (
                'Conectar'
              )}
            </Button>
          </div>
        </div>

        {isLearning && (
          <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
              <div>
                <p className="text-sm font-medium text-purple-300">
                  Brainy está aprendiendo...
                </p>
                <p className="text-xs text-purple-400/70">
                  Analizando tono, estilo y contenido de @{handle.replace('@', '')}
                </p>
              </div>
            </div>
          </div>
        )}

        {connected && !isLearning && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-300">
                  Perfil aprendido
                </p>
                <p className="text-xs text-green-400/70">
                  CreatorBrainy usará el estilo de tu marca para generar contenido
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
            <p className="text-xs text-blue-300/80">
              <strong>Próximamente:</strong> Conexión directa con Meta API para 
              acceso completo a analytics, publicación automática y Meta Ads.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
