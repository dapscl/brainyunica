import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotificationRequest {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  monthlyRevenue: string;
  clientsCount: string;
  currentTools?: string;
  challenges?: string;
  suggestedPlan: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadNotificationRequest = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #00D9FF; border-bottom: 2px solid #00D9FF; padding-bottom: 10px;">
          🎯 Nuevo Lead Capturado - Brainy
        </h1>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Información del Prospecto</h2>
          
          <p><strong>Nombre:</strong> ${leadData.fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${leadData.email}">${leadData.email}</a></p>
          <p><strong>Empresa:</strong> ${leadData.company}</p>
          <p><strong>Teléfono:</strong> <a href="tel:${leadData.phone}">${leadData.phone}</a></p>
          
          <hr style="border: 1px solid #ddd; margin: 20px 0;" />
          
          <p><strong>Facturación Mensual:</strong> ${leadData.monthlyRevenue}</p>
          <p><strong>Clientes Activos:</strong> ${leadData.clientsCount}</p>
          
          ${leadData.currentTools ? `<p><strong>Herramientas Actuales:</strong> ${leadData.currentTools}</p>` : ''}
          ${leadData.challenges ? `<p><strong>Desafíos:</strong> ${leadData.challenges}</p>` : ''}
        </div>
        
        <div style="background: linear-gradient(135deg, #00D9FF 0%, #B026FF 100%); padding: 20px; border-radius: 8px; color: white; text-align: center;">
          <h3 style="margin: 0 0 10px 0;">Plan Sugerido</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 0; text-transform: uppercase;">
            ${leadData.suggestedPlan}
          </p>
        </div>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px; text-align: center;">
          Lead capturado desde Brainy Showcase - ${new Date().toLocaleString('es-ES')}
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Brainy Leads <onboarding@resend.dev>",
      to: ["dap@unica.la"],
      subject: `🎯 Nuevo Lead: ${leadData.fullName} - ${leadData.company} (${leadData.suggestedPlan})`,
      html: emailHtml,
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
