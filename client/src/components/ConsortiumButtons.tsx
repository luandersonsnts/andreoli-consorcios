import { Car, Home, Smartphone, Bike, Wrench, Ship, Sun } from "lucide-react";
import { ConsortiumCategory } from "@shared/consortiumTypes";

interface ConsortiumButtonsProps {
  onCategorySelect?: (category: ConsortiumCategory) => void;
}

export default function ConsortiumButtons({ onCategorySelect }: ConsortiumButtonsProps) {
  const consortiumTypes = [
    {
      id: 'eletros' as ConsortiumCategory,
      name: 'Eletros',
      icon: Smartphone,
      description: 'Eletrônicos e eletrodomésticos',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'carro' as ConsortiumCategory,
      name: 'Carro',
      icon: Car,
      description: 'Veículos de passeio',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'imovel' as ConsortiumCategory,
      name: 'Imóveis',
      icon: Home,
      description: 'Casas e apartamentos',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'moto' as ConsortiumCategory,
      name: 'Moto',
      icon: Bike,
      description: 'Motocicletas',
      color: 'from-red-500 to-red-600',
      hoverColor: 'hover:from-red-600 hover:to-red-700'
    },
    {
      id: 'servicos' as ConsortiumCategory,
      name: 'Serviços',
      icon: Wrench,
      description: 'Prestação de serviços',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    },
    {
      id: 'barco' as ConsortiumCategory,
      name: 'Barco',
      icon: Ship,
      description: 'Embarcações',
      color: 'from-cyan-500 to-cyan-600',
      hoverColor: 'hover:from-cyan-600 hover:to-cyan-700'
    },
    {
      id: 'energia_solar' as ConsortiumCategory,
      name: 'Energia Solar',
      icon: Sun,
      description: 'Sistemas de energia renovável',
      color: 'from-yellow-500 to-yellow-600',
      hoverColor: 'hover:from-yellow-600 hover:to-yellow-700'
    }
  ];

  const handleButtonClick = (category: ConsortiumCategory) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    // Scroll para a seção de simulação
    document.getElementById('consorcio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white" data-consortium-buttons>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            Escolha seu <span className="text-transparent bg-gradient-to-r from-firme-blue to-blue-600 bg-clip-text">Consórcio</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Selecione o tipo de consórcio que melhor atende às suas necessidades e realize seu sonho
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 max-w-7xl mx-auto">
          {consortiumTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleButtonClick(type.id)}
                className={`group relative bg-gradient-to-br ${type.color} ${type.hoverColor} text-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center min-h-[140px] overflow-hidden`}
                data-testid={`consortium-button-${type.id}`}
              >
                {/* Efeito de brilho */}
                <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                
                {/* Ícone */}
                <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-8 h-8" />
                </div>
                
                {/* Nome */}
                <h3 className="font-bold text-sm text-center mb-1 relative z-10">
                  {type.name}
                </h3>
                
                {/* Descrição */}
                <p className="text-xs text-center opacity-90 relative z-10 leading-tight">
                  {type.description}
                </p>

                {/* Elemento decorativo */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Clique em qualquer opção para iniciar sua simulação personalizada
          </p>
        </div>
      </div>
    </section>
  );
}