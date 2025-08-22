export default function HowItWorks() {
  return (
    <section id="comofunciona" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-cavalcante-gray mb-4">
            É simples e muito seguro para você.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-cavalcante-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <h3 className="font-bold text-cavalcante-gray mb-2">Você fala com o nosso time</h3>
            <p className="text-gray-600">de especialistas sobre os seus objetivos financeiros;</p>
          </div>
          
          <div className="text-center">
            <div className="bg-cavalcante-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <h3 className="font-bold text-cavalcante-gray mb-2">Nós te mostramos todas</h3>
            <p className="text-gray-600">as opções disponíveis de investimentos e planejamento financeiro;</p>
          </div>
          
          <div className="text-center">
            <div className="bg-cavalcante-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <h3 className="font-bold text-cavalcante-gray mb-2">Você escolhe</h3>
            <p className="text-gray-600">e após a análise de perfil, seus investimentos começam a render;</p>
          </div>
          
          <div className="text-center">
            <div className="bg-cavalcante-orange text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              4
            </div>
            <h3 className="font-bold text-cavalcante-gray mb-2">Nosso time proporciona total suporte</h3>
            <p className="text-gray-600">e cuida de você em todas as etapas do seu crescimento financeiro.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
