import { Briefcase, Users, TrendingUp, Heart } from "lucide-react";

export default function TrabalheConosco() {
  const handleCandidateClick = () => {
    // Redireciona para o formulário de candidatura já existente
    const jobApplicationSection = document.getElementById('candidatura');
    if (jobApplicationSection) {
      jobApplicationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="trabalheconosco" className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-firme-gray mb-6 leading-tight">
              FAÇA PARTE DE UMA EQUIPE 
              <span className="block text-firme-blue">VENCEDORA EM JUAZEIRO/BA</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Junte-se ao time da <strong className="text-firme-blue">ANDREOLI CONSÓRCIOS</strong> e ajude pessoas a conquistarem seus objetivos. 
              Oportunidades de crescimento e desenvolvimento profissional te esperam!
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-firme-blue" />
              </div>
              <h3 className="text-lg font-semibold text-firme-gray mb-2">Carreira Sólida</h3>
              <p className="text-gray-600 text-sm">Construa uma carreira estável no setor financeiro</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-firme-gray mb-2">Crescimento</h3>
              <p className="text-gray-600 text-sm">Oportunidades reais de desenvolvimento profissional</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-firme-gray mb-2">Equipe Unida</h3>
              <p className="text-gray-600 text-sm">Trabalhe com profissionais experientes e dedicados</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-blue-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-firme-gray mb-2">Propósito</h3>
              <p className="text-gray-600 text-sm">Ajude pessoas a realizarem seus sonhos</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-firme-blue to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para fazer a diferença?
            </h3>
            <p className="text-blue-100 mb-6 text-lg">
              Envie seu currículo e faça parte da nossa história de sucesso!
            </p>
            <button 
              onClick={handleCandidateClick}
              className="bg-white text-firme-blue px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              data-testid="button-candidate-now"
            >
              Candidate-se agora
            </button>
          </div>

          {/* Location Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              📍 <strong>Juazeiro - BA</strong> | Av. Raul Alves - Santo Antonio
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}