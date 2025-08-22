import { Calculator } from "lucide-react";

export default function Hero() {
  const scrollToSimulation = () => {
    document.getElementById('simule')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="pt-20 bg-firme-light-gray min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold text-firme-gray mb-4 leading-tight">
              CONSTRUA SEU<br />
              <span className="text-firme-blue">PATRIMÔNIO</span> com<br />
              <span className="text-firme-blue italic">inteligência!</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Tenha acesso às melhores estratégias de investimento e construa uma base financeira sólida para o seu futuro. 
              Na <strong>FIRME INVESTIMENTOS</strong> você encontra soluções personalizadas para cada perfil de investidor.
            </p>
            
            <button 
              onClick={scrollToSimulation}
              className="bg-firme-blue text-white px-8 py-3 rounded-full font-medium hover:bg-firme-blue-light transition-colors inline-flex items-center"
              data-testid="button-simulate-hero"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Começar agora
            </button>
          </div>
          
          <div className="lg:w-1/2 relative">
            <img 
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Investimentos e crescimento financeiro" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
