export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-firme-gray via-gray-800 to-firme-gray text-white py-8 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-firme-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="group">
            <div className="flex items-center mb-4 transition-transform duration-300 group-hover:scale-105">
              <img 
            src="/andreoli-logo.svg?v=5"
            alt="ANDREOLI CONSÓRCIOS Logo" 
            className="w-16 h-8 mr-3 object-contain transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 drop-shadow-lg"
            onError={(e) => {
              console.error('Erro ao carregar logo no footer:', e);
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-white font-bold text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-200 group-hover:bg-clip-text transition-all duration-300 drop-shadow-sm">
            ANDREOLI CONSÓRCIOS
          </span>
            </div>
            <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
              Realizando sonhos através de consórcios com as melhores condições do mercado.
            </p>
            <div className="text-gray-300 text-sm space-y-1 group-hover:text-gray-200 transition-colors duration-300">
              <p className="hover:text-firme-blue transition-colors duration-200 cursor-default">📍 Av. Raul Alves - Santo Antonio</p>
              <p className="hover:text-firme-blue transition-colors duration-200 cursor-default">Juazeiro - BA, 48903-260</p>
              <p className="hover:text-firme-blue transition-colors duration-200 cursor-default">📞 (74) 98121-3461</p>
            </div>
          </div>
          
          <div className="md:text-right">
            <nav className="mb-4 space-x-6">
              <button 
                onClick={() => scrollToSection('home')} 
                className="relative text-gray-300 hover:text-firme-blue transition-all duration-300 hover:scale-110 hover:font-medium group"
                data-testid="footer-nav-home"
              >
                <span className="relative z-10">Inicio</span>
                <div className="absolute inset-0 bg-firme-blue/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-1"></div>
              </button>
              <button 
                onClick={() => scrollToSection('comofunciona')} 
                className="relative text-gray-300 hover:text-firme-blue transition-all duration-300 hover:scale-110 hover:font-medium group"
                data-testid="footer-nav-how-it-works"
              >
                <span className="relative z-10">Como funciona</span>
                <div className="absolute inset-0 bg-firme-blue/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-1"></div>
              </button>
              <button 
                onClick={() => scrollToSection('clientes')} 
                className="relative text-gray-300 hover:text-firme-blue transition-all duration-300 hover:scale-110 hover:font-medium group"
                data-testid="footer-nav-clients"
              >
                <span className="relative z-10">Nossos clientes</span>
                <div className="absolute inset-0 bg-firme-blue/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-1"></div>
              </button>
              <button 
                onClick={() => scrollToSection('reclameaqui')} 
                className="relative text-gray-300 hover:text-firme-blue transition-all duration-300 hover:scale-110 hover:font-medium group"
                data-testid="footer-nav-complaints"
              >
                <span className="relative z-10">Reclame Aqui</span>
                <div className="absolute inset-0 bg-firme-blue/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-1"></div>
              </button>
              <button 
                onClick={() => scrollToSection('contatos')} 
                className="relative text-gray-300 hover:text-firme-blue transition-all duration-300 hover:scale-110 hover:font-medium group"
                data-testid="footer-nav-contact"
              >
                <span className="relative z-10">Contatos</span>
                <div className="absolute inset-0 bg-firme-blue/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-1"></div>
              </button>
            </nav>
            <p className="text-gray-300 text-sm hover:text-gray-200 transition-colors duration-300">
              2025 © Todos os Direitos Reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
