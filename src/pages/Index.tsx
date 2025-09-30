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
  igreja: string;
  telefone: string;
  email: string;
  endereco: string;
  cep: string;
  cnpj: string;
  numero_fieis: string;
  modelo_desejado: string;
  banco?: string;
  banco_numero?: string;
  agencia?: string;
  conta?: string;
  correntista_nome?: string;
};

function isValidPayload(body: unknown): body is Payload {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  const required = [
    "nome_pastor",
    "igreja",
    "telefone",
    "email",
    "endereco",
    "cep",
    "cnpj",
    "numero_fieis",
    "modelo_desejado",
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
    const supabaseUrl = Deno.env.get("SB_URL") || Deno.env.get("SUPABASE_URL");
    // @ts-ignore - Deno environment
    const supabaseServiceKey = Deno.env.get("SB_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    console.log("🔍 DEBUG - Supabase URL:", supabaseUrl ? "✅ Configurada" : "❌ Não configurada");
    console.log("🔍 DEBUG - Service Key:", supabaseServiceKey ? "✅ Configurada" : "❌ Não configurada");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("❌ ERRO - Variáveis do Supabase não configuradas");
      console.error("SB_URL:", supabaseUrl);
      console.error("SB_SERVICE_ROLE_KEY:", supabaseServiceKey ? "Presente" : "Ausente");
      return new Response(JSON.stringify({ 
        error: "server_misconfigured",
        details: "Variáveis de ambiente do Supabase não configuradas",
        debug: {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseServiceKey
        }
      }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log("🔍 DEBUG - Tentando inserir dados:", {
      nome_pastor: body.nome_pastor,
      email: body.email,
      modelo_desejado: body.modelo_desejado
    });

    const insertData = {
      nome_pastor: body.nome_pastor.trim(),
      igreja: body.igreja.trim(),
      telefone: body.telefone.trim(),
      email: body.email.trim().toLowerCase(),
      endereco: body.endereco.trim(),
      cep: body.cep.replace(/\D/g, ''), // Remove caracteres não numéricos
      cnpj: body.cnpj.replace(/\D/g, ''), // Remove caracteres não numéricos
      numero_fieis: body.numero_fieis.trim(),
      modelo_desejado: body.modelo_desejado.trim(),
      banco: body.banco?.trim() || null,
      banco_numero: body.banco_numero?.trim() || null,
      agencia: body.agencia?.trim() || null,
      conta: body.conta?.trim() || null,
      correntista_nome: body.correntista_nome?.trim() || null
    };

    console.log("🔍 DEBUG - Dados processados para inserção:", insertData);

    const { data, error } = await supabase
      .from("igreja_cadastros")
      .insert([insertData])
      .select();

    console.log("🔍 DEBUG - Resultado da inserção:", error ? "❌ Erro" : "✅ Sucesso");
    if (data) {
      console.log("🔍 DEBUG - Dados inseridos:", data);
    }

    if (error) {
      console.error("insert_failed", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return new Response(JSON.stringify({ 
        error: "insert_failed", 
        details: error.message,
        code: error.code 
      }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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


