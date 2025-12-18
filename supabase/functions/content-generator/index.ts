import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContentRequest {
  type: 'copy' | 'variants' | 'ideas' | 'improve' | 'translate';
  brandId?: string;
  platform?: string;
  topic?: string;
  tone?: string;
  originalContent?: string;
  targetLanguage?: string;
  context?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const request: ContentRequest = await req.json();
    const { type, brandId, platform, topic, tone, originalContent, targetLanguage, context } = request;

    console.log('Content generation request:', { type, brandId, platform, topic });

    // Get brand info if provided
    let brandInfo = null;
    if (brandId) {
      const { data: brand } = await supabase
        .from('brands')
        .select('name, industry, website')
        .eq('id', brandId)
        .single();
      brandInfo = brand;

      // Get brand kit for tone/style
      const { data: brandKit } = await supabase
        .from('brand_kits')
        .select('brand_guidelines, dos_and_donts')
        .eq('brand_id', brandId)
        .single();
      
      if (brandKit) {
        brandInfo = { ...brandInfo, ...brandKit };
      }
    }

    let systemPrompt = `Eres CreatorBrainy, un experto en marketing de contenidos y copywriting. 
Generas contenido creativo, atractivo y efectivo para redes sociales y marketing digital.
Siempre respondes en formato JSON estructurado.`;

    if (brandInfo) {
      systemPrompt += `\n\nEstás trabajando para la marca "${brandInfo.name}" en la industria de ${brandInfo.industry || 'marketing'}.`;
      if (brandInfo.brand_guidelines) {
        systemPrompt += `\nGuías de marca: ${brandInfo.brand_guidelines}`;
      }
    }

    let userPrompt = '';
    let responseFormat = {};

    switch (type) {
      case 'copy':
        userPrompt = `Genera un copy para ${platform || 'redes sociales'} sobre: "${topic}".
${tone ? `Tono: ${tone}` : 'Tono: profesional pero cercano'}
${context ? `Contexto adicional: ${context}` : ''}

Incluye:
- Un hook inicial impactante
- Cuerpo del mensaje
- Call to action
- 3-5 hashtags relevantes
- Emojis apropiados

Responde en JSON:
{
  "copy": {
    "hook": "...",
    "body": "...",
    "cta": "...",
    "fullCopy": "...",
    "hashtags": ["...", "..."],
    "characterCount": 123
  }
}`;
        break;

      case 'variants':
        userPrompt = `Genera 3 variantes A/B del siguiente contenido para testing:

Original: "${originalContent}"

${platform ? `Plataforma: ${platform}` : ''}
${tone ? `Mantén el tono: ${tone}` : ''}

Cada variante debe tener un enfoque diferente:
1. Variante emocional (conecta con sentimientos)
2. Variante racional (datos y beneficios)
3. Variante urgente (escasez o tiempo limitado)

Responde en JSON:
{
  "variants": [
    {
      "name": "Emocional",
      "content": "...",
      "approach": "...",
      "expectedPerformance": "..."
    }
  ]
}`;
        break;

      case 'ideas':
        userPrompt = `Genera 5 ideas de contenido para ${platform || 'redes sociales'} sobre: "${topic}".

${context ? `Contexto: ${context}` : ''}

Para cada idea incluye:
- Título atractivo
- Descripción breve
- Formato recomendado (video, imagen, carrusel, etc.)
- Mejor día/hora para publicar
- Potencial de engagement (alto/medio/bajo)

Responde en JSON:
{
  "ideas": [
    {
      "title": "...",
      "description": "...",
      "format": "...",
      "bestTime": "...",
      "engagementPotential": "..."
    }
  ]
}`;
        break;

      case 'improve':
        userPrompt = `Mejora el siguiente contenido haciéndolo más atractivo y efectivo:

"${originalContent}"

${platform ? `Optimiza para: ${platform}` : ''}
${tone ? `Mantén el tono: ${tone}` : ''}

Proporciona:
1. Versión mejorada
2. Explicación de los cambios
3. Tips adicionales

Responde en JSON:
{
  "improved": {
    "content": "...",
    "changes": ["...", "..."],
    "tips": ["...", "..."],
    "improvementScore": "85%"
  }
}`;
        break;

      case 'translate':
        userPrompt = `Traduce y adapta culturalmente el siguiente contenido a ${targetLanguage || 'inglés'}:

"${originalContent}"

No hagas una traducción literal. Adapta:
- Expresiones idiomáticas
- Referencias culturales
- Tono apropiado para el mercado objetivo

Responde en JSON:
{
  "translation": {
    "content": "...",
    "adaptations": ["...", "..."],
    "culturalNotes": ["...", "..."]
  }
}`;
        break;

      default:
        throw new Error(`Unknown content type: ${type}`);
    }

    console.log('Calling AI Gateway...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a moment.',
          code: 'RATE_LIMIT'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'AI credits exhausted. Please add credits to continue.',
          code: 'PAYMENT_REQUIRED'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0]?.message?.content;

    if (!responseText) {
      throw new Error('Empty response from AI');
    }

    console.log('AI Response received, parsing...');

    // Extract JSON from response
    let result;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        result = { rawContent: responseText };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      result = { rawContent: responseText };
    }

    return new Response(JSON.stringify({ 
      success: true,
      type,
      result,
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content-generator:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
