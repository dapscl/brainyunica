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
  analysis: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    contentIdeas: string[];
  };
  firecrawlData?: {
    branding?: any;
    metadata?: any;
  };
}

// Prompts para análisis real con contenido de Firecrawl
const getWebsitePrompt = (url: string, content: string, branding?: any) => `
Actuá como un analista de marca y hacé un brand audit de este sitio web: ${url}

Contenido del sitio extraído con AI:
${content.substring(0, 12000)}

${branding ? `
Información de Branding extraída automáticamente:
- Esquema de color: ${branding.colorScheme || 'No detectado'}
- Logo: ${branding.logo || 'No detectado'}
- Colores principales: ${JSON.stringify(branding.colors || {})}
- Tipografías: ${JSON.stringify(branding.fonts || [])}
- Tipografía detallada: ${JSON.stringify(branding.typography || {})}
` : ''}

Quiero que analices:
1. La propuesta de valor: ¿Es clara y diferenciadora?
2. El tono de comunicación: ¿Cómo habla la marca y a quién le habla?
3. La identidad visual: ¿Qué transmite el diseño, colores, tipografías e imágenes?
4. UX básica: ¿Es fácil de navegar, clara y coherente?
5. Insights estratégicos: ¿Qué oportunidades de mejora o fortalezas ves?

IMPORTANTE: Responde en formato JSON con esta estructura exacta:
{
  "brandName": "nombre de la marca detectado",
  "tone": "una palabra que describe el tono (ej: Profesional, Casual, Inspirador, Educativo, Divertido, Sofisticado, Elegante, Cercano)",
  "style": "una palabra que describe el estilo visual (ej: Minimalista, Colorido, Corporativo, Creativo, Elegante, Moderno, Sofisticado)",
  "colors": ["#color1", "#color2", "#color3"],
  "keywords": ["palabra1", "palabra2", "palabra3", "palabra4"],
  "personality": "descripción de la personalidad de marca en una oración",
  "analysis": {
    "summary": "resumen general de 3-5 líneas",
    "strengths": ["fortaleza1", "fortaleza2", "fortaleza3"],
    "weaknesses": ["debilidad1", "debilidad2"],
    "recommendations": ["recomendación1", "recomendación2", "recomendación3"],
    "contentIdeas": ["idea de contenido 1", "idea de contenido 2"]
  }
}

Solo responde con el JSON, sin texto adicional.
`;

const getInstagramPrompt = (handle: string) => `
Actuá como un estratega digital especializado en marcas y hacé un análisis de la cuenta de Instagram: ${handle}

Basándote en tu conocimiento general sobre cómo las marcas de este tipo suelen comunicarse en Instagram, analiza:

1. Identidad visual: ¿Qué estilo visual sería típico para una marca con este nombre?
2. Tono y estilo de comunicación: ¿Cómo podría hablar esta marca? ¿A qué audiencia apuntaría?
3. Contenido: ¿Qué tipo de contenido publicaría (branding, comunidad, ventas)?
4. Diferenciación: ¿Cómo podría posicionarse frente a marcas similares?

IMPORTANTE: Responde en formato JSON con esta estructura exacta:
{
  "brandName": "nombre de la marca basado en el handle",
  "tone": "una palabra que describe el tono probable (ej: Profesional, Casual, Inspirador, Educativo, Divertido, Sofisticado, Elegante, Cercano)",
  "style": "una palabra que describe el estilo visual probable (ej: Minimalista, Colorido, Corporativo, Creativo, Elegante, Moderno)",
  "colors": ["#color1", "#color2", "#color3"],
  "keywords": ["palabra1", "palabra2", "palabra3", "palabra4"],
  "personality": "descripción de la personalidad de marca probable en una oración",
  "analysis": {
    "summary": "diagnóstico breve tipo 'esta marca comunica de forma...'",
    "strengths": ["fortaleza potencial 1", "fortaleza potencial 2"],
    "weaknesses": ["área de mejora 1", "área de mejora 2"],
    "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"],
    "contentIdeas": ["idea de contenido 1 que podría mejorar la estrategia", "idea de contenido 2"]
  }
}

Solo responde con el JSON, sin texto adicional.
`;

// Fetch website content using Firecrawl
async function fetchWithFirecrawl(url: string): Promise<{ markdown: string; branding?: any; metadata?: any }> {
  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  
  if (!FIRECRAWL_API_KEY) {
    console.log("FIRECRAWL_API_KEY not configured, using basic fetch");
    return { markdown: await fetchWebsiteBasic(url) };
  }

  try {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    console.log('Fetching with Firecrawl:', formattedUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown', 'branding'],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return { markdown: await fetchWebsiteBasic(url) };
    }

    console.log('Firecrawl scrape successful');
    
    return {
      markdown: data.data?.markdown || data.markdown || '',
      branding: data.data?.branding || data.branding,
      metadata: data.data?.metadata || data.metadata
    };
  } catch (error) {
    console.error('Error with Firecrawl:', error);
    return { markdown: await fetchWebsiteBasic(url) };
  }
}

// Basic fallback fetch if Firecrawl fails
async function fetchWebsiteBasic(url: string): Promise<string> {
  try {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }
    
    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrandScanner/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract text content from HTML (basic extraction)
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    return textContent;
  } catch (error) {
    console.error('Error fetching website:', error);
    return '';
  }
}

// Call AI for analysis
async function analyzeWithAI(prompt: string): Promise<BrandScanResult | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  
  if (!LOVABLE_API_KEY) {
    console.error("LOVABLE_API_KEY not configured");
    return null;
  }

  try {
    console.log("Calling AI Gateway for brand analysis...");
    
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Eres un analista de marcas experto. Siempre respondes en formato JSON válido sin texto adicional."
          },
          {
            role: "user",
            content: prompt
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return null;
    }

    console.log("AI Response received, parsing...");
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No JSON found in response:", content);
      return null;
    }

    const result = JSON.parse(jsonMatch[0]);
    
    // Add default content suggestions if not present
    if (!result.contentSuggestions) {
      result.contentSuggestions = result.analysis?.contentIdeas || [
        'Tips educativos semanales',
        'Behind the scenes',
        'Casos de éxito',
        'User generated content'
      ];
    }

    return result;
  } catch (error) {
    console.error("Error in AI analysis:", error);
    return null;
  }
}

// Fallback analysis if AI fails
function getFallbackAnalysis(handle: string, type: string): BrandScanResult {
  let brandName = handle.replace('@', '').replace('https://', '').replace('www.', '').split('/')[0].split('.')[0];
  brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);
  
  return {
    brandName,
    tone: 'Profesional',
    style: 'Moderno',
    colors: ['#00D9FF', '#B026FF', '#1A1A2E'],
    keywords: ['innovación', 'calidad', 'confianza', 'resultados'],
    personality: 'Marca confiable que busca conectar con su audiencia de manera auténtica',
    contentSuggestions: ['Tips educativos', 'Behind the scenes', 'Casos de éxito', 'Testimonios'],
    analysis: {
      summary: `${brandName} presenta una identidad de marca que busca posicionarse de manera profesional en su sector. El análisis requiere acceso directo al contenido para mayor precisión.`,
      strengths: ['Nombre de marca memorable', 'Potencial de diferenciación'],
      weaknesses: ['Análisis limitado sin acceso al contenido real'],
      recommendations: ['Conectar Instagram para análisis profundo', 'Proporcionar URL del sitio web'],
      contentIdeas: ['Contenido educativo sobre el sector', 'Historias de clientes satisfechos']
    }
  };
}

serve(async (req) => {
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
    
    let result: BrandScanResult | null = null;
    
    if (type === 'website') {
      // Fetch website content with Firecrawl
      const { markdown, branding, metadata } = await fetchWithFirecrawl(handle);
      
      if (markdown && markdown.length > 100) {
        const prompt = getWebsitePrompt(handle, markdown, branding);
        result = await analyzeWithAI(prompt);
        
        // Add Firecrawl data to result
        if (result) {
          result.firecrawlData = { branding, metadata };
          
          // Use extracted colors if available
          if (branding?.colors) {
            const extractedColors = [];
            if (branding.colors.primary) extractedColors.push(branding.colors.primary);
            if (branding.colors.secondary) extractedColors.push(branding.colors.secondary);
            if (branding.colors.accent) extractedColors.push(branding.colors.accent);
            if (branding.colors.background) extractedColors.push(branding.colors.background);
            
            if (extractedColors.length >= 3) {
              result.colors = extractedColors.slice(0, 4);
            }
          }
        }
      }
    } else {
      // Instagram analysis
      const prompt = getInstagramPrompt(handle);
      result = await analyzeWithAI(prompt);
    }
    
    // Use fallback if AI analysis failed
    if (!result) {
      console.log("Using fallback analysis");
      result = getFallbackAnalysis(handle, type);
    }
    
    console.log(`Brand scan complete for ${handle}`);

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
