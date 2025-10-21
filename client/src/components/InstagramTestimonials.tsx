import { useState, useEffect } from "react";
import { Instagram, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

const instagramTestimonials = [
  {
    id: 1,
    type: "reel",
    url: "https://www.instagram.com/andreoli_consorcio/reel/DNjBoX-RD3S/",
    caption: "🎉 Mais um cliente realizando o sonho da casa própria! Com a ANDREOLI CONSÓRCIOS, você também pode conquistar seu imóvel dos sonhos.",
    date: "2024-12-15",
    image: "/instagram-post-1.jpg",
    likes: "127",
    comments: "23"
  },
  {
    id: 2,
    type: "post",
    url: "https://www.instagram.com/andreoli_consorcio/p/DP9RvEVEfc9/",
    caption: "✨ Depoimento emocionante! Nossa cliente conseguiu seu carro novo através do consórcio. Vem você também realizar seus sonhos conosco!",
    date: "2024-12-14",
    image: "/instagram-post-2.jpg",
    likes: "89",
    comments: "15"
  },
  {
    id: 3,
    type: "post",
    url: "https://www.instagram.com/andreoli_consorcio/p/DP7G_RNkUse/",
    caption: "🏠 Casa própria conquistada! Mais uma família feliz com a ANDREOLI CONSÓRCIOS. Seu sonho também pode se tornar realidade!",
    date: "2024-12-13",
    image: "/instagram-post-3.jpg",
    likes: "156",
    comments: "31"
  },
  {
    id: 4,
    type: "post",
    url: "https://www.instagram.com/andreoli_consorcio/p/DP7GlC_keQs/",
    caption: "🚗 Mais um cliente satisfeito! Consórcio de automóvel aprovado e entregue. Na ANDREOLI CONSÓRCIOS seus sonhos se tornam realidade!",
    date: "2024-12-12",
    image: "/instagram-post-4.jpg",
    likes: "203",
    comments: "42"
  }
];

export default function InstagramTestimonials() {
  const [currentPost, setCurrentPost] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentPost((prev) => (prev + 1) % instagramTestimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextPost = () => {
    setCurrentPost((prev) => (prev + 1) % instagramTestimonials.length);
  };

  const prevPost = () => {
    setCurrentPost((prev) => (prev - 1 + instagramTestimonials.length) % instagramTestimonials.length);
  };

  const current = instagramTestimonials[currentPost];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full border border-pink-200 mb-4">
            <Instagram className="w-5 h-5 text-pink-600 mr-2" />
            <span className="text-sm font-medium text-pink-600">Depoimentos Reais</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-firme-gray mb-4">
            Veja o que nossos clientes estão falando
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe as histórias de sucesso direto do nosso Instagram
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div 
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden interactive-card"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Buttons */}
            <button 
              onClick={prevPost}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-pink-600 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button 
              onClick={nextPost}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-pink-600 rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="flex flex-col lg:flex-row">
              {/* Image Section */}
              <div className="lg:w-1/2 relative">
                <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Instagram className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                    <p className="text-gray-600">Imagem do post do Instagram</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {current.type === 'reel' ? '🎬 Reel' : '📷 Post'}
                    </p>
                  </div>
                </div>
                
                {/* Instagram-style overlay */}
                <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">@andreoli_consorcio</span>
                </div>
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">ANDREOLI CONSÓRCIOS</p>
                        <p className="text-sm text-gray-500">{current.date}</p>
                      </div>
                    </div>
                    <a 
                      href={current.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 transition-colors hover-scale"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {current.caption}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>❤️ {current.likes} curtidas</span>
                    <span>💬 {current.comments} comentários</span>
                  </div>
                </div>

                <a 
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <Instagram className="w-5 h-5 mr-2" />
                  Ver no Instagram
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {instagramTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPost(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPost 
                      ? 'bg-pink-500 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Siga-nos no Instagram para mais histórias de sucesso!
            </p>
            <a 
              href="https://www.instagram.com/andreoli_consorcio/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <Instagram className="w-5 h-5 mr-2" />
              @andreoli_consorcio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}