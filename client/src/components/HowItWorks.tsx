export default function HowItWorks() {
  return (
    <section id="comofunciona" className="py-16 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-40"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-firme-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            Metodologia comprovada em <span className="text-transparent bg-gradient-to-r from-firme-blue to-blue-600 bg-clip-text">4 passos simples</span>.
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="relative">
              <div className="bg-gradient-to-br from-firme-blue to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-300/50 group-hover:rotate-6">
                1
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-firme-blue to-blue-600 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-blue-100 group-hover:-translate-y-2 border border-transparent group-hover:border-blue-100">
              <h3 className="font-bold text-firme-gray mb-2 group-hover:text-firme-blue transition-colors duration-300">Análise do seu perfil com melhores opções</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Nossa equipe analisa seus objetivos e perfil de risco para criar a melhor estratégia;</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative">
              <div className="bg-gradient-to-br from-firme-blue to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-300/50 group-hover:rotate-6 delay-100">
                2
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-firme-blue to-blue-600 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-blue-100 group-hover:-translate-y-2 border border-transparent group-hover:border-blue-100">
              <h3 className="font-bold text-firme-gray mb-2 group-hover:text-firme-blue transition-colors duration-300">Sem adesão</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Desenvolvemos uma carteira de investimentos sob medida para seus objetivos;</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative">
              <div className="bg-gradient-to-br from-firme-blue to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-300/50 group-hover:rotate-6 delay-200">
                3
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-firme-blue to-blue-600 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-blue-100 group-hover:-translate-y-2 border border-transparent group-hover:border-blue-100">
              <h3 className="font-bold text-firme-gray mb-2 group-hover:text-firme-blue transition-colors duration-300">Parcelas que cabem no seu bolso</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">Implementamos sua carteira de acordo com sua necessidade;</p>
            </div>
          </div>
          
          <div className="text-center group">
            <div className="relative">
              <div className="bg-gradient-to-br from-firme-blue to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-300/50 group-hover:rotate-6 delay-300">
                4
              </div>
              <div className="absolute inset-0 w-16 h-16 mx-auto bg-gradient-to-br from-firme-blue to-blue-600 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 group-hover:bg-white group-hover:shadow-lg group-hover:shadow-blue-100 group-hover:-translate-y-2 border border-transparent group-hover:border-blue-100">
              <h3 className="font-bold text-firme-gray mb-2 group-hover:text-firme-blue transition-colors duration-300">Credibilidade</h3>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">+ 70% da carteira de clientes contemplados. Monitoramos e ajustamos sua carteira continuamente para maximizar resultados;</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
