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

    const { conversationId, brandId, phoneNumber, messageText } = await req.json();

    console.log('Processing message:', { conversationId, brandId, messageText });

    // Get brand information and recent conversation history
    const { data: brand } = await supabase
      .from('brands')
      .select('name, industry')
      .eq('id', brandId)
      .single();

    const { data: recentMessages } = await supabase
      .from('whatsapp_messages')
      .select('direction, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build conversation context
    const conversationHistory = recentMessages
      ?.reverse()
      .map(m => `${m.direction === 'inbound' ? 'Usuario' : 'Brainy'}: ${m.content}`)
      .join('\n') || '';

    // Determine intent and generate response
    const systemPrompt = `Eres Brainy, el Project Manager inteligente de ${brand?.name || 'la marca'}. Tu función es ayudar a gestionar contenido, aprobaciones y sugerencias de marketing a través de WhatsApp.

Capacidades:
- Aprobar/rechazar publicaciones programadas
- Sugerir contenido basado en tendencias
- Editar y optimizar copys
- Programar publicaciones
- Responder preguntas sobre el estado de campañas

Contexto de la marca:
- Nombre: ${brand?.name}
- Industria: ${brand?.industry || 'General'}

Conversación previa:
${conversationHistory}

Responde de forma concisa, amigable y profesional. Usa emojis cuando sea apropiado. Si el usuario solicita una acción (aprobar, publicar, editar), confirma claramente qué harás.`;

    // Call Lovable AI
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
          { role: 'user', content: messageText }
        ],
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const error = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, error);
      throw new Error('Failed to generate AI response');
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices[0].message.content;

    console.log('AI Response:', responseText);

    // Store AI response
    await supabase
      .from('whatsapp_messages')
      .insert({
        conversation_id: conversationId,
        message_type: 'text',
        direction: 'outbound',
        content: responseText,
        status: 'pending',
      });

    // Send message via WhatsApp Business API
    const whatsappToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const whatsappPhoneId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

    if (whatsappToken && whatsappPhoneId) {
      const whatsappResponse = await fetch(
        `https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phoneNumber,
            type: 'text',
            text: { body: responseText },
          }),
        }
      );

      if (whatsappResponse.ok) {
        console.log('Message sent successfully');
        await supabase
          .from('whatsapp_messages')
          .update({ status: 'sent' })
          .eq('conversation_id', conversationId)
          .eq('direction', 'outbound')
          .eq('status', 'pending');
      } else {
        const error = await whatsappResponse.text();
        console.error('WhatsApp API error:', error);
      }
    }

    return new Response(JSON.stringify({ success: true, response: responseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in whatsapp-processor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});