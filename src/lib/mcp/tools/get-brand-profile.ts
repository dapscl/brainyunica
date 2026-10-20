import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_brand_profile",
  title: "Perfil de marca analizado",
  description: "Get the signed-in user's AI-analyzed brand profile (tone, style, keywords, personality).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("trial_brand_profiles")
      .select("brand_name, brand_handle, brand_type, tone, style, personality, description, keywords")
      .eq("user_id", ctx.getUserId() ?? "")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "No brand profile yet." }] };
    const profile = {
      brand_name: data.brand_name as string,
      brand_handle: (data.brand_handle as string | null) ?? null,
      brand_type: (data.brand_type as string | null) ?? null,
      tone: (data.tone as string | null) ?? null,
      style: (data.style as string | null) ?? null,
      personality: (data.personality as string | null) ?? null,
      description: (data.description as string | null) ?? null,
      keywords: Array.isArray(data.keywords) ? (data.keywords as unknown[]).map(String) : [],
    };
    return {
      content: [{ type: "text", text: `${profile.brand_name} — tono: ${profile.tone ?? "-"}, estilo: ${profile.style ?? "-"}` }],
      structuredContent: { profile },
    };
  },
});
