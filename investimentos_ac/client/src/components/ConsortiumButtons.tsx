import { Button } from "./ui/button";
import { ConsortiumCategory } from "@shared/consortiumTypes";

interface ConsortiumButtonsProps {
  onCategorySelect: (category: ConsortiumCategory) => void;
}

export default function ConsortiumButtons({ onCategorySelect }: ConsortiumButtonsProps) {
  const categories: { category: ConsortiumCategory; label: string; description: string }[] = [
    {
      category: "automovel",
      label: "Automóvel",
      description: "Realize o sonho do seu carro próprio"
    },
    {
      category: "imovel",
      label: "Imóvel",
      description: "Conquiste sua casa própria"
    },
    {
      category: "moto",
      label: "Moto",
      description: "Sua moto nova está aqui"
    },
    {
      category: "servicos",
      label: "Serviços",
      description: "Diversos serviços disponíveis"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Escolha seu Consórcio
          </h2>
          <p className="text-lg text-gray-600">
            Selecione a categoria que mais se adequa ao seu objetivo
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(({ category, label, description }) => (
            <div
              key={category}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {label}
              </h3>
              <p className="text-gray-600 mb-4">
                {description}
              </p>
              <Button
                onClick={() => onCategorySelect(category)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Simular
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}