// Função para cancelar um pagamento pendente (atualizar status)
// @ts-ignore - Deno environment
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Payload = {
  tracking_id: string;
};

function isValidPayload(body: unknown): body is Payload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return typeof b.tracking_id === "string" && b.tracking_id.trim().length > 0;
}

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return new Response(JSON.stringify({ error: "unsupported_media_type" }), { status: 415, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let bodyUnknown: unknown;
    try {
      bodyUnknown = await req.json();
    } catch (e) {
      console.error("parse_json_error", e);
      return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!isValidPayload(bodyUnknown)) {
      return new Response(JSON.stringify({ error: "invalid_payload" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const body = bodyUnknown as Payload;

    // Use secrets without the reserved SUPABASE_ prefix
    // @ts-ignore - Deno environment
    const supabaseUrl = Deno.env.get("SB_URL");
    // @ts-ignore - Deno environment
    const supabaseServiceKey = Deno.env.get("SB_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "server_misconfigured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar se o pagamento existe e está pendente
    const { data: payment, error: fetchError } = await supabase
      .from("igreja_cadastros")
      .select("*")
      .eq("tracking_id", body.tracking_id)
      .single();

    if (fetchError) {
      console.error("payment_not_found", fetchError);
      return new Response(JSON.stringify({ error: "payment_not_found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Verificar se o pagamento está pendente
    if (payment.payment_status !== "pending") {
      return new Response(JSON.stringify({ error: "payment_not_pending" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Atualizar o status para cancelled
    const { error: updateError } = await supabase
      .from("igreja_cadastros")
      .update({ payment_status: "cancelled" })
      .eq("tracking_id", body.tracking_id);

    if (updateError) {
      console.error("update_failed", updateError);
      return new Response(JSON.stringify({ error: "update_failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      ok: true,
      message: "Pedido cancelado com sucesso!"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("unhandled_error", e);
    return new Response(JSON.stringify({ error: "bad_request" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
};

// Deno entrypoint
// @ts-ignore - Deno environment
Deno.serve(handler);
