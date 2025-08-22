import { Target, Eye, Heart } from "lucide-react";

export default function MissionVisionValues() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center bg-firme-light-gray p-8 rounded-xl">
            <div className="bg-firme-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-firme-gray mb-4">MISSÃO</h3>
            <p className="text-gray-600">Transformar vidas através da educação financeira e estratégias de investimento personalizadas, construindo patrimônios sólidos e duradouros.</p>
          </div>
          
          <div className="text-center bg-firme-light-gray p-8 rounded-xl">
            <div className="bg-firme-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-firme-gray mb-4">VISÃO</h3>
            <p className="text-gray-600">Ser referência nacional em assessoria de investimentos, sendo a primeira escolha de quem busca excelência e resultados consistentes.</p>
          </div>
          
          <div className="text-center bg-firme-light-gray p-8 rounded-xl">
            <div className="bg-firme-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-firme-gray mb-4">VALORES</h3>
            <p className="text-gray-600">Integridade, inovação, foco no cliente e busca contínua por resultados superiores guiam todas as nossas decisões e ações.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
