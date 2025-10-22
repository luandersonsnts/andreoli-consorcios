import React from 'react';
import { Shield, Users, Award, TrendingUp, Heart, Target } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Confiança",
      description: "Transparência e honestidade em todas as nossas relações comerciais"
    },
    {
      icon: Users,
      title: "Relacionamento",
      description: "Construímos parcerias duradouras baseadas no respeito mútuo"
    },
    {
      icon: Award,
      title: "Excelência",
      description: "Buscamos sempre a melhor solução para cada cliente"
    },
    {
      icon: TrendingUp,
      title: "Crescimento",
      description: "Ajudamos nossos clientes a crescer e realizar seus objetivos"
    }
  ];

  const stats = [
    { number: "500+", label: "Clientes Atendidos" },
    { number: "5", label: "Anos de Experiência" },
    { number: "98%", label: "Satisfação dos Clientes" },
    { number: "24/7", label: "Suporte Disponível" }
  ];

  return (
    <section id="sobre" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sobre a Andreoli Consórcios
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Somos uma empresa especializada em consórcios, dedicada a ajudar pessoas e empresas 
            a realizarem seus sonhos através de soluções financeiras inteligentes e acessíveis.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Nossa História
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                Fundada com o propósito de democratizar o acesso a bens e serviços, 
                a Andreoli Consórcios nasceu da visão de que todos merecem ter a 
                oportunidade de realizar seus sonhos, independentemente de sua situação financeira atual.
              </p>
              <p>
                Com anos de experiência no mercado financeiro, nossa equipe desenvolveu 
                uma expertise única em consórcios, oferecendo as melhores condições e 
                um atendimento personalizado para cada cliente.
              </p>
              <p>
                Acreditamos que o consórcio é uma das formas mais inteligentes e 
                seguras de adquirir bens, permitindo que nossos clientes planejem 
                seu futuro com tranquilidade e segurança.
              </p>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Equipe Andreoli Consórcios"
              className="rounded-2xl shadow-xl w-full h-auto"
            />
            <div className="absolute inset-0 bg-blue-600 bg-opacity-10 rounded-2xl"></div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-blue-50 rounded-2xl">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Missão</h3>
            <p className="text-gray-600">
              Facilitar a realização de sonhos através de soluções em consórcios, 
              oferecendo atendimento personalizado e condições acessíveis.
            </p>
          </div>

          <div className="text-center p-6 bg-green-50 rounded-2xl">
            <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Visão</h3>
            <p className="text-gray-600">
              Ser reconhecida como a principal referência em consórcios, 
              transformando vidas através de oportunidades financeiras inteligentes.
            </p>
          </div>

          <div className="text-center p-6 bg-purple-50 rounded-2xl">
            <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Valores</h3>
            <p className="text-gray-600">
              Transparência, confiança, excelência no atendimento e 
              compromisso com o sucesso de nossos clientes.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Nossos Diferenciais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                  <IconComponent className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold text-center mb-8">
            Números que Comprovam Nossa Excelência
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Pronto para Realizar Seus Sonhos?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar você a 
            conquistar aquilo que sempre desejou através dos nossos consórcios.
          </p>
          <a
            href="#contatos"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Fale Conosco
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;