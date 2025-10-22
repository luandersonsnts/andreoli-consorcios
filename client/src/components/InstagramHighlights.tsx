import { useState } from "react";
import { Instagram, Heart, MessageCircle, Share, ChevronLeft, ChevronRight } from "lucide-react";

// Postagens REAIS do perfil @andreoli_consorcio - ATUALIZADAS com imagens reais fornecidas
const instagramPosts = [
  {
    id: 1,
    image: "/post1-marcos.jpg", // 1ª postagem - Marcos
    caption: "Começamos... Contemplado na 2° parcela. Tentamos na primeira e por pouco não saiu, agora deu certo! Venha fazer sua simulação. E veja que seu sonho está próximo de ser realizado",
    likes: 4,
    comments: 0,
    date: "3 dias atrás",
    clientName: "Marcos",
    achievement: "Contemplado na 2° parcela"
  },
  {
    id: 2,
    image: "/post2-ernani.jpg", // 2ª postagem - Ernani Souza
    caption: "Essa foi guerra, mas ele persistiu e agora seu certo. Pra cima meu irmão. @ernani_souza02 Vamos pegar a máquina agora",
    likes: 17,
    comments: 1,
    date: "3 dias atrás",
    clientName: "Ernani Souza",
    achievement: "Contemplado na 4° parcela"
  },
  {
    id: 3,
    image: "/post3-danilo.jpg", // 3ª postagem - Danilo Souza
    caption: "Com apenas duas parcelas, o sonho dele se tornou realidade! ✨ Agora é só pegar o carro e viver o que sempre desejou. Andreoli Consórcio — porque quando a conquista vem do coração, acontece mais rápido do que a gente imagina. Tem uns que são na primeira, outros podem demorar ...",
    likes: 27,
    comments: 1,
    date: "2 dias atrás",
    clientName: "Danilo Souza",
    achievement: "Contemplado na 2° parcela"
  },
  {
    id: 4,
    image: "/post4-larissa.jpg", // 4ª postagem - Larissa
    caption: "SE PROJETAS ALGUMA COISA, ELA TE SAÍRA BEM. Jó 22:28 CONSÓRCIO É PLANEJAMENTO! Larissa me procurou pra comprar um carro de uma forma planejada, eu vi o melhor grupo pra ela, mesmo sem lance inicial, vinha ofertando o lance fixo e participando de sorteios. Agora mês passado me proc...",
    likes: 71,
    comments: 0,
    date: "19 de agosto",
    clientName: "Larissa",
    achievement: "Planejamento realizado"
  }
];

export default function InstagramHighlights() {
  const [currentPost, setCurrentPost] = useState(0);

  const nextPost = () => {
    setCurrentPost((prev) => (prev + 1) % instagramPosts.length);
  };

  const prevPost = () => {
    setCurrentPost((prev) => (prev - 1 + instagramPosts.length) % instagramPosts.length);
  };

  const current = instagramPosts[currentPost];

  return (
    <section id="clientes" className="py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-15"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <Instagram className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Acompanhe nossos <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">destaques</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Veja as conquistas reais dos nossos clientes e inspire-se para realizar seu próprio sonho!
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {/* Post do Instagram simulado */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
            {/* Header do post */}
            <div className="flex items-center p-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">AC</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">andreoli_consorcios</h3>
                <p className="text-xs text-gray-500">{current.date}</p>
              </div>
              <Instagram className="w-5 h-5 text-gray-400" />
            </div>

            {/* Imagem do post */}
            <div className="relative group">
              <img
                src={current.image}
                alt={`Conquista de ${current.clientName}`}
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  console.error('Erro ao carregar imagem:', current.image);
                  // Fallback para placeholder se a imagem não carregar
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              {/* Placeholder de fallback */}
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                <div className="text-gray-500 text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm">Foto: {current.clientName}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Badge de conquista */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-firme-blue to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                ✨ {current.achievement}
              </div>
            </div>

            {/* Ações do post */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors">
                    <Heart className="w-6 h-6 fill-current" />
                    <span className="text-sm font-medium">{current.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-sm font-medium">{current.comments}</span>
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 transition-colors">
                    <Share className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Caption */}
              <div className="text-sm text-gray-800">
                <span className="font-semibold">andreoli_consorcios</span> {current.caption}
              </div>

              {/* Cliente destacado */}
              <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-firme-blue">Cliente:</span> {current.clientName}
                </p>
                <p className="text-xs text-gray-500 mt-1">Sonho realizado com a ANDREOLI CONSÓRCIOS</p>
              </div>
            </div>
          </div>

          {/* Controles de navegação */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevPost}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-gray-600 hover:text-firme-blue"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Indicadores */}
            <div className="flex space-x-2">
              {instagramPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPost(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentPost 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextPost}
              className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-gray-600 hover:text-firme-blue"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Quer ser o próximo destaque? <span className="font-semibold text-firme-blue">Conquiste seus objetivos também!</span>
          </p>
          <button
            onClick={() => window.open('https://www.instagram.com/andreoli_consorcio/', '_blank')}
            className="bg-gradient-to-r from-firme-blue to-blue-600 text-white px-8 py-4 rounded-full font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center space-x-2"
          >
            <Instagram className="w-5 h-5" />
            <span>Quero ser destaque também!</span>
          </button>
        </div>
      </div>
    </section>
  );
}