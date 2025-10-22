import React from 'react';
import { Car, Home, Bike, Truck, Calculator, Shield, Clock, Users } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Car,
      title: "Consórcio Automotivo",
      description: "Realize o sonho do carro novo ou usado com as melhores condições do mercado",
      features: ["Carros nacionais e importados", "Sem juros", "Sem consulta ao SPC/Serasa", "Parcelas fixas"],
      color: "blue"
    },
    {
      icon: Home,
      title: "Consórcio Imobiliário",
      description: "Conquiste sua casa própria, apartamento ou terreno de forma planejada",
      features: ["Imóveis residenciais", "Imóveis comerciais", "Terrenos", "Construção e reforma"],
      color: "green"
    },
    {
      icon: Bike,
      title: "Consórcio de Motocicletas",
      description: "Sua moto nova com facilidade e sem complicações",
      features: ["Motos de todas as cilindradas", "Scooters", "Triciclos", "Sem entrada"],
      color: "purple"
    },
    {
      icon: Truck,
      title: "Consórcio Pesados",
      description: "Caminhões, máquinas e equipamentos para seu negócio crescer",
      features: ["Caminhões", "Máquinas agrícolas", "Equipamentos industriais", "Ônibus e micro-ônibus"],
      color: "orange"
    }
  ];

  const benefits = [
    {
      icon: Calculator,
      title: "Sem Juros",
      description: "Pague apenas o valor do bem + taxa de administração"
    },
    {
      icon: Shield,
      title: "Segurança",
      description: "Regulamentado pelo Banco Central do Brasil"
    },
    {
      icon: Clock,
      title: "Flexibilidade",
      description: "Escolha o prazo que cabe no seu bolso"
    },
    {
      icon: Users,
      title: "Atendimento",
      description: "Suporte personalizado durante todo o processo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50",
        icon: "text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      green: {
        bg: "bg-green-50",
        icon: "text-green-600",
        button: "bg-green-600 hover:bg-green-700"
      },
      purple: {
        bg: "bg-purple-50",
        icon: "text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700"
      },
      orange: {
        bg: "bg-orange-50",
        icon: "text-orange-600",
        button: "bg-orange-600 hover:bg-orange-700"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const scrollToContact = () => {
    document.getElementById('contatos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="servicos" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Oferecemos soluções completas em consórcios para diferentes necessidades. 
            Escolha a modalidade ideal para realizar seu sonho.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const colorClasses = getColorClasses(service.color);
            
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
                <div className={`w-16 h-16 ${colorClasses.bg} rounded-2xl flex items-center justify-center mb-6`}>
                  <IconComponent className={`h-8 w-8 ${colorClasses.icon}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 ${colorClasses.icon.replace('text-', 'bg-')} rounded-full mr-2`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={scrollToContact}
                  className={`w-full ${colorClasses.button} text-white px-4 py-2 rounded-lg font-medium transition-colors`}
                >
                  Saiba Mais
                </button>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Por que escolher consórcio?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How it Works */}
        <div className="mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Como Funciona o Consórcio
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Escolha seu Plano
              </h4>
              <p className="text-gray-600">
                Selecione o valor do bem e o prazo que melhor se adequa ao seu orçamento
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Pague as Parcelas
              </h4>
              <p className="text-gray-600">
                Quite suas parcelas mensais fixas sem juros, apenas taxa de administração
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Seja Contemplado
              </h4>
              <p className="text-gray-600">
                Receba sua carta de crédito por sorteio ou lance e realize seu sonho
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Pronto para Começar?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Entre em contato conosco e descubra qual consórcio é ideal para você
            </p>
            <button
              onClick={scrollToContact}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;