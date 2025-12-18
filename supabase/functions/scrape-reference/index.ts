import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");

    if (!FIRECRAWL_API_KEY) {
      console.log("FIRECRAWL_API_KEY not configured, using basic fetch");
      // Fallback to basic fetch
      const basicContent = await fetchBasic(url);
      return new Response(
        JSON.stringify({ success: true, content: basicContent, source: 'basic' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Scraping reference URL with Firecrawl:', url);

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['markdown'],
        onlyMainContent: true,
        waitFor: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      // Fallback to basic fetch
      const basicContent = await fetchBasic(url);
      return new Response(
        JSON.stringify({ success: true, content: basicContent, source: 'basic' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown = data.data?.markdown || data.markdown || '';
    const metadata = data.data?.metadata || data.metadata || {};

    console.log('Firecrawl scrape successful, content length:', markdown.length);

    // Extract key product information
    const summary = extractProductInfo(markdown, metadata);

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: markdown.substring(0, 5000), // Limit content size
        summary,
        metadata: {
          title: metadata.title,
          description: metadata.description,
          sourceURL: metadata.sourceURL
        },
        source: 'firecrawl'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in scrape-reference function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchBasic(url: string): Promise<string> {
  try {
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const response = await fetch(formattedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BrainyBot/1.0)'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Extract text content from HTML
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    return textContent.substring(0, 5000);
  } catch (error) {
    console.error('Error in basic fetch:', error);
    return '';
  }
}

function extractProductInfo(content: string, metadata: any): string {
  const title = metadata.title || '';
  const description = metadata.description || '';
  
  // Try to extract key product information
  const lines = content.split('\n').filter(line => line.trim());
  const relevantLines = lines.slice(0, 30).join('\n'); // First 30 lines usually have key info
  
  return `
Título: ${title}
Descripción: ${description}

Contenido principal:
${relevantLines.substring(0, 2000)}
  `.trim();
}
