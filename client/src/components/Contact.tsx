import { Phone, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Contact() {
  return (
    <section id="contatos" className="py-16 bg-firme-light-gray">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Escritório moderno de investimentos" 
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
          
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-6">
              Na Firme INVESTIMENTOS você conquista seus objetivos financeiros com muito mais facilidade.
            </h2>
            
            <h3 className="text-2xl font-bold text-firme-blue mb-8">Contatos</h3>
            
            <div className="space-y-4">
              <a 
                href="https://api.whatsapp.com/send?phone=558799143-6244&text=Olá,%20estou%20interessado%20em%20investimentos.%20Quero%20ajuda%20da%20Firme%20INVESTIMENTOS%20para%20conquistar%20meus%20objetivos%20financeiros!" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="text-green-500 text-xl mr-3" />
(87) 99143-6244
              </a>
              
              <a 
                href="tel:+558799143-6244" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-phone"
              >
                <Phone className="text-firme-blue text-xl mr-3" />
(87) 99143-6244
              </a>
              
              <a 
                href="mailto:contato@firmeinvestimentos.com.br" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-email"
              >
                <Mail className="text-firme-blue text-xl mr-3" />
contato@firmeinvestimentos.com.br
              </a>
              
              <a 
                href="https://www.google.com/maps/place/Av.+Anízio+Moura+Leal,+241+-+Km2,+Petrolina+-+PE" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-address"
              >
                <MapPin className="text-firme-blue text-xl mr-3" />
                Av. Anízio Moura Leal, 241 - Km2, Petrolina-Pe
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
