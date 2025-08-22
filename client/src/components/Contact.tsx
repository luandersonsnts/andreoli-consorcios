import { Phone, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Contact() {
  return (
    <section id="contatos" className="py-16 bg-cavalcante-light-gray">
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
            <h2 className="text-3xl lg:text-4xl font-bold text-cavalcante-gray mb-6">
              Na Cavalcante Investimentos você conquista seus objetivos financeiros com muito mais facilidade.
            </h2>
            
            <h3 className="text-2xl font-bold text-cavalcante-orange mb-8">Contatos</h3>
            
            <div className="space-y-4">
              <a 
                href="https://api.whatsapp.com/send?phone=5587996807532&text=Olá,%20estou%20interessado%20em%20investimentos.%20Quero%20ajuda%20da%20Cavalcante%20Investimentos%20para%20conquistar%20meus%20objetivos%20financeiros!" 
                className="flex items-center text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="text-green-500 text-xl mr-3" />
                (87) 99680-7532
              </a>
              
              <a 
                href="tel:+5587996807532" 
                className="flex items-center text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
                data-testid="link-phone"
              >
                <Phone className="text-cavalcante-orange text-xl mr-3" />
                (87) 99680-7532
              </a>
              
              <a 
                href="mailto:contato@cavalcanteinvestimentos.com.br" 
                className="flex items-center text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
                data-testid="link-email"
              >
                <Mail className="text-cavalcante-orange text-xl mr-3" />
                contato@cavalcanteinvestimentos.com.br
              </a>
              
              <a 
                href="https://www.google.com/maps/dir/-9.3963218,-40.4847265/Cavalcante+Investimentos" 
                className="flex items-center text-cavalcante-gray hover:text-cavalcante-orange transition-colors"
                data-testid="link-address"
              >
                <MapPin className="text-cavalcante-orange text-xl mr-3" />
                Rua Crispim de Amorim Coelho, Centro, Petrolina-Pe, 296
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
