import { Card } from "./ui/card";

export default function InstagramHighlights() {
  const posts = [
    {
      id: 1,
      title: "Marcos realizou o sonho do carro próprio",
      description: "Com o consórcio Andreoli, consegui meu carro novo sem comprometer meu orçamento.",
      author: "Marcos Silva",
      image: "/instagram-post-1.svg"
    },
    {
      id: 2,
      title: "Ernani conquistou sua casa própria",
      description: "O consórcio imobiliário foi a melhor escolha para realizar meu sonho.",
      author: "Ernani Santos",
      image: "/instagram-post-2.svg"
    },
    {
      id: 3,
      title: "Danilo e sua moto nova",
      description: "Rápido e fácil! Em poucos meses já estava com minha moto zero.",
      author: "Danilo Costa",
      image: "/instagram-post-3.svg"
    },
    {
      id: 4,
      title: "Larissa investiu em serviços",
      description: "O consórcio de serviços me ajudou a expandir meu negócio.",
      author: "Larissa Oliveira",
      image: "/instagram-post-4.svg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Histórias de Sucesso
          </h2>
          <p className="text-lg text-gray-600">
            Veja como nossos clientes realizaram seus sonhos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <img 
                  src={post.image}
                  alt={`Depoimento de ${post.author}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="text-gray-500 text-center hidden">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-sm">Foto: {post.author}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {post.description}
                </p>
                <p className="text-blue-600 font-medium text-sm">
                  - {post.author}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}