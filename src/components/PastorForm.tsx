import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Church } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const pastorFormSchema = z.object({
  nome_pastor: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  cep: z.string()
    .min(8, "CEP deve ter pelo menos 8 dígitos")
    .regex(/^\d{5}[-\s]?\d{3}$/, "CEP inválido"),
  cnpj: z.string()
    .min(14, "CNPJ deve ter pelo menos 14 dígitos")
    .regex(/^\d{2}[.\s]?\d{3}[.\s]?\d{3}[\/\s]?\d{4}[-\s]?\d{2}$/, "CNPJ inválido"),
  numero_fieis: z.string().min(1, "Selecione o número de fiéis"),
  modelo_desejado: z.string().min(1, "Selecione um modelo"),
  banco: z.string().optional(),
  banco_numero: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  correntista_nome: z.string().optional(),
});

type PastorFormData = z.infer<typeof pastorFormSchema>;

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: string | Element, opts: any) => string | number;
      reset: (id?: string | number) => void;
    };
  }
}

const PastorForm = () => {
  const form = useForm<PastorFormData>({
    resolver: zodResolver(pastorFormSchema),
    defaultValues: {
      nome_pastor: "",
      telefone: "",
      email: "",
      endereco: "",
      cep: "",
      cnpj: "",
      numero_fieis: "",
      modelo_desejado: "",
      banco: "",
      banco_numero: "",
      agencia: "",
      conta: "",
      correntista_nome: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detectar dispositivo móvel
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768 ||
        ('ontouchstart' in window);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Carregar hCaptcha
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITEKEY as string | undefined;
    if (!siteKey) return;
    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js?render=explicit";
    script.async = true;
    script.onload = () => setCaptchaReady(true);
    document.body.appendChild(script);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.removeChild(script);
    };
  }, []);

  const requestCaptchaToken = async (): Promise<string | null> => {
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITEKEY as string | undefined;
    if (!siteKey) {
      console.warn("⚠️ VITE_HCAPTCHA_SITEKEY não configurada");
      return null;
    }
    if (!captchaReady || !window.hcaptcha) {
      console.warn("⚠️ hCaptcha não está pronto");
      return null;
    }

    // Create a temporary container to render invisible widget
    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);

    try {
      const token = await new Promise<string>((resolve, reject) => {
        let widgetId: string | number;
        try {
          widgetId = window.hcaptcha!.render(container, {
            sitekey: siteKey,
            size: "invisible",
            callback: (t: string) => resolve(t),
            'error-callback': () => reject(new Error("captcha_error")),
            'expired-callback': () => reject(new Error("captcha_expired")),
          });
          // Execute immediately
          // @ts-ignore
          window.hcaptcha!.execute(widgetId);
        } catch (e) {
          reject(e as Error);
        }
      });
      setCaptchaToken(token);
      return token;
    } catch (error) {
      console.warn("⚠️ Erro no captcha, continuando sem ele:", error);
      return null;
    } finally {
      try {
        document.body.removeChild(container);
      } catch (e) {
        // Container já foi removido
      }
    }
  };

  const onSubmit = async (data: PastorFormData) => {
    setIsSubmitting(true);
    try {
      const submitUrl = "https://igjmwawkepypqdyoljgl.supabase.co/functions/v1/submit-form";
      console.log("🔍 DEBUG - URL de envio:", submitUrl);
      console.log("🔍 DEBUG - Dados do formulário:", data);
      
      if (!submitUrl) {
        console.error("❌ ERRO - VITE_FORM_SUBMIT_URL não configurada");
        throw new Error("Configuração ausente. Defina VITE_FORM_SUBMIT_URL no ambiente.");
      }

      // Get captcha just-in-time
      const token = await requestCaptchaToken();
      console.log("🔍 DEBUG - Token captcha:", token);

      console.log("🔍 DEBUG - Enviando requisição para:", submitUrl);
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnam13YXdrZXB5cHFkeW9samdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzQ1ODMsImV4cCI6MjA3MTIxMDU4M30.TPGLDO7W3bSuXgXBKdll_SwTVLFI_qDw_aWpERcILQ0",
        },
        body: JSON.stringify({ ...data, captchaToken: token ?? captchaToken }),
      });

      console.log("🔍 DEBUG - Status da resposta:", response.status);
      console.log("🔍 DEBUG - Headers da resposta:", Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ ERRO - Resposta não OK:", errorData);
        console.error("❌ ERRO - Detalhes:", errorData.details);
        console.error("❌ ERRO - Código:", errorData.code);
        throw new Error(errorData.details || errorData.error || "Falha ao enviar. Tente novamente mais tarde.");
      }

      const result = await response.json();
      console.log("🔍 DEBUG - Resultado da resposta:", result);
      
      // Salvar dados básicos do pedido para eventual consulta
      if (result.ok) {
        const paymentData = {
          id: `pedido_${Date.now()}`,
          nome_pastor: data.nome_pastor,
          email: data.email,
          modelo_desejado: data.modelo_desejado,
          valor: data.modelo_desejado.includes("Modelo C")
            ? 499.00
            : data.modelo_desejado.includes("Modelo B")
              ? 229.00
              : 169.00,
          created_at: new Date().toISOString()
        };
        localStorage.setItem("pendingPayment", JSON.stringify(paymentData));
        console.log("🔍 DEBUG - Dados salvos no localStorage:", paymentData);
      }
      
      // Sem redirecionamento para checkout externo
      if (result.ok) {
        console.log("Formulário enviado, mas sem URL de pagamento:", result);
        toast({
          title: "Formulário enviado com sucesso!",
          description: "Entraremos em contato em breve para finalizar seu pedido.",
        });
        form.reset();
        return;
      }

      toast({
        title: "Formulário enviado com sucesso!",
        description: "Entraremos em contato em breve.",
      });

      form.reset();
    } catch (error: any) {
      console.error("❌ ERRO - Erro ao enviar formulário:", error);
      toast({
        title: "Erro ao enviar formulário",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "5511985424955"; // Substitua pelo número da UNNI
    const message = "Olá! Gostaria de mais informações sobre os serviços da UNNI para igrejas.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const fieisOptions = [
    "Até 50",
    "51 - 100",
    "101 - 200",
    "201 - 500",
    "501 - 1000",
    "Mais de 1000"
  ];

  return (
    <section id="contato" className="py-20 px-4 bg-unni-navy">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Church className="h-8 w-8 text-unni-cyan" />
            <h2 className="text-3xl md:text-4xl font-bold text-unni-blue-light">
              Conecte sua Igreja!
            </h2>
          </div>
          <p className="text-unni-text-secondary text-lg max-w-2xl mx-auto">
            Preencha o formulário abaixo para realizar seu pedido.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <Card className="bg-card/50 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-unni-blue-light">Cadastro da Igreja</CardTitle>
              <CardDescription className="text-unni-text-secondary">
                Informe os dados da sua igreja para seguirmos com seu pedido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="nome_pastor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-unni-text-primary">Nome do Pastor*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite o nome completo do pastor"
                            className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-unni-text-primary">Telefone com DDD*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 99999-9999"
                            className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-unni-text-primary">Email*</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="pastor@igreja.com.br"
                            className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endereco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-unni-text-primary">Endereço (Igreja/Número da Rua)*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Rua da Igreja, 123 - Bairro - Cidade"
                            className="bg-muted/50 border-border focus:border-unni-cyan text-foreground min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-unni-text-primary">CEP*</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12345-678"
                              className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-unni-text-primary">CNPJ*</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="12.345.678/0001-90"
                              className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="numero_fieis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-unni-text-primary">Número de Fiéis*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/50 border-border focus:border-unni-cyan text-foreground">
                              <SelectValue placeholder="Selecione a quantidade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent 
                            className="bg-popover border-border max-h-[200px] overflow-y-auto"
                            position="popper"
                            sideOffset={0}
                            align="start"
                            avoidCollisions={true}
                            collisionPadding={8}
                          >
                            {fieisOptions.map((option) => (
                              <SelectItem 
                                key={option} 
                                value={option} 
                                className="text-foreground hover:bg-muted min-h-[44px] py-3 px-4 text-base touch-manipulation"
                              >
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="modelo_desejado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-unni-text-primary">Modelo desejado*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/50 border-border focus:border-unni-cyan text-foreground">
                              <SelectValue placeholder="Selecione um modelo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent 
                            className="bg-popover border-border max-h-[200px] overflow-y-auto"
                            position="popper"
                            sideOffset={0}
                            align="start"
                            avoidCollisions={true}
                            collisionPadding={8}
                          >
                            <SelectItem 
                              value="Modelo A - (Promoção) R$169,00/mês (30 conexões simultaneas)" 
                              className="text-foreground hover:bg-muted min-h-[44px] py-3 px-4 text-base touch-manipulation"
                            >
                              Modelo A - (Promoção) R$169,00/mês (30 conexões simultaneas)
                            </SelectItem>
                            <SelectItem 
                              value="Modelo B - (Promoção) R$229,00/mês (50 conexões simultaneas)" 
                              className="text-foreground hover:bg-muted min-h-[44px] py-3 px-4 text-base touch-manipulation"
                            >
                              Modelo B - (Promoção) R$229,00/mês (50 conexões simultaneas)
                            </SelectItem>
                            <SelectItem 
                              value="Modelo C - (Promoção) R$499,00/mês (200 conexões simultaneas)" 
                              className="text-foreground hover:bg-muted min-h-[44px] py-3 px-4 text-base touch-manipulation"
                            >
                              Modelo C - (Promoção) R$499,00/mês (200 conexões simultaneas)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <h4 className="text-unni-blue-light font-semibold mb-2">Dados bancários (opcional)</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="banco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-unni-text-primary">Banco</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nome do banco (ex: Itaú, Bradesco)"
                                className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="banco_numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-unni-text-primary">Banco - Número</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Código do banco (ex: 341)"
                                className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="agencia"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-unni-text-primary">Agência</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Agência (somente números)"
                                className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="conta"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-unni-text-primary">Conta</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Conta (com dígito, se houver)"
                                className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="correntista_nome"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel className="text-unni-text-primary">Correntista - Nome</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Nome completo do correntista"
                                className="bg-muted/50 border-border focus:border-unni-cyan text-foreground"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-unni-cyan to-unni-blue-light text-unni-navy font-semibold hover:shadow-lg hover:shadow-unni-cyan/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSubmitting ? "Enviando..." : "ENVIAR PEDIDO"}
                  </Button>

                  <div className="text-center space-y-2">
                    <p className="text-xs text-unni-text-secondary">
                      Prometemos não utilizar suas informações de contato para enviar qualquer tipo de SPAM.
                    </p>
                    <p className="text-xs text-amber-500 font-medium">
                      ⏰ Prazo de envio até 45 dias após a confirmação do pagamento
                    </p>
                  </div>
                </form>
                <div className="mt-2">
                  <div id="hcaptcha-container" />
                </div>
              </Form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="order-2 bg-card/50 backdrop-blur-sm border-border">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-unni-blue-light mb-4">
                  Precisa de ajuda?
                </h3>
                <p className="text-unni-text-secondary mb-6">
                  Entre em contato diretamente conosco via WhatsApp e receba atendimento personalizado.
                </p>
                <Button 
                  onClick={handleWhatsAppContact}
                  className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                  size="lg"
                >
                  <img 
                    src="/images/pastor-form.png" 
                    alt="WhatsApp" 
                    className="mr-2 h-5 w-5 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  Falar no WhatsApp
                </Button>
              </CardContent>
            </Card>

            <Card className="order-1 bg-gradient-to-r from-unni-cyan/10 to-unni-blue-light/10 backdrop-blur-sm border border-unni-cyan/40 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-unni-blue-light mb-4">
                  Modelos de equipamento
                </h3>
                <ul className="space-y-3 text-unni-text-secondary">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-emerald-400 font-semibold">Modelo A</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white font-semibold">Até 30 conexões simultaneas (Wi-fi + cadastro + meio de pagamento)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white font-semibold">Valor R$169,00 (Promoção Atual) - Valor original R$199,00/mês</span>
                  </li>
                  <li className="my-2 border-t border-border/40"></li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sky-400 font-semibold">Modelo B</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white font-semibold">Até 50 conexões simultaneas (Wi-fi + cadastro + meio de pagamento + mídia)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white font-semibold">Valor R$229,00 (Promoção Atual) - Valor original 299,00/mês</span>
                  </li>
                  <li className="my-2 border-t border-border/40"></li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-violet-400 font-semibold">Modelo C</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white font-semibold">Até 200 conexões simultaneas (Wi-fi + cadastro + meio de pagamento + mídia)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-violet-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white font-semibold">Valor R$499,00/mês (Promoção Atual) - Valor original R$599,00/mês</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><span className="font-semibold">Modelo de contratação:</span> locação de equipamentos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Cobrança via fatura de locação e boleto bancario</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-xs text-unni-text-secondary/80">(Por ser contrato de locação, não existe custo de aquisição do equipamento, apenas o custo da mensalidade. *Promoção valida até Dez/25 ou para as primeiras 500 igrejas.*)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PastorForm;
