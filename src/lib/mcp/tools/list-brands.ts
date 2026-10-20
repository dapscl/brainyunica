import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_brands",
  title: "Listar marcas",
  description: "List the brands the signed-in user can access in Brainy.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_args, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("brands")
      .select("id, name, slug, industry, website")
      .order("name")
      .limit(100);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const brands = (data ?? []).map((b) => ({
      id: b.id as string, name: b.name as string, slug: b.slug as string,
      industry: (b.industry as string | null) ?? null, website: (b.website as string | null) ?? null,
    }));
    return {
      content: [{ type: "text", text: brands.length ? brands.map((b) => `${b.id}: ${b.name}`).join("\n") : "No brands." }],
      structuredContent: { brands },
    };
  },
});
