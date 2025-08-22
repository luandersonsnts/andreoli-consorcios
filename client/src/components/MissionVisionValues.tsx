import { Target, Eye, Heart } from "lucide-react";

export default function MissionVisionValues() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center bg-cavalcante-light-gray p-8 rounded-xl">
            <div className="bg-cavalcante-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-cavalcante-gray mb-4">MISSÃO</h3>
            <p className="text-gray-600">Democratizar o acesso a investimentos de qualidade e proporcionar crescimento patrimonial sustentável para nossos clientes.</p>
          </div>
          
          <div className="text-center bg-cavalcante-light-gray p-8 rounded-xl">
            <div className="bg-cavalcante-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-cavalcante-gray mb-4">VISÃO</h3>
            <p className="text-gray-600">Ser reconhecida como a principal empresa de assessoria em investimentos do Nordeste, transformando a vida financeira das pessoas.</p>
          </div>
          
          <div className="text-center bg-cavalcante-light-gray p-8 rounded-xl">
            <div className="bg-cavalcante-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-cavalcante-gray mb-4">VALORES</h3>
            <p className="text-gray-600">Transparência, ética, compromisso com resultados e excelência no atendimento ao cliente são nossos pilares fundamentais.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
