// Minimal Supabase Edge Function to safely receive form submissions
// - Validates payload
// - Inserts using service role (kept secret in function env)
// - Optional hCaptcha verification if HCAPTCHA_SECRET is set

// @ts-ignore - Deno environment
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Payload = {
  nome_pastor: string;
  telefone: string;
  email: string;
  endereco: string;
  cep: string;
  cnpj: string;
  numero_fieis: string;
  modelo_desejado: string;
  banco: string;
  banco_numero: string;
  agencia: string;
  conta: string;
  correntista_nome: string;
};

function isValidPayload(body: unknown): body is Payload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  const required = [
    "nome_pastor",
    "telefone",
    "email",
    "endereco",
    "cep",
    "cnpj",
    "numero_fieis",
    "modelo_desejado",
    "banco",
    "banco_numero",
    "agencia",
    "conta",
    "correntista_nome",
  ];
  for (const key of required) {
    if (typeof b[key] !== "string" || (b[key] as string).trim().length === 0) {
      return false;
    }
  }
  return true;
}

async function verifyHCaptcha(token: string | undefined): Promise<boolean> {
  // @ts-ignore - Deno environment
  const secret = Deno.env.get("HCAPTCHA_SECRET");
  if (!secret) return true; // not configured -> skip
  if (!token) return false;
  try {
    const resp = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await resp.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
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
    const body = bodyUnknown as Payload & { captchaToken?: string };

    const captchaOk = await verifyHCaptcha(body.captchaToken);
    if (!captchaOk && body.captchaToken) {
      // Só falha se o captcha foi fornecido mas é inválido
      return new Response(JSON.stringify({ error: "captcha_failed" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Use secrets without the reserved SUPABASE_ prefix
    // @ts-ignore - Deno environment
    const supabaseUrl = Deno.env.get("SB_URL");
    // @ts-ignore - Deno environment
    const supabaseServiceKey = Deno.env.get("SB_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "server_misconfigured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase.from("igreja_cadastros").insert([
      {
        nome_pastor: body.nome_pastor,
        telefone: body.telefone,
        email: body.email,
        endereco: body.endereco,
        cep: body.cep,
        cnpj: body.cnpj,
        numero_fieis: body.numero_fieis,
        modelo_desejado: body.modelo_desejado,
        banco: body.banco,
        banco_numero: body.banco_numero,
        agencia: body.agencia,
        conta: body.conta,
        correntista_nome: body.correntista_nome
      }
    ]);

    if (error) {
      console.error("insert_failed", error);
      return new Response(JSON.stringify({ error: "insert_failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Retorno sem integração de pagamento online
    return new Response(JSON.stringify({ 
      ok: true,
      message: "Formulário enviado com sucesso! Entraremos em contato para finalizar."
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


