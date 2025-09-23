// Webhook do Mercado Pago removido. Mantido stub para compatibilidade.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  return new Response(JSON.stringify({ ok: true, message: "Webhook desativado" }), {
    status: 200,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
};

// @ts-ignore - Deno environment
Deno.serve(handler);
