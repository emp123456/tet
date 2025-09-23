// Função para recuperar um pagamento pendente
// @ts-ignore - Deno environment
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Payload = {
  id?: string;
};

function isValidPayload(body: unknown): body is Payload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return typeof b.id === "string" ? b.id.trim().length > 0 : true;
}

// Integração com Mercado Pago removida

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

    // Buscar o pagamento pelo tracking_id
    const { data: payment, error } = await supabase
      .from("igreja_cadastros")
      .select("*")
      .limit(1)
      .single();

    if (error) {
      console.error("payment_not_found", error);
      return new Response(JSON.stringify({ error: "payment_not_found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Integração de pagamento removida – nenhum status a validar

    // Sem recriação de pagamento online
    return new Response(JSON.stringify({
      ok: true,
      message: "Pedido localizado. Nossa equipe entrará em contato para finalizar."
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
