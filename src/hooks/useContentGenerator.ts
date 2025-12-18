import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type ContentType = 'copy' | 'variants' | 'ideas' | 'improve' | 'translate';

interface GenerateContentParams {
  type: ContentType;
  brandId?: string;
  platform?: string;
  topic?: string;
  tone?: string;
  originalContent?: string;
  targetLanguage?: string;
  context?: string;
}

interface CopyResult {
  copy: {
    hook: string;
    body: string;
    cta: string;
    fullCopy: string;
    hashtags: string[];
    characterCount: number;
  };
}

interface VariantsResult {
  variants: Array<{
    name: string;
    content: string;
    approach: string;
    expectedPerformance: string;
  }>;
}

interface IdeasResult {
  ideas: Array<{
    title: string;
    description: string;
    format: string;
    bestTime: string;
    engagementPotential: string;
  }>;
}

interface ImproveResult {
  improved: {
    content: string;
    changes: string[];
    tips: string[];
    improvementScore: string;
  };
}

interface TranslationResult {
  translation: {
    content: string;
    adaptations: string[];
    culturalNotes: string[];
  };
}

type ContentResult = CopyResult | VariantsResult | IdeasResult | ImproveResult | TranslationResult | { rawContent: string };

interface GenerateContentResponse {
  success: boolean;
  type: ContentType;
  result: ContentResult;
  generatedAt: string;
  error?: string;
}

export function useContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<ContentResult | null>(null);

  const generateContent = async (params: GenerateContentParams): Promise<ContentResult | null> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke<GenerateContentResponse>('content-generator', {
        body: params
      });

      if (error) {
        console.error('Content generation error:', error);
        toast({
          title: 'Error generando contenido',
          description: error.message || 'Por favor intenta de nuevo',
          variant: 'destructive'
        });
        return null;
      }

      if (!data?.success) {
        const errorMessage = data?.error || 'Error desconocido';
        
        if (errorMessage.includes('Rate limit')) {
          toast({
            title: 'Demasiadas solicitudes',
            description: 'Por favor espera un momento antes de intentar de nuevo',
            variant: 'destructive'
          });
        } else if (errorMessage.includes('credits')) {
          toast({
            title: 'Créditos agotados',
            description: 'Necesitas agregar créditos para continuar usando AI',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive'
          });
        }
        return null;
      }

      setLastResult(data.result);
      
      toast({
        title: '¡Contenido generado!',
        description: 'CreatorBrainy ha creado tu contenido',
      });

      return data.result;

    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: 'Error inesperado',
        description: 'Por favor intenta de nuevo',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Convenience methods
  const generateCopy = async (params: Omit<GenerateContentParams, 'type'>) => {
    return generateContent({ ...params, type: 'copy' }) as Promise<CopyResult | null>;
  };

  const generateVariants = async (originalContent: string, params?: Partial<GenerateContentParams>) => {
    return generateContent({ ...params, type: 'variants', originalContent }) as Promise<VariantsResult | null>;
  };

  const generateIdeas = async (topic: string, params?: Partial<GenerateContentParams>) => {
    return generateContent({ ...params, type: 'ideas', topic }) as Promise<IdeasResult | null>;
  };

  const improveContent = async (originalContent: string, params?: Partial<GenerateContentParams>) => {
    return generateContent({ ...params, type: 'improve', originalContent }) as Promise<ImproveResult | null>;
  };

  const translateContent = async (originalContent: string, targetLanguage: string, params?: Partial<GenerateContentParams>) => {
    return generateContent({ ...params, type: 'translate', originalContent, targetLanguage }) as Promise<TranslationResult | null>;
  };

  return {
    generateContent,
    generateCopy,
    generateVariants,
    generateIdeas,
    improveContent,
    translateContent,
    isGenerating,
    lastResult,
  };
}
