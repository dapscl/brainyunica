import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_content",
  title: "Listar contenido",
  description: "List content items (posts) for a brand, optionally filtered by status, newest scheduled first.",
  inputSchema: {
    brand_id: z.string().uuid().describe("Brand ID from list_brands."),
    status: z.string().min(1).max(50).optional().describe("Optional status filter, e.g. draft, scheduled, published."),
    limit: z.number().int().min(1).max(100).optional().describe("Max items (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ brand_id, status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("content_items")
      .select("id, title, status, content_type, post_text, scheduled_date, published_at")
      .eq("brand_id", brand_id)
      .order("scheduled_date", { ascending: false, nullsFirst: false })
      .limit(limit ?? 50);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const items = (data ?? []).map((c) => ({
      id: c.id as string, title: c.title as string, status: c.status as string,
      content_type: c.content_type as string, post_text: (c.post_text as string | null) ?? null,
      scheduled_date: (c.scheduled_date as string | null) ?? null, published_at: (c.published_at as string | null) ?? null,
    }));
    return {
      content: [{ type: "text", text: items.length ? items.map((i) => `${i.id}: [${i.status}] ${i.title}`).join("\n") : "No content." }],
      structuredContent: { items },
    };
  },
});
