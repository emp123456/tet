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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, Church, CheckCircle } from "lucide-react";
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
        // Mostrar modal de sucesso em vez de toast
        setShowSuccessModal(true);
        form.reset();
        return;
      }

      // Fallback para outros casos de sucesso
      setShowSuccessModal(true);
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
    <section id="contato" className="py-8 px-4 bg-unni-navy lg:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-first: Smaller spacing and text */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex items-center justify-center gap-2 mb-3 lg:gap-3 lg:mb-4">
            <Church className="h-6 w-6 text-unni-cyan lg:h-8 lg:w-8" />
            <h2 className="text-2xl font-bold text-unni-blue-light lg:text-3xl xl:text-4xl">
              Conecte sua Igreja!
            </h2>
          </div>
          <p className="text-unni-text-secondary text-base max-w-2xl mx-auto lg:text-lg">
            Preencha o formulário abaixo para realizar seu pedido.
          </p>
        </div>

        {/* Mobile-first: Single column, then grid on larger screens */}
        <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start lg:space-y-0">
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

                  {/* Mobile-first: Single column, then grid */}
                  <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
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
                            className="bg-popover border-border max-h-[150px] overflow-y-auto"
                            position={isMobile ? "item-aligned" : "popper"}
                            sideOffset={0}
                            align="start"
                            avoidCollisions={true}
                            collisionPadding={4}
                            side="bottom"
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
                            className="bg-popover border-border max-h-[150px] overflow-y-auto"
                            position={isMobile ? "item-aligned" : "popper"}
                            sideOffset={0}
                            align="start"
                            avoidCollisions={true}
                            collisionPadding={4}
                            side="bottom"
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
                    {/* Mobile-first: Single column, then grid */}
                    <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
                      <FormField
                        control={form.control}
                        name="banco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-unni-text-primary">Banco</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Opcional"
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
                            <FormLabel className="text-unni-text-primary">Banco - Numero</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Opcional"
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
                                placeholder="Opcional"
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
                                placeholder="Opcional"
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
                                placeholder="Opcional"
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
                  
                  {/* Mobile-first: Larger button for touch */}
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-unni-cyan to-unni-blue-light text-unni-navy font-semibold hover:shadow-lg hover:shadow-unni-cyan/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed lg:h-12"
                    size="lg"
                  >
                    <Send className="mr-2 h-5 w-5 lg:h-4 lg:w-4" />
                    <span className="text-base lg:text-sm">
                      {isSubmitting ? "Enviando..." : "ENVIAR PEDIDO"}
                    </span>
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

          {/* Mobile-first: Cards stack vertically, then side-by-side on desktop */}
          <div className="space-y-6 lg:flex lg:flex-col lg:gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border lg:order-2">
              <CardContent className="p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-unni-blue-light mb-3 lg:text-xl lg:mb-4">
                  Precisa de ajuda?
                </h3>
                <p className="text-unni-text-secondary mb-4 text-sm lg:text-base lg:mb-6">
                  Entre em contato diretamente conosco via WhatsApp e receba atendimento personalizado.
                </p>
                <Button 
                  onClick={handleWhatsAppContact}
                  className="w-full h-12 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-400/20 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 lg:h-10"
                  size="lg"
                >
                  <img 
                    src="/images/pastor-form.png" 
                    alt="WhatsApp" 
                    className="mr-2 h-5 w-5 object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.6)] lg:h-4 lg:w-4"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="text-sm lg:text-xs">Falar no WhatsApp</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-unni-cyan/10 to-unni-blue-light/10 backdrop-blur-sm border border-unni-cyan/40 shadow-xl lg:order-1">
              <CardContent className="p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-unni-blue-light mb-3 lg:text-xl lg:mb-4">
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

      {/* Modal de Sucesso - Mobile First */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md mx-auto bg-card border-border">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-emerald-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-unni-blue-light">
              Formulário Enviado!
            </DialogTitle>
            <DialogDescription className="text-unni-text-secondary text-base">
              Seu pedido foi enviado com sucesso. Entraremos em contato em breve para finalizar seu pedido.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-gradient-to-r from-unni-cyan to-unni-blue-light text-unni-navy font-semibold px-8 py-3 h-12 min-w-[120px]"
            >
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PastorForm;
