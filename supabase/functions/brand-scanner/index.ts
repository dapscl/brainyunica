import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BrandScanRequest {
  handle: string;
  type: 'instagram' | 'website';
}

interface BrandScanResult {
  brandName: string;
  tone: string;
  style: string;
  colors: string[];
  keywords: string[];
  personality: string;
  contentSuggestions: string[];
}

// Simulated brand analysis - in production this would use AI to analyze real data
const analyzeBrand = (handle: string, type: string): BrandScanResult => {
  // Generate pseudo-random but consistent results based on handle
  const hashCode = handle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const tones = ['Profesional', 'Casual', 'Inspirador', 'Educativo', 'Divertido', 'Sofisticado'];
  const styles = ['Minimalista', 'Colorido', 'Corporativo', 'Creativo', 'Elegante', 'Moderno'];
  const personalities = [
    'Experto confiable que educa a su audiencia',
    'Marca cercana que conecta emocionalmente',
    'Líder innovador en su industria',
    'Guía amigable que simplifica lo complejo',
    'Visionario que inspira cambio'
  ];
  
  const colorPalettes = [
    ['#00D9FF', '#B026FF', '#1A1A2E'],
    ['#FF6B6B', '#4ECDC4', '#2C3E50'],
    ['#F39C12', '#27AE60', '#2980B9'],
    ['#E74C3C', '#9B59B6', '#34495E'],
    ['#1ABC9C', '#3498DB', '#2C3E50']
  ];
  
  const keywordSets = [
    ['innovación', 'calidad', 'confianza', 'resultados'],
    ['creatividad', 'diseño', 'estilo', 'tendencia'],
    ['crecimiento', 'éxito', 'estrategia', 'impacto'],
    ['comunidad', 'conexión', 'valor', 'autenticidad'],
    ['tecnología', 'futuro', 'eficiencia', 'soluciones']
  ];
  
  const suggestionSets = [
    ['Tips educativos semanales', 'Behind the scenes', 'Casos de éxito', 'Infografías'],
    ['Reels con tendencias', 'Colaboraciones', 'User generated content', 'Lives'],
    ['Tutoriales paso a paso', 'Comparativas', 'Testimonios', 'Q&A'],
    ['Storytelling personal', 'Motivación diaria', 'Desafíos', 'Encuestas'],
    ['Contenido viral', 'Memes de industria', 'Predicciones', 'Reviews']
  ];
  
  const idx = hashCode % 5;
  
  // Extract brand name from handle
  let brandName = handle.replace('@', '').replace('https://', '').replace('www.', '').split('/')[0].split('.')[0];
  brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
  
  return {
    brandName,
    tone: tones[hashCode % tones.length],
    style: styles[(hashCode + 1) % styles.length],
    colors: colorPalettes[idx],
    keywords: keywordSets[idx],
    personality: personalities[idx],
    contentSuggestions: suggestionSets[idx]
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { handle, type }: BrandScanRequest = await req.json();
    
    if (!handle) {
      return new Response(
        JSON.stringify({ error: 'Handle or URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scanning brand: ${handle} (${type})`);
    
    // Simulate processing time (2-4 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    const result = analyzeBrand(handle, type);
    
    console.log(`Brand scan complete for ${handle}:`, result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in brand-scanner function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
