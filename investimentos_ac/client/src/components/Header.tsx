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
        <div className="flex items-center group cursor-pointer transition-all duration-300 hover:scale-105">
          <div className="relative">
            <img 
              src="/andreoli-logo.svg?v=5"
              alt="ANDREOLI CONSÓRCIOS Logo" 
              className="w-20 h-12 mr-4 object-contain transition-all duration-300 group-hover:scale-110 drop-shadow-lg"
              onError={(e) => {
                console.error('Erro ao carregar logo:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-blue-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"></div>
          </div>
          <span className="text-gray-900 font-bold text-2xl bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text group-hover:text-transparent transition-all duration-300 drop-shadow-sm">
            ANDREOLI CONSÓRCIOS
          </span>
        </div>
        
        <nav className="hidden md:flex space-x-2">
          <button 
            onClick={() => scrollToSection('home')} 
            className="relative px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 group"
            data-testid="nav-home"
          >
            <span className="relative z-10">Inicio</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>
          <button 
            onClick={() => scrollToSection('comofunciona')} 
            className="relative px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 group"
            data-testid="nav-how-it-works"
          >
            <span className="relative z-10">Como funciona</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>
          <button 
            onClick={() => scrollToSection('clientes')} 
            className="relative px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 group"
            data-testid="nav-clients"
          >
            <span className="relative z-10">Nossos clientes</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>
          <button 
            onClick={() => scrollToSection('reclameaqui')} 
            className="relative px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 group"
            data-testid="nav-complaints"
          >
            <span className="relative z-10">Reclame Aqui</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>
          <button 
            onClick={() => scrollToSection('contatos')} 
            className="relative px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 group"
            data-testid="nav-contact"
          >
            <span className="relative z-10">Contatos</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>
          <button 
            onClick={() => scrollToSection('trabalheconosco')} 
            className="relative px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 group"
            data-testid="nav-careers"
          >
            <span className="relative z-10">Trabalhe conosco</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>
          <button 
            onClick={handleLogin} 
            className="relative px-4 py-2 text-firme-gray hover:text-firme-blue transition-all duration-300 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 group flex items-center gap-1"
            data-testid="nav-login"
          >
            <LogIn className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
            <span className="relative z-10">Login</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </button>
        </nav>
        
        <button 
          onClick={() => scrollToSection('consorcio')}
          className="hidden md:block relative bg-gradient-to-r from-firme-blue to-blue-600 text-white px-8 py-3 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-xl group overflow-hidden"
          data-testid="button-simulate-header"
        >
          <span className="relative z-10 flex items-center gap-2">
            Simular agora
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
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
