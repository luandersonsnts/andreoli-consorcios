import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    text: "Com a ANDREOLI CONSÓRCIOS, consegui meu carro novo em apenas 6 meses. O atendimento foi excelente e as condições, as melhores do mercado!",
    name: "Carlos Eduardo",
    role: "Empresário",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    text: "Realizei o sonho da casa própria através do consórcio imobiliário. O processo foi transparente e o suporte da equipe, excepcional!",
    name: "Maria Santos",
    role: "Professora",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    text: "A ANDREOLI CONSÓRCIOS me ajudou a conquistar minha moto dos sonhos. O processo foi transparente e sem complicações.",
    name: "João Oliveira",
    role: "Médico",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    text: "Consegui meu apartamento através do consórcio em apenas 8 meses! A equipe me orientou em cada etapa do processo.",
    name: "Ana Paula",
    role: "Advogada",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    text: "Excelente experiência! Consegui meu carro zero através do consórcio e ainda economizei muito comparado ao financiamento.",
    name: "Roberto Silva",
    role: "Engenheiro",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    text: "A ANDREOLI CONSÓRCIOS tornou possível a compra da minha primeira casa. Atendimento personalizado e condições incríveis!",
    name: "Fernanda Costa",
    role: "Arquiteta",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80"
  }
];

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentTestimonial];

  return (
    <section id="clientes" className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-firme-blue/10 rounded-full border border-firme-blue/20 mb-6">
            <Quote className="w-5 h-5 text-firme-blue mr-2" />
            <span className="text-sm font-medium text-firme-blue">Depoimentos Reais</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-firme-gray mb-6">
            Histórias de <span className="text-firme-blue">Sucesso</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como nossos clientes realizaram seus sonhos através dos consórcios
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div 
            className="relative bg-white rounded-2xl shadow-2xl p-12 text-center overflow-hidden"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-firme-blue to-blue-400"></div>
            
            <button 
              onClick={prevTestimonial}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white hover:bg-firme-blue text-firme-blue hover:text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white hover:bg-firme-blue text-firme-blue hover:text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 z-10"
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            <div className="mb-8">
              <Quote className="text-firme-blue text-4xl mx-auto opacity-20" />
            </div>
            
            <div className="transition-all duration-500 ease-in-out">
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 italic leading-relaxed max-w-4xl mx-auto" data-testid="text-testimonial">
                "{current.text}"
              </p>
              
              <div className="flex items-center justify-center space-x-6">
                <div className="relative">
                  <img
                    src={current.image as string}
                    alt={`${current.name} - Cliente satisfeito`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-firme-blue/20 shadow-lg"
                    data-testid="img-testimonial-avatar"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-firme-gray" data-testid="text-testimonial-name">{current.name}</h4>
                  <p className="text-gray-500 font-medium" data-testid="text-testimonial-role">{current.role}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-3 mt-10">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'w-8 h-3 bg-firme-blue rounded-full' 
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                  }`}
                  data-testid={`button-testimonial-dot-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-firme-gray mb-4">
              Seu sonho está a um <span className="text-firme-blue">clique</span> de distância
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              Junte-se a mais de <strong className="text-firme-blue">1.000 clientes satisfeitos</strong> que já realizaram seus sonhos com a ANDREOLI CONSÓRCIOS
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-firme-blue">1000+</div>
                <div className="text-sm text-gray-600">Clientes Satisfeitos</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-firme-blue">98%</div>
                <div className="text-sm text-gray-600">Taxa de Aprovação</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-firme-blue">15+</div>
                <div className="text-sm text-gray-600">Anos de Experiência</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
