import { useState, useEffect } from "react";
import { SiWhatsapp } from "react-icons/si";
import { getWhatsAppUrlWithMessage } from "../lib/runtimeEnv";
import { ArrowUp } from "lucide-react";

export default function WhatsAppFloat() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* WhatsApp Float Link */}
      <a
        href={getWhatsAppUrlWithMessage("Olá, tenho interesse em conhecer as soluções da ANDREOLI CONSÓRCIOS para realizar meu sonho!")}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        data-testid="whatsapp-float"
        aria-label="Abrir WhatsApp"
      >
        <SiWhatsapp className="text-2xl" />
      </a>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-firme-blue text-white p-3 rounded-full shadow-lg hover:bg-firme-blue-light transition-colors z-50"
          data-testid="scroll-to-top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
