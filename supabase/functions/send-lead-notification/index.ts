import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";
import { z } from "https://esm.sh/zod@3.23.8";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LeadNotificationSchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(255),
  company: z.string().min(1).max(200),
  phone: z.string().min(1).max(50),
  monthlyRevenue: z.string().max(100),
  clientsCount: z.string().max(100),
  currentTools: z.string().max(500).optional(),
  challenges: z.string().max(1000).optional(),
  suggestedPlan: z.string().max(100),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    const parseResult = LeadNotificationSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: parseResult.error.errors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const leadData = parseResult.data;

    const emailResponse = await sendTemplateEmail("new-lead", "dap@unica.la", {
      templateData: leadData,
      idempotencyKey: `lead-${leadData.email}-${Date.now()}`,
    });

    console.log("Lead notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
