import { useState } from "react";
import { Menu, X, LogIn } from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'consorcio') {
      // Para consórcio, rola para os botões de categoria
      const consortiumButtons = document.querySelector('[data-consortium-buttons]');
      if (consortiumButtons) {
        consortiumButtons.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Fallback para a seção de consórcio
        document.getElementById('consorcio')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    setLocation('/admin');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-white via-blue-50 to-white shadow-lg fixed w-full top-0 z-50 backdrop-blur-sm border-b border-blue-100">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center group cursor-pointer transition-all duration-300">
          <div className="relative">
            <img 
              src={`${import.meta.env.BASE_URL}andreoli-logo.svg?v=5`}
              alt="ANDREOLI CONSÓRCIOS Logo" 
              className="w-32 h-32 mr-6 object-contain transition-all duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error('Erro ao carregar logo:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <span className="text-andreoli-gray font-bold text-4xl transition-all duration-300 group-hover:text-andreoli-blue tracking-wide">
            ANDREOLI CONSÓRCIOS
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-2">
          <button 
            onClick={() => scrollToSection('home')} 
            className="px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50"
            data-testid="nav-home"
          >
            Inicio
          </button>
          <button 
            onClick={() => scrollToSection('comofunciona')} 
            className="px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50"
            data-testid="nav-how-it-works"
          >
            Como funciona
          </button>
          <button 
            onClick={() => scrollToSection('clientes')} 
            className="px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50"
            data-testid="nav-clients"
          >
            Nossos clientes
          </button>
          <button 
            onClick={() => scrollToSection('reclameaqui')} 
            className="px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50"
            data-testid="nav-complaints"
          >
            Reclame Aqui
          </button>
          <button 
            onClick={() => scrollToSection('contatos')} 
            className="px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50"
            data-testid="nav-contact"
          >
            Contatos
          </button>
          <button 
            onClick={() => scrollToSection('trabalheconosco')} 
            className="px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50"
            data-testid="nav-careers"
          >
            Trabalhe conosco
          </button>
          <button 
            onClick={handleLogin} 
            className="px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 flex items-center gap-1"
            data-testid="nav-login"
          >
            <LogIn className="h-4 w-4" />
            Login
          </button>
        </nav>
        
        <button 
          onClick={() => scrollToSection('consorcio')}
          className="hidden md:block relative bg-gradient-to-r from-firme-blue to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-xl group overflow-hidden"
          data-testid="button-simulate-header"
        >
          <span className="relative z-10 flex items-center gap-2">
            Simular agora
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-firme-blue to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        </button>
        
        <button 
          className="md:hidden text-firme-gray" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => scrollToSection('home')} 
              className="block text-firme-gray"
              data-testid="nav-mobile-home"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('comofunciona')} 
              className="block text-firme-gray"
              data-testid="nav-mobile-how-it-works"
            >
              Como funciona
            </button>
            <button 
              onClick={() => scrollToSection('clientes')} 
              className="block text-firme-gray"
              data-testid="nav-mobile-clients"
            >
              Nossos clientes
            </button>
            <button 
              onClick={() => scrollToSection('reclameaqui')} 
              className="block text-firme-gray"
              data-testid="nav-mobile-complaints"
            >
              Reclame Aqui
            </button>
            <button 
              onClick={() => scrollToSection('contatos')} 
              className="block text-firme-gray"
              data-testid="nav-mobile-contact"
            >
              Contatos
            </button>
            <button 
              onClick={() => scrollToSection('trabalheconosco')} 
              className="block text-firme-gray"
              data-testid="nav-mobile-careers"
            >
              Trabalhe conosco
            </button>
            <button 
              onClick={handleLogin} 
              className="block text-firme-gray flex items-center gap-1"
              data-testid="nav-mobile-login"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
