import logoPath from "@assets/logo_1755893657223.png";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-firme-gray text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={logoPath}
                alt="FIRME INVESTIMENTOS Logo" 
                className="w-10 h-10 mr-3"
              />
              <span className="text-white font-bold text-xl">FIRME INVESTIMENTOS</span>
            </div>
            <p className="text-gray-300 mb-4">
              Construindo patrimônios sólidos com estratégias de investimento personalizadas.
            </p>
            <div className="text-gray-300 text-sm">
              <p>📍 Rua Dr. José Mariano, 114B</p>
              <p>Cidade Garanhuns - PE</p>
              <p>📞 (87) 98162-0542</p>
            </div>
          </div>
          
          <div className="md:text-right">
            <nav className="mb-4 space-x-6">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-gray-300 hover:text-firme-blue transition-colors"
                data-testid="footer-nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('comofunciona')} 
                className="text-gray-300 hover:text-firme-blue transition-colors"
                data-testid="footer-nav-how-it-works"
              >
                Como funciona
              </button>
              <button 
                onClick={() => scrollToSection('clientes')} 
                className="text-gray-300 hover:text-firme-blue transition-colors"
                data-testid="footer-nav-clients"
              >
                Nossos clientes
              </button>
              <button 
                onClick={() => scrollToSection('reclameaqui')} 
                className="text-gray-300 hover:text-firme-blue transition-colors"
                data-testid="footer-nav-complaints"
              >
                Reclame Aqui
              </button>
              <button 
                onClick={() => scrollToSection('contatos')} 
                className="text-gray-300 hover:text-firme-blue transition-colors"
                data-testid="footer-nav-contact"
              >
                Contatos
              </button>
            </nav>
            <p className="text-gray-300 text-sm">
              2025 © Todos os Direitos Reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
