import { Phone, Mail, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export default function Contact() {
  return (
    <section id="contatos" className="py-16 bg-firme-light-gray">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Escritório moderno de investimentos"
              className="rounded-xl shadow-lg w-full h-auto"
            />
          </div>
          
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-6">
              Entre em contato conosco
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Estamos prontos para ajudar você a conquistar seus objetivos. Fale com nossos especialistas!
            </p>
            
            <h3 className="text-2xl font-bold text-firme-blue mb-8">Contatos</h3>
            
            <div className="space-y-4">
              <a 
                href="https://api.whatsapp.com/send?phone=5574988384902&text=Olá,%20tenho%20interesse%20em%20conhecer%20as%20soluções%20da%20ANDREOLI%20CONSÓRCIOS%20para%20conquistar%20meus%20objetivos!" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-whatsapp"
              >
                <SiWhatsapp className="text-green-500 text-xl mr-3" />
(74) 98838-4902
              </a>
              
              <a 
                href="tel:+5574988384902" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-phone"
              >
                <Phone className="text-firme-blue text-xl mr-3" />
(74) 98838-4902
              </a>
              
              <a 
                href="mailto:andreoli_consorcio@hotmail.com" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-email"
              >
                <Mail className="text-firme-blue text-xl mr-3" />
andreoli_consorcio@hotmail.com
              </a>
              
              <a 
                href="https://www.google.com/maps/place/Av.+Raul+Alves+-+Santo+Antonio,+Juazeiro+-+BA,+48903-260" 
                className="flex items-center text-firme-gray hover:text-firme-blue transition-colors"
                data-testid="link-address"
              >
                <MapPin className="text-firme-blue text-xl mr-3" />
                Av. Raul Alves - Santo Antonio, Juazeiro - BA, 48903-260
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
