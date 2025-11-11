import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { organizationId, brandId, category = 'marketing' } = await req.json();

    console.log('Collecting trends for:', { organizationId, brandId, category });

    // RSS feeds to monitor
    const rssFeeds = [
      { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
      { url: 'https://www.thedrum.com/rss/news', name: 'The Drum' },
      { url: 'https://www.marketingdirect.com/rss', name: 'Marketing Directo' },
    ];

    const trends = [];

    // Collect from RSS feeds
    for (const feed of rssFeeds) {
      try {
        const response = await fetch(feed.url);
        const xmlText = await response.text();
        
        // Simple XML parsing (in production, use proper XML parser)
        const titleMatches = xmlText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || [];
        const titles = titleMatches
          .slice(1, 6) // Skip first (channel title) and get next 5
          .map(t => t.replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, ''));

        for (const title of titles) {
          trends.push({
            keyword: title,
            source: feed.name,
            score: Math.floor(Math.random() * 100) + 1,
          });
        }
      } catch (error) {
        console.error(`Error fetching ${feed.name}:`, error);
      }
    }

    // Store trends in database
    if (trends.length > 0 && organizationId) {
      const trendRecords = trends.map(t => ({
        organization_id: organizationId,
        trend_keyword: t.keyword,
        trend_score: t.score,
        category,
        source: t.source,
        tracked_at: new Date().toISOString(),
      }));

      await supabase.from('trend_tracking').insert(trendRecords);
    }

    // Generate content suggestions using AI
    if (brandId && trends.length > 0) {
      const topTrends = trends
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      const { data: brand } = await supabase
        .from('brands')
        .select('name, industry')
        .eq('id', brandId)
        .single();

      const prompt = `Basándote en estas tendencias actuales:
${topTrends.map((t, i) => `${i + 1}. ${t.keyword} (Score: ${t.score})`).join('\n')}

Genera 3 ideas de contenido para ${brand?.name} en la industria de ${brand?.industry || 'marketing'}.

Para cada idea proporciona:
1. Un título atractivo (máximo 10 palabras)
2. Una descripción breve (máximo 30 palabras)
3. Un copy completo para redes sociales (máximo 100 palabras)

Formato JSON:
{
  "suggestions": [
    {
      "title": "...",
      "description": "...",
      "content": "..."
    }
  ]
}`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'Eres un experto en marketing de contenidos. Genera ideas creativas y relevantes.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.9,
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const responseText = aiData.choices[0].message.content;
        
        try {
          // Extract JSON from response
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const suggestions = JSON.parse(jsonMatch[0]);
            
            if (suggestions.suggestions) {
              const suggestionRecords = suggestions.suggestions.map((s: any) => ({
                brand_id: brandId,
                suggestion_type: 'trend',
                title: s.title,
                description: s.description,
                content_draft: s.content,
                source: 'AI + RSS Trends',
                trend_score: topTrends[0].score,
                status: 'pending',
              }));

              await supabase.from('content_suggestions').insert(suggestionRecords);
            }
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
        }
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      trendsCollected: trends.length,
      message: 'Trends collected and suggestions generated'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in trend-collector:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});