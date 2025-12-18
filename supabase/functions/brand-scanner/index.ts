import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BrandScanRequest {
  handle: string;
  type: 'instagram' | 'website';
  instagramHandle?: string;
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
    brandIdentity: {
      valueProposition: string;
      communicationTone: string;
      targetAudience: string;
      visualCoherence: string;
    };
    websiteAnalysis: {
      diagnosis: string;
      uxAssessment: string;
      foundKeywords: string[];
      missingKeywords: string[];
      keywordAlignment: string;
    };
    instagramAnalysis: {
      feedAesthetic: string;
      contentTypes: string[];
      topHashtags: string[];
      engagementLevel: string;
      audienceAlignment: string;
    };
    performance: {
      mobileScore: string;
      desktopScore: string;
      loadTime: string;
      issues: string[];
      recommendations: string[];
    };
    diagnosis: {
      strengths: string[];
      opportunities: string[];
      recommendations: string[];
      instagramIdeas: string[];
      seoImprovements: string[];
    };
  };
  seo: {
    foundKeywords: string[];
    missingKeywords: string[];
    seoOpportunities: string[];
    keywordAlignment: string;
  };
  firecrawlData?: {
    branding?: any;
    metadata?: any;
  };
}

// Comprehensive brand audit prompt
const getComprehensivePrompt = (url: string, content: string, instagramHandle: string, branding?: any, metadata?: any) => `
Actuá como un planner estratégico senior y realizá un Brand Scanner completo de la siguiente marca, analizando su sitio web${instagramHandle ? ' y su cuenta de Instagram' : ''}.

Sitio: ${url}
${instagramHandle ? `Instagram: @${instagramHandle}` : ''}

${branding ? `
DATOS DE BRANDING EXTRAÍDOS AUTOMÁTICAMENTE:
- Esquema de color: ${branding.colorScheme || 'No detectado'}
- Logo: ${branding.logo || 'No detectado'}
- Colores principales: ${JSON.stringify(branding.colors || {})}
- Tipografías: ${JSON.stringify(branding.fonts || [])}
- Tipografía detallada: ${JSON.stringify(branding.typography || {})}
` : ''}

${metadata ? `
METADATA DEL SITIO:
- Título: ${metadata.title || 'No detectado'}
- Descripción: ${metadata.description || 'No detectada'}
- Idioma: ${metadata.language || 'No detectado'}
` : ''}

CONTENIDO DEL SITIO WEB:
${content.substring(0, 15000)}

Tu análisis debe incluir las siguientes secciones:

1. IDENTIDAD DE MARCA
- ¿Cuál es la propuesta de valor de la marca? ¿Es clara y diferenciadora?
- ¿Cómo es el tono de comunicación? ¿A quién le habla?
- ¿La identidad visual es coherente? (colores, imágenes, tipografías, estilo)

2. ANÁLISIS DEL SITIO WEB
- Diagnóstico general del sitio: claridad, navegación, experiencia de usuario (UX).
- Palabras clave que se repiten en el contenido del sitio.
- ¿Estas keywords coinciden con las más buscadas en Google para su industria? (usa tu conocimiento de tendencias de búsqueda)
- Keywords faltantes: ¿qué términos relevantes no aparecen y deberían estar?

3. ANÁLISIS DE INSTAGRAM
${instagramHandle ? `
- Basándote en el perfil @${instagramHandle} y el tipo de marca:
- Estética general esperada del feed: ¿es coherente y profesional?
- Tipos de contenido que debería publicar (branding, ventas, comunidad, etc.).
- Hashtags y palabras que deberían usar en los copys.
- ¿Coinciden con las búsquedas populares de la audiencia en Google?
- Nivel de engagement esperado y cómo mejorarlo.
` : '- Proporciona recomendaciones generales para Instagram basándote en el análisis del sitio web.'}

4. VELOCIDAD Y PERFORMANCE TÉCNICA
- Basándote en el contenido y estructura del sitio, estima:
  - Resultado mobile y desktop aproximado (bueno/regular/malo)
  - Tiempo de carga estimado
  - Problemas técnicos potenciales (imágenes pesadas, scripts, etc.)
  - Recomendaciones para mejorar la velocidad y experiencia mobile

5. DIAGNÓSTICO GENERAL Y RECOMENDACIONES
- ¿Qué tan alineada está la marca con su audiencia digital?
- Tabla con:
  - Fortalezas
  - Oportunidades de mejora
  - Recomendaciones accionables
- Proponé 2 ideas de contenido para Instagram y 2 mejoras SEO para el sitio.

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "brandName": "nombre de la marca detectado",
  "tone": "descripción del tono (ej: profesional, cercano, innovador)",
  "style": "descripción del estilo de comunicación",
  "colors": ["#color1", "#color2", "#color3"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "personality": "descripción de la personalidad de marca",
  "contentSuggestions": ["sugerencia1", "sugerencia2", "sugerencia3"],
  "analysis": {
    "brandIdentity": {
      "valueProposition": "propuesta de valor detectada",
      "communicationTone": "tono de comunicación y a quién le habla",
      "targetAudience": "audiencia objetivo identificada",
      "visualCoherence": "evaluación de coherencia visual"
    },
    "websiteAnalysis": {
      "diagnosis": "diagnóstico general del sitio",
      "uxAssessment": "evaluación de UX",
      "foundKeywords": ["keyword1", "keyword2", "keyword3"],
      "missingKeywords": ["keyword faltante 1", "keyword faltante 2"],
      "keywordAlignment": "evaluación de si coinciden con tendencias de búsqueda"
    },
    "instagramAnalysis": {
      "feedAesthetic": "evaluación de estética del feed",
      "contentTypes": ["tipo1", "tipo2", "tipo3"],
      "topHashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
      "engagementLevel": "evaluación de engagement",
      "audienceAlignment": "alineación con búsquedas de audiencia"
    },
    "performance": {
      "mobileScore": "estimación de score mobile",
      "desktopScore": "estimación de score desktop",
      "loadTime": "tiempo de carga estimado",
      "issues": ["problema1", "problema2"],
      "recommendations": ["recomendación técnica 1", "recomendación 2"]
    },
    "diagnosis": {
      "strengths": ["fortaleza1", "fortaleza2", "fortaleza3"],
      "opportunities": ["oportunidad1", "oportunidad2"],
      "recommendations": ["recomendación accionable 1", "recomendación 2", "recomendación 3"],
      "instagramIdeas": ["idea de contenido Instagram 1", "idea 2"],
      "seoImprovements": ["mejora SEO 1", "mejora SEO 2"]
    }
  },
  "seo": {
    "foundKeywords": ["keyword encontrada 1", "keyword 2", "keyword 3"],
    "missingKeywords": ["keyword popular faltante 1", "keyword 2"],
    "seoOpportunities": ["oportunidad SEO específica 1", "oportunidad 2"],
    "keywordAlignment": "evaluación de alineación entre lenguaje del sitio y cómo busca la audiencia"
  }
}

Ejemplo de oportunidad SEO: si el sitio vende skincare pero no menciona "piel sensible" y esa es una keyword top en Google, eso es una oportunidad.

Solo responde con el JSON, sin texto adicional.
`;

const getInstagramPrompt = (handle: string) => `
Actuá como un planner estratégico senior especializado en Instagram y redes sociales.

Analizá la cuenta de Instagram @${handle} y proporciona un Brand Scanner completo.

Tu análisis debe incluir:

1. IDENTIDAD DE MARCA EN INSTAGRAM
- Propuesta de valor percibida basándote en el nombre/handle
- Tono de comunicación esperado
- Audiencia objetivo aparente

2. ANÁLISIS DE CONTENIDO
- Estética general del feed esperada
- Tipos de contenido recomendados (branding, ventas, comunidad, educativo, entretenimiento)
- Frecuencia de publicación sugerida

3. ESTRATEGIA DE HASHTAGS
- Hashtags principales que debería usar
- Hashtags de nicho recomendados
- Hashtags de tendencia en su industria (basándote en tu conocimiento de búsquedas populares)

4. ENGAGEMENT Y COMUNIDAD
- Nivel de engagement esperado
- Estrategias para mejorar interacción
- Tipos de contenido que generan más engagement en esta industria

5. RECOMENDACIONES
- 3 ideas de contenido específicas
- Mejoras de perfil sugeridas
- Estrategia de crecimiento

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido con esta estructura:
{
  "brandName": "@${handle}",
  "tone": "tono de comunicación sugerido",
  "style": "estilo de comunicación",
  "colors": ["#sugerencia1", "#sugerencia2", "#sugerencia3"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4"],
  "personality": "personalidad de marca sugerida",
  "contentSuggestions": ["sugerencia1", "sugerencia2", "sugerencia3"],
  "analysis": {
    "brandIdentity": {
      "valueProposition": "propuesta de valor sugerida",
      "communicationTone": "tono de comunicación",
      "targetAudience": "audiencia objetivo",
      "visualCoherence": "coherencia visual sugerida"
    },
    "websiteAnalysis": {
      "diagnosis": "N/A - Solo análisis de Instagram",
      "uxAssessment": "N/A",
      "foundKeywords": [],
      "missingKeywords": [],
      "keywordAlignment": "N/A"
    },
    "instagramAnalysis": {
      "feedAesthetic": "estética del feed sugerida",
      "contentTypes": ["tipo1", "tipo2", "tipo3"],
      "topHashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
      "engagementLevel": "nivel de engagement esperado",
      "audienceAlignment": "alineación con audiencia"
    },
    "performance": {
      "mobileScore": "N/A",
      "desktopScore": "N/A",
      "loadTime": "N/A",
      "issues": [],
      "recommendations": []
    },
    "diagnosis": {
      "strengths": ["fortaleza potencial 1", "fortaleza 2"],
      "opportunities": ["oportunidad 1", "oportunidad 2"],
      "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"],
      "instagramIdeas": ["idea de contenido 1", "idea 2", "idea 3"],
      "seoImprovements": []
    }
  },
  "seo": {
    "foundKeywords": [],
    "missingKeywords": [],
    "seoOpportunities": [],
    "keywordAlignment": "N/A - Análisis de Instagram"
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
    console.log("Calling AI Gateway for comprehensive brand analysis...");
    
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
            content: "Eres un planner estratégico senior especializado en branding digital, SEO, y análisis de marcas. Tienes amplio conocimiento de tendencias de búsqueda en Google y comportamiento de usuarios. Siempre respondes en formato JSON válido sin texto adicional."
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
    
    // Ensure contentSuggestions exists
    if (!result.contentSuggestions) {
      result.contentSuggestions = result.analysis?.diagnosis?.instagramIdeas || [
        'Tips educativos semanales',
        'Behind the scenes',
        'Casos de éxito'
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
      brandIdentity: {
        valueProposition: 'Análisis pendiente - Se requiere más información',
        communicationTone: 'Por determinar con más datos',
        targetAudience: 'Por identificar',
        visualCoherence: 'Por evaluar'
      },
      websiteAnalysis: {
        diagnosis: 'Análisis básico completado',
        uxAssessment: 'Se recomienda auditoría completa de UX',
        foundKeywords: [],
        missingKeywords: [],
        keywordAlignment: 'Por evaluar con análisis completo'
      },
      instagramAnalysis: {
        feedAesthetic: 'Por evaluar',
        contentTypes: ['branding', 'educativo', 'comunidad'],
        topHashtags: [],
        engagementLevel: 'Por medir',
        audienceAlignment: 'Por evaluar'
      },
      performance: {
        mobileScore: 'Por medir',
        desktopScore: 'Por medir',
        loadTime: 'Por medir',
        issues: [],
        recommendations: ['Realizar auditoría de performance']
      },
      diagnosis: {
        strengths: ['Presencia digital establecida'],
        opportunities: ['Optimización SEO', 'Mejora de contenido'],
        recommendations: ['Realizar análisis completo', 'Definir estrategia de contenido'],
        instagramIdeas: ['Serie de tips', 'Behind-the-scenes'],
        seoImprovements: ['Optimizar meta descriptions', 'Agregar keywords relevantes']
      }
    },
    seo: {
      foundKeywords: [],
      missingKeywords: [],
      seoOpportunities: ['Realizar keyword research completo'],
      keywordAlignment: 'Análisis pendiente'
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { handle, type, instagramHandle }: BrandScanRequest = await req.json();
    
    if (!handle) {
      return new Response(
        JSON.stringify({ error: 'Handle or URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Scanning brand: ${handle} (${type})${instagramHandle ? ` with Instagram: @${instagramHandle}` : ''}`);
    
    let result: BrandScanResult | null = null;
    
    if (type === 'website') {
      // Fetch website content with Firecrawl
      const { markdown, branding, metadata } = await fetchWithFirecrawl(handle);
      
      if (markdown && markdown.length > 100) {
        const prompt = getComprehensivePrompt(handle, markdown, instagramHandle || '', branding, metadata);
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
      const prompt = getInstagramPrompt(handle.replace('@', ''));
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
