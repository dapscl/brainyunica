import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface VoiceProfile {
  tone: string;
  personality: string[];
  commonPhrases: string[];
  contentStyle: string;
  engagementStyle: string;
  analyzedAt: string;
}

interface BrandVoice {
  instagramHandle: string | null;
  voiceProfile: VoiceProfile | null;
  isLearned: boolean;
  learnedKeywords: string[];
  contentThemes: string[];
}

export const useBrandVoice = (brandId?: string) => {
  const [brandVoice, setBrandVoice] = useState<BrandVoice>({
    instagramHandle: null,
    voiceProfile: null,
    isLearned: false,
    learnedKeywords: [],
    contentThemes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brandId) {
      setLoading(false);
      return;
    }

    const fetchBrandVoice = async () => {
      try {
        const { data, error } = await supabase
          .from("brand_kits")
          .select("instagram_handle, voice_profile, learned_keywords, content_themes")
          .eq("brand_id", brandId)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          const voiceProfile = data.voice_profile as unknown as VoiceProfile | null;
          setBrandVoice({
            instagramHandle: data.instagram_handle,
            voiceProfile,
            isLearned: !!voiceProfile,
            learnedKeywords: data.learned_keywords || [],
            contentThemes: data.content_themes || []
          });
        }
      } catch (error) {
        console.error("Error fetching brand voice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandVoice();
  }, [brandId]);

  const getVoiceContext = () => {
    if (!brandVoice.isLearned || !brandVoice.voiceProfile) {
      return null;
    }

    return `
Tono de voz: ${brandVoice.voiceProfile.tone}
Personalidad: ${brandVoice.voiceProfile.personality.join(', ')}
Estilo de contenido: ${brandVoice.voiceProfile.contentStyle}
Estilo de engagement: ${brandVoice.voiceProfile.engagementStyle}
${brandVoice.learnedKeywords.length > 0 ? `Palabras clave: ${brandVoice.learnedKeywords.join(', ')}` : ''}
${brandVoice.contentThemes.length > 0 ? `Temas principales: ${brandVoice.contentThemes.join(', ')}` : ''}
    `.trim();
  };

  return { ...brandVoice, loading, getVoiceContext };
};
