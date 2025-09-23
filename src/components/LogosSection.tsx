const expo4Logo = "/images/expo4-logo.jpeg";
const quadrangularLogo = "/images/quadrangular-logo.jpeg";
const unniLogo = "/images/unni-logo.png";

const LogosSection = () => {
  return (
    <section className="py-20 bg-unni-navy">
      <div className="container mx-auto px-4">
        <div className="mb-6 -mt-6 md:-mt-10 flex items-center justify-center">
          <a
            href="#contato"
            aria-label="Adquirir Modelo"
            className="group relative inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-unni-navy focus:outline-none"
          >
            <span className="absolute -inset-px rounded-xl bg-gradient-to-r from-unni-cyan to-unni-blue-light opacity-90 transition group-hover:opacity-100" />
            <span className="relative z-10">Adquirir Modelo</span>
          </a>
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-unni-cyan to-unni-blue-light rounded-3xl opacity-25 blur-sm"></div>
          <div className="relative rounded-3xl border border-unni-cyan/30 bg-unni-navy/60 backdrop-blur-sm p-8 md:p-10 shadow-2xl">
            <div className="flex items-center justify-center gap-10 md:gap-16">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-unni-cyan to-unni-blue-light rounded-2xl opacity-25 group-hover:opacity-40 blur-sm transition"></div>
                <div className="relative rounded-2xl bg-white p-4 md:p-5">
                  <div className="h-24 md:h-28 lg:h-32 w-44 md:w-52 lg:w-60 flex items-center justify-center">
                    <img 
                      src={unniLogo} 
                      alt="UNNI Logo" 
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/320x120?text=UNNI'; }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-unni-cyan to-unni-blue-light rounded-2xl opacity-25 group-hover:opacity-40 blur-sm transition"></div>
                <div className="relative rounded-2xl bg-white p-4 md:p-5">
                  <div className="h-24 md:h-28 lg:h-32 w-44 md:w-52 lg:w-60 flex items-center justify-center">
                    <img 
                      src={expo4Logo} 
                      alt="EXPO4 Logo" 
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/320x120?text=EXPO4'; }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-unni-cyan to-unni-blue-light rounded-2xl opacity-25 group-hover:opacity-40 blur-sm transition"></div>
                <div className="relative rounded-2xl bg-white p-4 md:p-5">
                  <div className="h-24 md:h-28 lg:h-32 w-44 md:w-52 lg:w-60 flex items-center justify-center">
                    <img 
                      src={quadrangularLogo} 
                      alt="Igreja do Evangelho Quadrangular" 
                      className="max-h-full max-w-full object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/320x120?text=Quadrangular'; }}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogosSection;