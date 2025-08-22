export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-cavalcante-gray text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-cavalcante-orange text-white px-3 py-2 rounded-md font-bold text-lg">
                CI
              </div>
              <span className="ml-2 text-white font-bold text-xl">Cavalcante Investimentos</span>
            </div>
            <p className="text-gray-300">
              Transformando sonhos em realidade através de investimentos inteligentes.
            </p>
          </div>
          
          <div className="md:text-right">
            <nav className="mb-4 space-x-6">
              <button 
                onClick={() => scrollToSection('home')} 
                className="text-gray-300 hover:text-cavalcante-orange transition-colors"
                data-testid="footer-nav-home"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('comofunciona')} 
                className="text-gray-300 hover:text-cavalcante-orange transition-colors"
                data-testid="footer-nav-how-it-works"
              >
                Como funciona
              </button>
              <button 
                onClick={() => scrollToSection('clientes')} 
                className="text-gray-300 hover:text-cavalcante-orange transition-colors"
                data-testid="footer-nav-clients"
              >
                Nossos clientes
              </button>
              <button 
                onClick={() => scrollToSection('reclameaqui')} 
                className="text-gray-300 hover:text-cavalcante-orange transition-colors"
                data-testid="footer-nav-complaints"
              >
                Reclame Aqui
              </button>
              <button 
                onClick={() => scrollToSection('contatos')} 
                className="text-gray-300 hover:text-cavalcante-orange transition-colors"
                data-testid="footer-nav-contact"
              >
                Contatos
              </button>
            </nav>
            <p className="text-gray-300 text-sm">
              2024 © Todos os Direitos Reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
