import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.0';
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AdSpendLogSchema = z.object({
  organization_id: z.string().uuid(),
  channel: z.string().min(1).max(100),
  amount: z.number().min(0),
  date: z.string().optional(),
  campaign_id: z.string().max(200).optional(),
  campaign_name: z.string().max(200).optional(),
  metadata: z.record(z.any()).optional(),
});

const GetMetricsSchema = z.object({
  organization_id: z.string().uuid(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with the auth token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'add';

    // Handle different actions
    switch (action) {
      case 'add': {
        // Add new ad spend log
        const rawBody = await req.json();
        const parseResult = AdSpendLogSchema.safeParse(rawBody);
        
        if (!parseResult.success) {
          console.error('Validation error:', parseResult.error.errors);
          return new Response(
            JSON.stringify({ error: 'Invalid request', details: parseResult.error.errors }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const body = parseResult.data;
        
        console.log('Adding ad spend log:', body);

        // Validate required fields
        if (!body.organization_id || !body.channel || body.amount === undefined) {
          return new Response(
            JSON.stringify({ error: 'Missing required fields: organization_id, channel, amount' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Insert ad spend log
        const { data: logData, error: logError } = await supabaseClient
          .from('ad_spend_logs')
          .insert({
            organization_id: body.organization_id,
            channel: body.channel,
            amount: body.amount,
            date: body.date || new Date().toISOString().split('T')[0],
            campaign_id: body.campaign_id,
            campaign_name: body.campaign_name,
            metadata: body.metadata || {},
          })
          .select()
          .single();

        if (logError) {
          console.error('Error inserting ad spend log:', logError);
          return new Response(
            JSON.stringify({ error: logError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Ad spend log created:', logData);

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: logData,
            message: 'Ad spend log added successfully'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'bulk-add': {
        // Add multiple ad spend logs at once
        const rawBody = await req.json();
        const BulkSchema = z.object({ logs: z.array(AdSpendLogSchema).min(1).max(100) });
        const parseResult = BulkSchema.safeParse(rawBody);
        
        if (!parseResult.success) {
          console.error('Validation error:', parseResult.error.errors);
          return new Response(
            JSON.stringify({ error: 'Invalid request', details: parseResult.error.errors }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const body = parseResult.data;
        console.log('Adding bulk ad spend logs:', body.logs.length);

        // Validate and prepare logs
        const logsToInsert = body.logs.map(log => ({
          organization_id: log.organization_id,
          channel: log.channel,
          amount: log.amount,
          date: log.date || new Date().toISOString().split('T')[0],
          campaign_id: log.campaign_id,
          campaign_name: log.campaign_name,
          metadata: log.metadata || {},
        }));

        // Insert all logs
        const { data: bulkData, error: bulkError } = await supabaseClient
          .from('ad_spend_logs')
          .insert(logsToInsert)
          .select();

        if (bulkError) {
          console.error('Error inserting bulk ad spend logs:', bulkError);
          return new Response(
            JSON.stringify({ error: bulkError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Bulk ad spend logs created:', bulkData?.length);

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: bulkData,
            count: bulkData?.length || 0,
            message: `${bulkData?.length || 0} ad spend logs added successfully`
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'metrics': {
        // Get metrics for an organization
        const rawBody = await req.json();
        const parseResult = GetMetricsSchema.safeParse(rawBody);
        
        if (!parseResult.success) {
          console.error('Validation error:', parseResult.error.errors);
          return new Response(
            JSON.stringify({ error: 'Invalid request', details: parseResult.error.errors }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const body = parseResult.data;
        console.log('Getting metrics for organization:', body.organization_id);

        // Call the database function to get metrics
        const { data: metricsData, error: metricsError } = await supabaseClient
          .rpc('get_ad_spend_metrics', {
            _organization_id: body.organization_id,
            _start_date: body.start_date || null,
            _end_date: body.end_date || null,
          })
          .single();

        if (metricsError) {
          console.error('Error getting metrics:', metricsError);
          return new Response(
            JSON.stringify({ error: metricsError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Metrics retrieved successfully');

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: metricsData,
            message: 'Metrics calculated successfully'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'list': {
        // List ad spend logs for an organization
        const organization_id = url.searchParams.get('organization_id');
        const start_date = url.searchParams.get('start_date');
        const end_date = url.searchParams.get('end_date');
        const channel = url.searchParams.get('channel');

        if (!organization_id) {
          return new Response(
            JSON.stringify({ error: 'Missing required parameter: organization_id' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Listing ad spend logs for organization:', organization_id);

        let query = supabaseClient
          .from('ad_spend_logs')
          .select('*')
          .eq('organization_id', organization_id)
          .order('date', { ascending: false });

        if (start_date) {
          query = query.gte('date', start_date);
        }
        if (end_date) {
          query = query.lte('date', end_date);
        }
        if (channel) {
          query = query.eq('channel', channel);
        }

        const { data: listData, error: listError } = await query;

        if (listError) {
          console.error('Error listing ad spend logs:', listError);
          return new Response(
            JSON.stringify({ error: listError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Ad spend logs retrieved:', listData?.length);

        return new Response(
          JSON.stringify({ 
            success: true, 
            data: listData,
            count: listData?.length || 0
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default: {
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: add, bulk-add, metrics, or list' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
  } catch (error) {
    console.error('Error in ad-spend-tracker function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
