// Tipos e estruturas para os grupos de consórcio baseados nos PDFs

export interface ConsortiumGroup {
  id: string;
  name: string;
  category: ConsortiumCategory;
  adminTax: number; // Taxa administrativa em %
  fundReserve: number; // Fundo de reserva em %
  maxDuration: number; // Duração máxima em meses
  participants: number; // Número de participantes
  minBid: number; // Lance mínimo em %
  maxBid: number; // Lance máximo em %
  insuranceRate: number; // Taxa de seguro prestamista
  reajustType: 'IPCA' | 'IGP-M';
  priceTableRules: string;
  contemplations: string;
}

export type ConsortiumCategory = 'eletros' | 'carro' | 'imovel' | 'moto' | 'servicos' | 'barco' | 'energia_solar';

export const CONSORTIUM_GROUPS: ConsortiumGroup[] = [
  // ELETROS
  {
    id: 'ELE001',
    name: 'Grupo Eletros 1247',
    category: 'eletros',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 60,
    participants: 200,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Eletrodomésticos, eletrônicos e eletroeletrônicos em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'ELE002',
    name: 'Grupo Eletros 3891',
    category: 'eletros',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 80,
    participants: 300,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Eletrodomésticos, eletrônicos e eletroeletrônicos em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'ELE003',
    name: 'Grupo Eletros 5623',
    category: 'eletros',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 70,
    participants: 250,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Eletrodomésticos, eletrônicos e eletroeletrônicos em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'ELE004',
    name: 'Grupo Eletros 7459',
    category: 'eletros',
    adminTax: 17,
    fundReserve: 0.5,
    maxDuration: 90,
    participants: 350,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Eletrodomésticos, eletrônicos e eletroeletrônicos em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'ELE005',
    name: 'Grupo Eletros 9182',
    category: 'eletros',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 50,
    participants: 180,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Eletrodomésticos, eletrônicos e eletroeletrônicos em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'ELE006',
    name: 'Grupo Eletros 2736',
    category: 'eletros',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 100,
    participants: 400,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Eletrodomésticos, eletrônicos e eletroeletrônicos em geral',
    contemplations: '1 por sorteio e lances'
  },
  // CARROS
  {
    id: 'CAR001',
    name: 'Grupo Carros 4821',
    category: 'carro',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 80,
    participants: 250,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos zero km ou seminovos com até 8 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'CAR002',
    name: 'Grupo Carros 6394',
    category: 'carro',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 100,
    participants: 400,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos zero km ou seminovos com até 8 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'CAR003',
    name: 'Grupo Carros 1567',
    category: 'carro',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 90,
    participants: 300,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos zero km ou seminovos com até 8 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'CAR004',
    name: 'Grupo Carros 8923',
    category: 'carro',
    adminTax: 17,
    fundReserve: 0.5,
    maxDuration: 120,
    participants: 500,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos zero km ou seminovos com até 8 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'CAR005',
    name: 'Grupo Carros 3745',
    category: 'carro',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 70,
    participants: 200,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos zero km ou seminovos com até 8 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'CAR006',
    name: 'Grupo Carros 5182',
    category: 'carro',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 110,
    participants: 450,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos zero km ou seminovos com até 8 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  // IMÓVEIS
  {
    id: 'IMO001',
    name: 'Grupo Imóveis 7291',
    category: 'imovel',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 180,
    participants: 500,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'IMO002',
    name: 'Grupo Imóveis 4856',
    category: 'imovel',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 200,
    participants: 600,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'IMO003',
    name: 'Grupo Imóveis 1634',
    category: 'imovel',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 160,
    participants: 400,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'IMO004',
    name: 'Grupo Imóveis 9273',
    category: 'imovel',
    adminTax: 17,
    fundReserve: 0.5,
    maxDuration: 220,
    participants: 700,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'IMO005',
    name: 'Grupo Imóveis 5847',
    category: 'imovel',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 150,
    participants: 350,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'IMO006',
    name: 'Grupo Imóveis 3192',
    category: 'imovel',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 240,
    participants: 800,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e lances'
  },
  // MOTOS
  {
    id: 'MOT001',
    name: 'Grupo Motos 6418',
    category: 'moto',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 60,
    participants: 150,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Motocicletas zero km ou seminovas com até 3 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'MOT002',
    name: 'Grupo Motos 2759',
    category: 'moto',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 80,
    participants: 200,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Motocicletas zero km ou seminovas com até 3 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'MOT003',
    name: 'Grupo Motos 8341',
    category: 'moto',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 50,
    participants: 120,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Motocicletas zero km ou seminovas com até 3 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'MOT004',
    name: 'Grupo Motos 4926',
    category: 'moto',
    adminTax: 17,
    fundReserve: 0.5,
    maxDuration: 90,
    participants: 250,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Motocicletas zero km ou seminovas com até 3 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'MOT005',
    name: 'Grupo Motos 1583',
    category: 'moto',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 70,
    participants: 180,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Motocicletas zero km ou seminovas com até 3 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'MOT006',
    name: 'Grupo Motos 7264',
    category: 'moto',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 100,
    participants: 300,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Motocicletas zero km ou seminovas com até 3 anos de uso',
    contemplations: '1 por sorteio e lances'
  },
  // SERVIÇOS
  {
    id: 'SER001',
    name: 'Grupo Serviços 3947',
    category: 'servicos',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 60,
    participants: 180,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Reformas, viagens, cursos, cirurgias e serviços em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SER002',
    name: 'Grupo Serviços 8125',
    category: 'servicos',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 80,
    participants: 250,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Reformas, viagens, cursos, cirurgias e serviços em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SER003',
    name: 'Grupo Serviços 5672',
    category: 'servicos',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 50,
    participants: 150,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Reformas, viagens, cursos, cirurgias e serviços em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SER004',
    name: 'Grupo Serviços 2394',
    category: 'servicos',
    adminTax: 17,
    fundReserve: 0.5,
    maxDuration: 100,
    participants: 300,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Reformas, viagens, cursos, cirurgias e serviços em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SER005',
    name: 'Grupo Serviços 7851',
    category: 'servicos',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 70,
    participants: 200,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Reformas, viagens, cursos, cirurgias e serviços em geral',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SER006',
    name: 'Grupo Serviços 4163',
    category: 'servicos',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 90,
    participants: 280,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Reformas, viagens, cursos, cirurgias e serviços em geral',
    contemplations: '1 por sorteio e lances'
  },
  // BARCOS
  {
    id: 'BAR001',
    name: 'Grupo Barcos 9517',
    category: 'barco',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 120,
    participants: 100,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Embarcações de recreio e pesca',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'BAR002',
    name: 'Grupo Barcos 6283',
    category: 'barco',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 150,
    participants: 120,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Embarcações de recreio e pesca',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'BAR003',
    name: 'Grupo Barcos 3749',
    category: 'barco',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 100,
    participants: 80,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Embarcações de recreio e pesca',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'BAR004',
    name: 'Grupo Barcos 8126',
    category: 'barco',
    adminTax: 17,
    fundReserve: 0.5,
    maxDuration: 180,
    participants: 150,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Embarcações de recreio e pesca',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'BAR005',
    name: 'Grupo Barcos 2594',
    category: 'barco',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 140,
    participants: 110,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Embarcações de recreio e pesca',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'BAR006',
    name: 'Grupo Barcos 7381',
    category: 'barco',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 160,
    participants: 130,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Embarcações de recreio e pesca',
    contemplations: '1 por sorteio e lances'
  },
  // ENERGIA SOLAR
  {
    id: 'SOL001',
    name: 'Grupo Energia Solar 4672',
    category: 'energia_solar',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 100,
    participants: 200,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Sistemas de energia solar fotovoltaica',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SOL002',
    name: 'Grupo Energia Solar 8935',
    category: 'energia_solar',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 120,
    participants: 250,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Sistemas de energia solar fotovoltaica',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SOL003',
    name: 'Grupo Energia Solar 1547',
    category: 'energia_solar',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 80,
    participants: 150,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Sistemas de energia solar fotovoltaica',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SOL004',
    name: 'Grupo Energia Solar 6283',
    category: 'energia_solar',
    adminTax: 17,
    fundReserve: 0.5,
    maxDuration: 140,
    participants: 300,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Sistemas de energia solar fotovoltaica',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SOL005',
    name: 'Grupo Energia Solar 3719',
    category: 'energia_solar',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 90,
    participants: 180,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Sistemas de energia solar fotovoltaica',
    contemplations: '1 por sorteio e lances'
  },
  {
    id: 'SOL006',
    name: 'Grupo Energia Solar 5864',
    category: 'energia_solar',
    adminTax: 15,
    fundReserve: 0.5,
    maxDuration: 160,
    participants: 350,
    minBid: 15,
    maxBid: 99,
    insuranceRate: 0.12,
    reajustType: 'IPCA',
    priceTableRules: 'Sistemas de energia solar fotovoltaica',
    contemplations: '1 por sorteio e lances'
  }
];

export function getGroupsByCategory(category: ConsortiumCategory): ConsortiumGroup[] {
  return CONSORTIUM_GROUPS.filter(group => group.category === category);
}

export function getGroupById(id: string): ConsortiumGroup | undefined {
  return CONSORTIUM_GROUPS.find(group => group.id === id);
}

export const CATEGORY_LABELS: Record<ConsortiumCategory, string> = {
  eletros: 'Eletros',
  carro: 'Carro',
  imovel: 'Imóveis',
  moto: 'Moto',
  servicos: 'Serviços',
  barco: 'Barco',
  energia_solar: 'Energia Solar'
};

// Helpers de exibição para categorias vindas de diferentes fontes
export function resolveCategoryKey(raw: string): ConsortiumCategory | undefined {
  const key = (raw || '').toLowerCase();
  const aliases: Record<string, ConsortiumCategory> = {
    automovel: 'carro',
    automóvel: 'carro',
    carros: 'carro',
    carro: 'carro',
    imoveis: 'imovel',
    imóveis: 'imovel',
    imovel: 'imovel',
    moto: 'moto',
    motocicleta: 'moto',
    servicos: 'servicos',
    serviços: 'servicos',
    eletros: 'eletros',
    barco: 'barco',
    energia: 'energia_solar',
    energia_solar: 'energia_solar'
  };
  return aliases[key];
}

export function getCategoryLabelFromRaw(raw: string): string {
  const resolved = resolveCategoryKey(raw);
  if (resolved && CATEGORY_LABELS[resolved]) {
    return CATEGORY_LABELS[resolved];
  }
  // Fallback: capitaliza primeira letra
  return (raw || '').charAt(0).toUpperCase() + (raw || '').slice(1);
}