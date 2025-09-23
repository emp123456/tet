import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UnniSection from "@/components/UnniSection";
import PastorForm from "@/components/PastorForm";
import LogosSection from "@/components/LogosSection";
import Hero from "@/components/Hero";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se há pagamento pendente no localStorage
    const pendingPayment = localStorage.getItem("pendingPayment");
    
    if (pendingPayment) {
      try {
        const paymentData = JSON.parse(pendingPayment);
        
        // Verificar se o pagamento foi criado nas últimas 24 horas
        const paymentDate = new Date(paymentData.created_at);
        const now = new Date();
        const hoursDiff = (now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
          // Verificar se o pagamento não foi cancelado no banco
          checkPaymentStatus(paymentData.tracking_id).then((isValid) => {
            if (isValid) {
              navigate("/pending");
            } else {
              // Se foi cancelado ou não existe, remover do localStorage
              localStorage.removeItem("pendingPayment");
            }
          });
          return;
        } else {
          // Remover dados antigos (mais de 24 horas)
          localStorage.removeItem("pendingPayment");
        }
      } catch (error) {
        console.error("Erro ao verificar pagamento pendente:", error);
        localStorage.removeItem("pendingPayment");
      }
    }
  }, [navigate]);

  const checkPaymentStatus = async (trackingId: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://igjmwawkepypqdyoljgl.supabase.co/functions/v1/check-payment-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnam13YXdrZXB5cHFkeW9samdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2MzQ1ODMsImV4cCI6MjA3MTIxMDU4M30.TPGLDO7W3bSuXgXBKdll_SwTVLFI_qDw_aWpERcILQ0"}`,
        },
        body: JSON.stringify({ tracking_id: trackingId }),
      });

      return response.ok;
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      return false;
    }
  };

  return (
    <main className="min-h-screen">
      <Hero />
      <UnniSection />
      <LogosSection />
      <PastorForm />
    </main>
  );
};

export default Index;
