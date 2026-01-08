import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Extended RSS feeds by category
const RSS_FEEDS = {
  marketing: [
    { url: 'https://www.thedrum.com/rss/news', name: 'The Drum' },
    { url: 'https://feeds.feedburner.com/marketingland', name: 'Marketing Land' },
    { url: 'https://blog.hubspot.com/marketing/rss.xml', name: 'HubSpot Marketing' },
    { url: 'https://contentmarketinginstitute.com/feed/', name: 'Content Marketing Institute' },
    { url: 'https://www.socialmediaexaminer.com/feed/', name: 'Social Media Examiner' },
  ],
  technology: [
    { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' },
    { url: 'https://www.theverge.com/rss/index.xml', name: 'The Verge' },
    { url: 'https://feeds.arstechnica.com/arstechnica/technology-lab', name: 'Ars Technica' },
    { url: 'https://www.wired.com/feed/rss', name: 'Wired' },
  ],
  business: [
    { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg' },
    { url: 'https://www.fastcompany.com/rss', name: 'Fast Company' },
    { url: 'https://hbr.org/feed', name: 'Harvard Business Review' },
    { url: 'https://www.entrepreneur.com/feed', name: 'Entrepreneur' },
  ],
  ecommerce: [
    { url: 'https://www.practicalecommerce.com/feed', name: 'Practical Ecommerce' },
    { url: 'https://www.bigcommerce.com/blog/feed/', name: 'BigCommerce' },
    { url: 'https://www.shopify.com/blog/feed', name: 'Shopify Blog' },
  ],
  social: [
    { url: 'https://sproutsocial.com/insights/feed/', name: 'Sprout Social' },
    { url: 'https://buffer.com/resources/feed/', name: 'Buffer' },
    { url: 'https://later.com/blog/feed/', name: 'Later' },
  ],
  advertising: [
    { url: 'https://www.adweek.com/feed/', name: 'Adweek' },
    { url: 'https://adage.com/rss/latest-news', name: 'Ad Age' },
    { url: 'https://searchengineland.com/feed', name: 'Search Engine Land' },
  ],
  latam: [
    { url: 'https://www.marketingdirecto.com/feed', name: 'Marketing Directo' },
    { url: 'https://merca20.com/feed/', name: 'Merca 2.0' },
    { url: 'https://www.puromarketing.com/rss/puromarketing.xml', name: 'Puro Marketing' },
  ],
};

// Extract titles from RSS XML
function extractTitlesFromRSS(xmlText: string): string[] {
  const titles: string[] = [];
  
  // Try CDATA format first
  const cdataMatches = xmlText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g) || [];
  for (const match of cdataMatches) {
    const title = match.replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, '');
    if (title && title.length > 10) titles.push(title);
  }
  
  // Also try standard format
  const standardMatches = xmlText.match(/<title>([^<]+)<\/title>/g) || [];
  for (const match of standardMatches) {
    const title = match.replace(/<title>/, '').replace(/<\/title>/, '');
    if (title && title.length > 10 && !titles.includes(title)) titles.push(title);
  }
  
  return titles.slice(1, 8); // Skip channel title, get up to 7 items
}

// Calculate trend score based on keywords and brand relevance
function calculateTrendScore(title: string, brandKeywords: string[] = []): number {
  const highValueKeywords = ['AI', 'artificial intelligence', 'GPT', 'automation', 'viral', 'record', 'breaking', 'first', 'new', 'launch', '2025', '2026'];
  const mediumValueKeywords = ['growth', 'increase', 'strategy', 'tips', 'how to', 'best', 'top', 'guide', 'trends'];
  
  let score = 50;
  const lowerTitle = title.toLowerCase();
  
  // Boost score significantly for brand-related keywords
  for (const keyword of brandKeywords) {
    if (keyword && lowerTitle.includes(keyword.toLowerCase())) {
      score += 25; // High boost for brand relevance
    }
  }
  
  for (const keyword of highValueKeywords) {
    if (lowerTitle.includes(keyword.toLowerCase())) score += 15;
  }
  for (const keyword of mediumValueKeywords) {
    if (lowerTitle.includes(keyword.toLowerCase())) score += 8;
  }
  
  // Add some randomness
  score += Math.floor(Math.random() * 10);
  
  return Math.min(score, 100);
}

// Generate AI-powered personalized trends for the brand
async function generatePersonalizedTrends(
  brandName: string, 
  brandKeywords: string[], 
  brandIndustry: string,
  lovableApiKey: string
): Promise<Array<{ keyword: string; source: string; score: number; category: string; isRelevant: boolean }>> {
  
  const prompt = `Eres un experto en tendencias de marketing y contenido digital. 
  
Analiza las tendencias ACTUALES (enero 2026) para una marca con estas características:
- Nombre: ${brandName}
- Industria: ${brandIndustry}
- Keywords relevantes: ${brandKeywords.slice(0, 10).join(', ')}

Genera 10 tendencias ESPECÍFICAS y RELEVANTES para esta industria que la marca podría aprovechar para crear contenido.

Las tendencias deben ser:
1. Específicas de la industria (${brandIndustry})
2. Actuales y relevantes para 2026
3. Accionables para contenido de redes sociales
4. Mezcla de tendencias de producto, estilo de vida y marketing

Responde SOLO en JSON válido:
{
  "trends": [
    {
      "title": "Tendencia específica para la industria",
      "category": "producto | lifestyle | marketing | tecnología | social",
      "score": 75,
      "reason": "Por qué es relevante para ${brandName}"
    }
  ]
}`;

  try {
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Eres un experto en tendencias de marketing. Responde solo en JSON válido.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      console.error('AI Gateway error:', aiResponse.status);
      return [];
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0]?.message?.content || '';
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return (parsed.trends || []).map((t: any) => ({
        keyword: t.title,
        source: `IA: ${t.reason?.substring(0, 50) || 'Tendencia personalizada'}`,
        score: t.score || 70,
        category: t.category || 'marketing',
        isRelevant: true, // AI trends are always relevant
      }));
    }
  } catch (error) {
    console.error('Error generating AI trends:', error);
  }
  
  return [];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { organizationId, brandId, categories = ['marketing', 'technology'], brandContext } = await req.json();

    // Extract brand keywords for relevance scoring
    const brandKeywords: string[] = brandContext?.keywords || [];
    const brandIndustry = brandContext?.industry || '';
    const brandName = brandContext?.name || '';
    
    console.log('TrendBrainy: Collecting trends for:', { 
      organizationId, 
      brandId, 
      categories,
      brandName,
      brandIndustry,
      brandKeywords: brandKeywords.slice(0, 10)
    });

    // STEP 1: Generate AI-powered personalized trends for the brand
    console.log('TrendBrainy: Generating AI personalized trends...');
    const aiTrends = await generatePersonalizedTrends(
      brandName, 
      brandKeywords, 
      brandIndustry,
      lovableApiKey
    );
    console.log(`TrendBrainy: Generated ${aiTrends.length} AI personalized trends`);

    // Add industry-related keywords for RSS matching
    const industryKeywords: Record<string, string[]> = {
      'motos': ['motos', 'motorcycles', 'motocicletas', 'scooter', 'naked', 'adventure', 'enduro', 'honda', 'yamaha', 'suzuki', 'kawasaki', 'motor'],
      'camping': ['camping', 'outdoor', 'naturaleza', 'aventura', 'viajes', 'trekking', 'senderismo'],
      'ecommerce': ['ecommerce', 'tienda online', 'ventas', 'shopify', 'woocommerce'],
      'restaurante': ['gastronomía', 'food', 'restaurante', 'comida', 'delivery'],
      'fitness': ['fitness', 'gym', 'entrenamiento', 'workout', 'salud'],
      'tecnología': ['tech', 'software', 'app', 'startup', 'SaaS'],
      'marketing': ['marketing', 'branding', 'publicidad', 'social media', 'content'],
    };
    
    // Find matching industry keywords
    const allBrandKeywords = [...brandKeywords];
    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      if (brandIndustry.toLowerCase().includes(industry) || brandName.toLowerCase().includes(industry)) {
        allBrandKeywords.push(...keywords);
      }
    }

    const trends: Array<{ keyword: string; source: string; score: number; category: string; isRelevant: boolean }> = [];
    const feedsToCheck: Array<{ url: string; name: string; category: string }> = [];

    // Build list of feeds based on requested categories
    for (const category of categories) {
      const categoryFeeds = RSS_FEEDS[category as keyof typeof RSS_FEEDS] || [];
      for (const feed of categoryFeeds) {
        feedsToCheck.push({ ...feed, category });
      }
    }

    console.log(`TrendBrainy: Checking ${feedsToCheck.length} RSS feeds...`);

    // Collect from RSS feeds in parallel
    const feedPromises = feedsToCheck.map(async (feed) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(feed.url, { 
          signal: controller.signal,
          headers: { 'User-Agent': 'TrendBrainy/1.0' }
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.log(`TrendBrainy: Failed to fetch ${feed.name}: ${response.status}`);
          return [];
        }
        
        const xmlText = await response.text();
        const titles = extractTitlesFromRSS(xmlText);
        
        console.log(`TrendBrainy: Got ${titles.length} items from ${feed.name}`);
        
        return titles.map(title => {
          const score = calculateTrendScore(title, allBrandKeywords);
          const isRelevant = allBrandKeywords.some(kw => 
            kw && title.toLowerCase().includes(kw.toLowerCase())
          );
          return {
            keyword: title,
            source: feed.name,
            score,
            category: feed.category,
            isRelevant,
          };
        });
      } catch (error) {
        console.log(`TrendBrainy: Error fetching ${feed.name}:`, error.message);
        return [];
      }
    });

    const feedResults = await Promise.all(feedPromises);
    for (const result of feedResults) {
      trends.push(...result);
    }

    console.log(`TrendBrainy: Collected ${trends.length} total trends`);
    
    // Separate relevant and general trends
    const relevantTrends = trends.filter(t => t.isRelevant);
    const generalTrends = trends.filter(t => !t.isRelevant);
    
    console.log(`TrendBrainy: ${relevantTrends.length} RSS relevant + ${aiTrends.length} AI personalized trends`);

    // Sort by score
    relevantTrends.sort((a, b) => b.score - a.score);
    generalTrends.sort((a, b) => b.score - a.score);
    
    // Combine: AI trends first (most relevant), then RSS relevant, then general
    const topTrends = [
      ...aiTrends.slice(0, 10),           // Up to 10 AI personalized trends
      ...relevantTrends.slice(0, 5),       // Up to 5 RSS relevant trends  
      ...generalTrends.slice(0, 5)         // Up to 5 general trends
    ].slice(0, 20);

    // Store trends in database
    if (topTrends.length > 0 && organizationId) {
      const trendRecords = topTrends.map(t => ({
        organization_id: organizationId,
        trend_keyword: t.keyword.substring(0, 255),
        trend_score: t.score,
        category: t.category,
        source: t.source,
        tracked_at: new Date().toISOString(),
      }));

      const { error: insertError } = await supabase.from('trend_tracking').insert(trendRecords);
      if (insertError) {
        console.error('TrendBrainy: Error storing trends:', insertError);
      } else {
        console.log(`TrendBrainy: Stored ${trendRecords.length} trends`);
      }
    }

    // Generate content suggestions using CreatorBrainy if brandId provided
    let suggestions = [];
    if (brandId && topTrends.length > 0) {
      const { data: brand } = await supabase
        .from('brands')
        .select('name, industry')
        .eq('id', brandId)
        .single();

      if (brand) {
        const top5Trends = topTrends.slice(0, 5);
        
        const prompt = `Eres TrendBrainy, el experto en detectar tendencias y crear contenido viral.

Basándote en estas tendencias actuales detectadas en tiempo real:
${top5Trends.map((t, i) => `${i + 1}. "${t.keyword}" (${t.source}, Score: ${t.score})`).join('\n')}

Genera 3 ideas de contenido ESPECÍFICAS para "${brand.name}" en la industria de ${brand.industry || 'marketing'}.

Para cada idea:
1. Conecta la tendencia con el negocio de forma relevante
2. Sugiere un ángulo único y atractivo
3. Incluye un copy listo para publicar

Responde en JSON:
{
  "suggestions": [
    {
      "title": "Título atractivo del contenido",
      "description": "Descripción breve de la idea",
      "content": "Copy completo listo para publicar con emojis y hashtags",
      "trendConnection": "Qué tendencia inspira esta idea",
      "format": "video | imagen | carrusel | story"
    }
  ]
}`;

        console.log('TrendBrainy: Calling CreatorBrainy for content suggestions...');

        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: 'Eres un experto en marketing de contenidos y tendencias. Generas ideas creativas y virales.' },
              { role: 'user', content: prompt }
            ],
          }),
        });

        if (aiResponse.ok) {
          const aiData = await aiResponse.json();
          const responseText = aiData.choices[0]?.message?.content || '';
          
          try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              suggestions = parsed.suggestions || [];
              
              if (suggestions.length > 0) {
                const suggestionRecords = suggestions.map((s: any) => ({
                  brand_id: brandId,
                  suggestion_type: 'trend',
                  title: s.title,
                  description: s.description,
                  content_draft: s.content,
                  source: `TrendBrainy: ${s.trendConnection}`,
                  trend_score: top5Trends[0].score,
                  status: 'pending',
                  metadata: { format: s.format, trendConnection: s.trendConnection }
                }));

                const { error: suggestError } = await supabase.from('content_suggestions').insert(suggestionRecords);
                if (suggestError) {
                  console.error('TrendBrainy: Error storing suggestions:', suggestError);
                } else {
                  console.log(`TrendBrainy: Stored ${suggestionRecords.length} content suggestions`);
                }
              }
            }
          } catch (parseError) {
            console.error('TrendBrainy: Error parsing AI response:', parseError);
          }
        } else {
          console.error('TrendBrainy: AI Gateway error:', aiResponse.status);
        }
      }
    }

    // Return ALL top trends for real-time display (not just top 5)
    return new Response(JSON.stringify({ 
      success: true, 
      trendsCollected: topTrends.length,
      suggestionsGenerated: suggestions.length,
      topTrends: topTrends, // Return all 20 top trends
      message: 'TrendBrainy: Trends collected and suggestions generated'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('TrendBrainy Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
