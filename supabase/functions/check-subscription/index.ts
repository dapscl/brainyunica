import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: userData, error: userError } = await admin.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user?.email) return json({ error: "Unauthorized" }, 401);

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    let result = {
      subscribed: false,
      status: "none" as string,
      product_id: null as string | null,
      price_id: null as string | null,
      subscription_end: null as string | null,
    };

    if (customers.data.length > 0) {
      const subs = await stripe.subscriptions.list({
        customer: customers.data[0].id,
        status: "all",
        limit: 10,
      });
      const sub =
        subs.data.find((s) => s.status === "active" || s.status === "trialing") ??
        subs.data[0];
      if (sub) {
        const item = sub.items.data[0];
        const periodEnd = (item as any)?.current_period_end ?? (sub as any).current_period_end;
        result = {
          subscribed: sub.status === "active" || sub.status === "trialing",
          status: sub.status,
          product_id: (item?.price?.product as string) ?? null,
          price_id: item?.price?.id ?? null,
          subscription_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        };
      }
    }

    // Sync status onto the user's organizations (kill-switch source)
    await admin
      .from("organizations")
      .update({ subscription_status: result.subscribed ? "active" : result.status })
      .eq("owner_id", user.id);

    return json(result);
  } catch (e) {
    console.error("[CHECK-SUBSCRIPTION]", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
