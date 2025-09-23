import { Shield, Zap, Network, Users, Monitor } from "lucide-react";

const benefits = [
  {
    icon: Network,
    title: "Tecnologia Própria",
    description: "Solução integrada, produtos contemplam links, sistemas de gestão do link e gestão das conexões."
  },
  {
    icon: Zap,
    title: "Internet com Wi-Fi", 
    description: "Acesso via cadastro único. Atende LGPD (Lei geral de proteção de dados) e Marco Civil da internet"
  },
  {
    icon: Shield,
    title: "Publicador Online",
    description: "Para inserção de notícias e ações da igreja, através de banners, vídeos ou pesquisas."
  },
  {
    icon: Users,
    title: "Cadastro e Relatórios",
    description: "Registra os usuários e dados da utilização da rede em tempo real. Integração com envios de mensagens SMS"
  },
  {
    icon: Monitor,
    title: "Facil Instalação",
    description: "Para instalação, necessário apenas uma tomada de energia (110V/220V)."
  }
];

const UnniSection = () => {
  const highlights = [
    {
      img: "/images/unni-tech-1.png",
      title: "Wi-Fi",
      description: "Cadastro único, velocidade mínima de 2Mb/usuário. Raio de 30 metros de cobertura de sinal."
    },
    {
      img: "/images/unni-tech-2.png",
      title: "Publicidade e Notícias",
      description: "A rede Wi-Fi receberá anunciantes externos e comunicados da igreja."
    },
    {
      img: "/images/unni-tech-3.png",
      title: "Envelope Digital",
      description: "Ferramenta que visa facilitar o processo das ofertas via Wi-Fi."
    },
    {
      img: "/images/unni-tech-4.jpeg",
      title: "Relatórios e Cadastros",
      description: "Plataforma de gestão dos usuários com dados cadastrais e técnicos."
    }
  ];
  return (
    <section id="solucoes" className="bg-unni-navy pt-2 md:pt-4 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="relative w-full mb-28">
          <div className="absolute -inset-1 bg-gradient-to-r from-unni-cyan to-unni-blue-light rounded-3xl opacity-25 blur-sm"></div>
          <div className="relative rounded-3xl border border-unni-cyan/30 bg-unni-navy/60 backdrop-blur-sm p-8 md:p-10 shadow-2xl">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-unni-cyan to-unni-blue-light bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient">
                Por que escolher a UNNI?
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-unni-cyan to-unni-blue-light mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Column - Benefits */}
          <div className="space-y-8 lg:space-y-0 lg:flex lg:flex-col lg:gap-6 lg:h-full">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group flex items-start space-x-4 p-6 lg:p-7 rounded-xl border border-unni-cyan/20 bg-gradient-to-r from-unni-cyan/5 to-unni-blue-light/5 hover:from-unni-cyan/10 hover:to-unni-blue-light/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-unni-cyan/10 lg:flex-1"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-unni-cyan/20 flex items-center justify-center group-hover:bg-unni-cyan/30 transition-colors duration-300">
                    <benefit.icon className="w-6 h-6 text-unni-cyan" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-unni-blue-light mb-2 group-hover:text-unni-cyan transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-unni-text-secondary leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Highlights grid */}
          <div className="relative h-full">
            <div className="relative h-full rounded-2xl border border-unni-cyan/30 bg-unni-navy/60 backdrop-blur-sm p-6 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {highlights.map((item, idx) => (
                  <div key={idx} className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition flex flex-col transform hover:-translate-y-1 hover:shadow-xl">
                    <div className="relative w-full aspect-[3/4] bg-unni-navy/50">
                      <img 
                        src={item.img}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-contain p-2"
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Imagem'; }}
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-unni-blue-light font-semibold mb-1">{item.title}</h4>
                      <p className="text-unni-text-secondary text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnniSection;