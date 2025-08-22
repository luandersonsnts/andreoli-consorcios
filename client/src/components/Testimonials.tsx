import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "Com a assessoria da FIRME INVESTIMENTOS, minha carteira cresceu 180% em dois anos. A estratégia personalizada fez toda a diferença nos meus resultados!",
    name: "Carlos Eduardo",
    role: "Empresário",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  },
  {
    text: "Profissionais extremamente competentes! Consegui diversificar meus investimentos e agora tenho uma renda passiva consistente.",
    name: "Maria Santos",
    role: "Professora",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b734?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  },
  {
    text: "A FIRME mudou completamente minha relação com dinheiro. Aprendi a investir de forma estratégica e já vejo os primeiros resultados.",
    name: "João Oliveira",
    role: "Médico",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
  }
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <section id="clientes" className="py-16 bg-firme-light-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            Depoimentos de quem já transformou sua vida financeira:
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center relative">
            <button 
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-firme-blue hover:text-firme-blue-light transition-colors"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-firme-blue hover:text-firme-blue-light transition-colors"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="mb-6">
              <Quote className="text-firme-blue text-3xl mx-auto" />
            </div>
            
            <p className="text-lg text-gray-600 mb-6 italic" data-testid="text-testimonial">
              "{current.text}"
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <img 
                src={current.image}
                alt={`${current.name} - Cliente satisfeito`}
                className="w-16 h-16 rounded-full object-cover"
                data-testid="img-testimonial-avatar"
              />
              <div>
                <h4 className="font-bold text-firme-gray" data-testid="text-testimonial-name">{current.name}</h4>
                <p className="text-gray-500" data-testid="text-testimonial-role">{current.role}</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-firme-blue' : 'bg-gray-300'
                  }`}
                  data-testid={`button-testimonial-dot-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-firme-gray mb-4">
            Seu sonho está a um <strong className="text-firme-blue">clique.</strong>
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nossa metodologia exclusiva já ajudou <strong>mais de 800 investidores a construírem</strong> 
            patrimônios sólidos e consistentes. Junte-se ao grupo de pessoas que já alcançaram a liberdade financeira!
          </p>
        </div>
      </div>
    </section>
  );
}
