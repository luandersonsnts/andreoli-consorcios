import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="bg-cavalcante-orange text-white px-3 py-2 rounded-md font-bold text-lg">
            CI
          </div>
          <span className="ml-2 text-cavalcante-gray font-bold text-xl">Cavalcante</span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <button 
            onClick={() => scrollToSection('home')} 
            className="text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
            data-testid="nav-home"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('comofunciona')} 
            className="text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
            data-testid="nav-how-it-works"
          >
            Como funciona
          </button>
          <button 
            onClick={() => scrollToSection('clientes')} 
            className="text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
            data-testid="nav-clients"
          >
            Nossos clientes
          </button>
          <button 
            onClick={() => scrollToSection('reclameaqui')} 
            className="text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
            data-testid="nav-complaints"
          >
            Reclame Aqui
          </button>
          <button 
            onClick={() => scrollToSection('contatos')} 
            className="text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
            data-testid="nav-contact"
          >
            Contatos
          </button>
        </nav>
        
        <button 
          onClick={() => scrollToSection('simule')}
          className="hidden md:block bg-cavalcante-orange text-white px-6 py-2 rounded-full font-medium hover:bg-cavalcante-orange-light transition-colors"
          data-testid="button-simulate-header"
        >
          Simular agora
        </button>
        
        <button 
          className="md:hidden text-cavalcante-gray" 
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
              className="block text-cavalcante-gray"
              data-testid="nav-mobile-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('comofunciona')} 
              className="block text-cavalcante-gray"
              data-testid="nav-mobile-how-it-works"
            >
              Como funciona
            </button>
            <button 
              onClick={() => scrollToSection('clientes')} 
              className="block text-cavalcante-gray"
              data-testid="nav-mobile-clients"
            >
              Nossos clientes
            </button>
            <button 
              onClick={() => scrollToSection('reclameaqui')} 
              className="block text-cavalcante-gray"
              data-testid="nav-mobile-complaints"
            >
              Reclame Aqui
            </button>
            <button 
              onClick={() => scrollToSection('contatos')} 
              className="block text-cavalcante-gray"
              data-testid="nav-mobile-contact"
            >
              Contatos
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
