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
    const supabase = createClient(supabaseUrl, supabaseKey);

    // WhatsApp webhook verification
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'brainy-verification-token';

      if (mode === 'subscribe' && token === verifyToken) {
        console.log('Webhook verified');
        return new Response(challenge, { status: 200 });
      }

      return new Response('Forbidden', { status: 403 });
    }

    // Handle incoming WhatsApp messages
    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Received webhook:', JSON.stringify(body, null, 2));

      if (!body.entry?.[0]?.changes?.[0]?.value?.messages) {
        return new Response(JSON.stringify({ status: 'ok' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const message = body.entry[0].changes[0].value.messages[0];
      const phoneNumber = message.from;
      const messageText = message.text?.body || '';
      const messageType = message.type;
      const messageId = message.id;

      // Find or create conversation
      const { data: existingConv } = await supabase
        .from('whatsapp_conversations')
        .select('id, brand_id')
        .eq('phone_number', phoneNumber)
        .single();

      let conversationId = existingConv?.id;
      let brandId = existingConv?.brand_id;

      if (!conversationId) {
        // For new conversations, assign to first brand (in production, this should be smarter)
        const { data: firstBrand } = await supabase
          .from('brands')
          .select('id')
          .limit(1)
          .single();

        if (firstBrand) {
          const { data: newConv } = await supabase
            .from('whatsapp_conversations')
            .insert({
              phone_number: phoneNumber,
              brand_id: firstBrand.id,
              conversation_state: 'active',
              last_message_at: new Date().toISOString(),
            })
            .select('id, brand_id')
            .single();

          conversationId = newConv?.id;
          brandId = newConv?.brand_id;
        }
      }

      if (conversationId) {
        // Store incoming message
        await supabase
          .from('whatsapp_messages')
          .insert({
            conversation_id: conversationId,
            message_type: messageType,
            direction: 'inbound',
            content: messageText,
            message_id: messageId,
            status: 'received',
          });

        // Update last message timestamp
        await supabase
          .from('whatsapp_conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', conversationId);

        // Trigger AI processor asynchronously
        fetch(`${supabaseUrl}/functions/v1/whatsapp-processor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            conversationId,
            brandId,
            phoneNumber,
            messageText,
          }),
        }).catch(err => console.error('Error calling processor:', err));
      }

      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('Error in whatsapp-webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});