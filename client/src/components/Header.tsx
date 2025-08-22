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
          <img 
            src="/attached_assets/Screenshot_2025-08-21-22-46-14-904_com.instagram.android-edit_1755827387110.jpg" 
            alt="Firme Investimentos Logo" 
            className="w-12 h-12 rounded-full mr-3"
          />
          <span className="text-firme-gray font-bold text-xl">Firme INVESTIMENTOS</span>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <button 
            onClick={() => scrollToSection('home')} 
            className="text-firme-gray hover:text-firme-blue transition-colors"
            data-testid="nav-home"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('comofunciona')} 
            className="text-firme-gray hover:text-firme-blue transition-colors"
            data-testid="nav-how-it-works"
          >
            Como funciona
          </button>
          <button 
            onClick={() => scrollToSection('clientes')} 
            className="text-firme-gray hover:text-firme-blue transition-colors"
            data-testid="nav-clients"
          >
            Nossos clientes
          </button>
          <button 
            onClick={() => scrollToSection('reclameaqui')} 
            className="text-firme-gray hover:text-firme-blue transition-colors"
            data-testid="nav-complaints"
          >
            Reclame Aqui
          </button>
          <button 
            onClick={() => scrollToSection('contatos')} 
            className="text-firme-gray hover:text-firme-blue transition-colors"
            data-testid="nav-contact"
          >
            Contatos
          </button>
        </nav>
        
        <button 
          onClick={() => scrollToSection('simule')}
          className="hidden md:block bg-firme-blue text-white px-6 py-2 rounded-full font-medium hover:bg-firme-blue-light transition-colors"
          data-testid="button-simulate-header"
        >
          Simular agora
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
              Home
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
          </div>
        </div>
      )}
    </header>
  );
}
