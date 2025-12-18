import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ContentRequestSchema = z.object({
  type: z.enum(['copy', 'variants', 'ideas', 'improve', 'translate']),
  brandId: z.string().uuid().optional(),
  platform: z.string().max(50).optional(),
  topic: z.string().max(500).optional(),
  tone: z.string().max(100).optional(),
  originalContent: z.string().max(10000).optional(),
  targetLanguage: z.string().max(50).optional(),
  context: z.string().max(5000).optional(),
});

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

    const rawBody = await req.json();
    const parseResult = ContentRequestSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: parseResult.error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { type, brandId, platform, topic, tone, originalContent, targetLanguage, context } = parseResult.data;

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

    let systemPrompt = `Eres un sistema experto en copywriting y marketing de contenidos que combina dos perspectivas:

1. VERSIÓN PRINCIPAL: Copy moderno, optimizado para engagement digital, claro y orientado a resultados.

2. VERSIÓN JULIAN KOENIG: El legendario redactor detrás de "Think Small" de Volkswagen. Escribes como en los años 60, cuando la publicidad aún tenía agallas. Tu estilo es claro, irónico y directo. Frases cortas. Ritmo seco. Nada de adornos. Si no vende, no sirve.

PARA CADA RESPUESTA debes incluir:
- La versión principal optimizada
- Una versión alternativa al estilo Julian Koenig
- Un análisis detallado con: fortalezas, áreas de mejora, y recomendaciones/oportunidades

Siempre respondes en formato JSON estructurado.`;

    if (brandInfo) {
      systemPrompt += `\n\nEstás trabajando para la marca "${brandInfo.name}" en la industria de ${brandInfo.industry || 'marketing'}.`;
      if (brandInfo.brand_guidelines) {
        systemPrompt += `\nGuías de marca: ${brandInfo.brand_guidelines}`;
      }
    }

    let userPrompt = '';

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

Responde en JSON con esta estructura exacta:
{
  "copy": {
    "hook": "...",
    "body": "...",
    "cta": "...",
    "fullCopy": "...",
    "hashtags": ["...", "..."],
    "characterCount": 123
  },
  "julianKoenigVersion": {
    "hook": "...",
    "body": "...",
    "cta": "...",
    "fullCopy": "...",
    "philosophy": "Breve explicación de por qué Julian escribiría así"
  },
  "analysis": {
    "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
    "improvements": ["Área de mejora 1", "Área de mejora 2"],
    "opportunities": ["Oportunidad/Recomendación 1", "Oportunidad/Recomendación 2", "Oportunidad/Recomendación 3"]
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
  ],
  "julianKoenigVersion": {
    "variant": "La versión que Julian Koenig escribiría - directa, honesta, memorable",
    "philosophy": "Por qué esta versión es más efectiva según su filosofía"
  },
  "analysis": {
    "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
    "improvements": ["Área de mejora 1", "Área de mejora 2"],
    "opportunities": ["Oportunidad/Recomendación 1", "Oportunidad/Recomendación 2", "Oportunidad/Recomendación 3"]
  }
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
  ],
  "julianKoenigVersion": {
    "bigIdea": "La GRAN idea que Julian propondría - simple, memorable, impactante",
    "headline": "El titular que usaría",
    "philosophy": "Por qué esta idea funcionaría mejor que las demás"
  },
  "analysis": {
    "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
    "improvements": ["Área de mejora 1", "Área de mejora 2"],
    "opportunities": ["Oportunidad/Recomendación 1", "Oportunidad/Recomendación 2", "Oportunidad/Recomendación 3"]
  }
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
  },
  "julianKoenigVersion": {
    "content": "Cómo Julian Koenig reescribiría este texto - sin rodeos, memorable",
    "philosophy": "El principio publicitario que aplicó"
  },
  "analysis": {
    "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
    "improvements": ["Área de mejora 1", "Área de mejora 2"],
    "opportunities": ["Oportunidad/Recomendación 1", "Oportunidad/Recomendación 2", "Oportunidad/Recomendación 3"]
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
  },
  "julianKoenigVersion": {
    "content": "Versión traducida al estilo Julian Koenig - directa y universal",
    "philosophy": "Por qué el buen copy trasciende idiomas"
  },
  "analysis": {
    "strengths": ["Fortaleza 1", "Fortaleza 2", "Fortaleza 3"],
    "improvements": ["Área de mejora 1", "Área de mejora 2"],
    "opportunities": ["Oportunidad/Recomendación 1", "Oportunidad/Recomendación 2", "Oportunidad/Recomendación 3"]
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
