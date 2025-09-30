import { Check, Shield, Zap, Activity, ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-unni-navy min-h-[80vh] flex items-center">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px]" />
        </div>
        {/* Radial highlight */}
        <div className="absolute -top-1/3 left-1/2 -translate-x-1/2 h-[90vh] w-[90vw] rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--unni-cyan)/0.14),transparent_45%)] blur-3xl" />
        {/* Animated blobs */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-unni-cyan/20 blur-3xl animate-blob" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-unni-blue-light/20 blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6">
                <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Left - Copy */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-unni-cyan to-unni-blue-light bg-clip-text text-transparent">
                Igreja Conectada
              </span>
            </h1>

            <p className="mt-4 text-lg text-unni-text-secondary max-w-xl md:max-w-none">
              Faça parte da rede de comunicação Wi-Fi.
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <li className="flex items-center gap-2 text-unni-text-secondary">
                <Check className="w-5 h-5 text-unni-cyan" />
                Conexão para usuários.
              </li>
              <li className="flex items-center gap-2 text-unni-text-secondary">
                <Activity className="w-5 h-5 text-unni-cyan" />
                Anunciantes do mercado publicitário.
              </li>
              <li className="flex items-center gap-2 text-unni-text-secondary">
                <Shield className="w-5 h-5 text-unni-cyan" />
                  Meio de pagamento.
              </li>
              <li className="flex items-center gap-2 text-unni-text-secondary">
                <Zap className="w-5 h-5 text-unni-cyan" />
                Visualização de banners e vídeos.
              </li>
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
              <a
                href="#contato"
                aria-label="Falar com especialista"
                className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-unni-navy focus:outline-none"
              >
                <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-unni-cyan to-unni-blue-light opacity-90 transition group-hover:opacity-100" />
                <span className="relative z-10">Adquirir Modelo</span>
              </a>
              <a
                href="#solucoes"
                aria-label="Ver soluções"
                className="inline-flex items-center justify-center rounded-xl border border-unni-cyan/30 bg-unni-navy/60 px-6 py-3 text-base font-semibold text-unni-text-primary hover:bg-unni-cyan/10 transition"
              >
                Ver soluções
              </a>
            </div>
          </div>

          {/* Right - Visual card */}
          <div className="relative">
            {/* Gradient frame */}
            <div className="relative rounded-[28px] p-[2px] bg-gradient-to-r from-unni-cyan to-unni-blue-light shadow-2xl">
              <div className="relative rounded-[26px] overflow-hidden bg-unni-navy/60 backdrop-blur-md">
                {/* Animated gradient canvas */}
                <div className="h-[280px] md:h-[360px] w-full rounded-[26px] bg-[linear-gradient(120deg,hsl(var(--unni-cyan)/0.35),hsl(var(--unni-blue-light)/0.35),transparent)] animate-gradient relative overflow-hidden">
                  <img
                    src="/images/hero-image.png"
                    alt="Igreja com transmissão e tecnologia"
                    className="absolute inset-0 w-full h-full object-cover"
                    decoding="async"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,hsl(var(--unni-navy)/0.45)_90%)]" />
                                  </div>
                {/* Soft inner glow */}
                <div className="pointer-events-none absolute inset-0 rounded-[26px] ring-1 ring-white/10" />
                {/* Floating accents */}
                <div className="pointer-events-none absolute -top-8 -left-6 h-24 w-24 rounded-full bg-unni-cyan/20 blur-2xl animate-float" />
                <div className="pointer-events-none absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-unni-blue-light/20 blur-2xl animate-float [animation-delay:1.2s]" />

                              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-unni-text-secondary/70 flex flex-col items-center">
        <ChevronDown className="w-5 h-5 animate-bounce" aria-hidden="true" />
        <span className="sr-only">Role para ver mais</span>
      </div>
    </section>
  );
};

export default Hero;
