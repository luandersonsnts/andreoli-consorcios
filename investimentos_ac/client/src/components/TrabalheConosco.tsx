import { Button } from "./ui/button";

export default function TrabalheConosco() {
  const scrollToJobApplication = () => {
    const element = document.getElementById('job-application');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            Trabalhe Conosco
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Faça parte da nossa equipe e ajude pessoas a realizarem seus sonhos. 
            Na Andreoli Consórcios, valorizamos profissionais dedicados e comprometidos 
            com a excelência no atendimento.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Oportunidades</h3>
              <p className="text-blue-100">
                Diversas vagas em diferentes áreas
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-lg font-semibold mb-2">Crescimento</h3>
              <p className="text-blue-100">
                Plano de carreira estruturado
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold mb-2">Ambiente</h3>
              <p className="text-blue-100">
                Equipe colaborativa e acolhedora
              </p>
            </div>
          </div>
          
          <Button
            onClick={scrollToJobApplication}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Candidate-se Agora
          </Button>
        </div>
      </div>
    </section>
  );
}