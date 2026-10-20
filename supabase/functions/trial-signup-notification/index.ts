import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendTemplateEmail } from "../_shared/transactional-email-templates/send-email.ts";
import { z } from "https://esm.sh/zod@3.23.8";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TrialSignupSchema = z.object({
  email: z.string().email().max(255),
  brandHandle: z.string().min(1).max(200),
  brandType: z.enum(['instagram', 'website']),
  brandName: z.string().min(1).max(200),
  detectedTone: z.string().max(100),
  detectedStyle: z.string().max(100),
});

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    const parseResult = TrialSignupSchema.safeParse(rawBody);
    
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: parseResult.error.errors }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    const signupData = parseResult.data;

    const emailResponse = await sendTemplateEmail("new-trial", "dap@unica.la", {
      templateData: signupData,
      idempotencyKey: `trial-${signupData.email}-${signupData.brandHandle}`,
    });

    console.log("Trial signup notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in trial-signup-notification function:", error);
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
