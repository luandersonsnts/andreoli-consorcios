export default function HowItWorks() {
  return (
    <section id="comofunciona" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            Metodologia comprovada em 4 passos simples.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-firme-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="font-bold text-firme-gray mb-2">Análise do seu perfil</h3>
            <p className="text-gray-600">Nossa equipe analisa seus objetivos e perfil de risco para criar a melhor estratégia;</p>
          </div>
          
          <div className="text-center">
            <div className="bg-firme-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="font-bold text-firme-gray mb-2">Portfólio personalizado</h3>
            <p className="text-gray-600">Desenvolvemos uma carteira de investimentos sob medida para seus objetivos;</p>
          </div>
          
          <div className="text-center">
            <div className="bg-firme-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="font-bold text-firme-gray mb-2">Execução da estratégia</h3>
            <p className="text-gray-600">Implementamos sua carteira com os melhores produtos do mercado;</p>
          </div>
          
          <div className="text-center">
            <div className="bg-firme-blue text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              4
            </div>
            <h3 className="font-bold text-firme-gray mb-2">Acompanhamento contínuo</h3>
            <p className="text-gray-600">Monitoramos e ajustamos sua carteira continuamente para maximizar resultados.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
