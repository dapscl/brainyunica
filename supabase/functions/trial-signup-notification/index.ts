import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00D9FF; border-bottom: 2px solid #00D9FF; padding-bottom: 10px;">
          🚀 Nuevo Trial Iniciado - Brainy
        </h1>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Información del Usuario</h2>
          
          <p><strong>Email:</strong> <a href="mailto:${signupData.email}">${signupData.email}</a></p>
          
          <hr style="border: 1px solid #ddd; margin: 20px 0;" />
          
          <h3 style="color: #333;">Marca Analizada</h3>
          <p><strong>Handle/URL:</strong> ${signupData.brandHandle}</p>
          <p><strong>Tipo:</strong> ${signupData.brandType === 'instagram' ? 'Instagram' : 'Sitio Web'}</p>
          <p><strong>Nombre detectado:</strong> ${signupData.brandName}</p>
          <p><strong>Tono detectado:</strong> ${signupData.detectedTone}</p>
          <p><strong>Estilo detectado:</strong> ${signupData.detectedStyle}</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #22C55E 0%, #16A34A 100%); padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h3 style="margin: 0 0 10px 0;">Trial de 45 días</h3>
          <p style="font-size: 18px; margin: 0;">
            El usuario ha iniciado su período de prueba gratuito
          </p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
          Trial iniciado desde Brainy - ${new Date().toLocaleString('es-ES')}
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Brainy Trials <onboarding@resend.dev>",
      to: ["dap@unica.la"],
      subject: `🚀 Nuevo Trial: ${signupData.email} - ${signupData.brandName}`,
      html: emailHtml,
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
