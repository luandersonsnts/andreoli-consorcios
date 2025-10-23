import { Calculator, Sparkles, TrendingUp } from "lucide-react";

export default function Hero() {
  const scrollToConsortium = () => {
    // Primeiro tenta rolar para os botões de categoria
    const consortiumButtons = document.querySelector('[data-consortium-buttons]');
    if (consortiumButtons) {
      consortiumButtons.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback para a seção de consórcio
      document.getElementById('consorcio')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-firme-light-gray via-blue-50 to-white min-h-screen flex items-center relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-firme-blue rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <div className="mb-6 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-firme-blue/10 rounded-full border border-blue-200">
              <Sparkles className="w-4 h-4 text-firme-blue mr-2 animate-pulse" />
              <span className="text-sm font-medium text-firme-blue">Conquiste seu futuro</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold text-firme-gray mb-4 leading-tight">
              Tire seu<br />
              <span className="text-transparent bg-gradient-to-r from-firme-blue to-blue-600 bg-clip-text animate-pulse">SONHO</span> do papel<br />
              com <span className="text-transparent bg-gradient-to-r from-firme-blue to-blue-600 bg-clip-text italic">consórcio!</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Tenha acesso às melhores estratégias de investimento e construa uma base financeira sólida para o seu futuro. 
              Na <strong className="text-firme-blue">ANDREOLI CONSÓRCIOS</strong> você encontra soluções personalizadas para cada perfil de investidor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToConsortium}
                className="relative group bg-gradient-to-r from-firme-blue to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-xl inline-flex items-center justify-center overflow-hidden"
                data-testid="button-simulate-hero"
              >
                <span className="relative z-10 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                  Começar agora
                  <TrendingUp className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-firme-blue to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => document.getElementById('comofunciona')?.scrollIntoView({ behavior: 'smooth' })}
                className="relative group px-8 py-4 rounded-full font-medium border-2 border-firme-blue text-firme-blue hover:bg-firme-blue hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center justify-center"
              >
                <span className="relative z-10">Saiba mais</span>
                <div className="absolute inset-0 bg-firme-blue opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
            <div className="relative group w-full h-full">
              <img
                src="/hero-office.jpg"
                alt="Escritório Andreoli Consórcios"
                className="rounded-xl shadow-2xl w-full h-auto max-h-[350px] lg:max-h-[420px] object-cover transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl"
              />
              
              {/* Elementos flutuantes decorativos */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-firme-blue rounded-full opacity-80 animate-bounce delay-300"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-60 animate-bounce delay-700"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
