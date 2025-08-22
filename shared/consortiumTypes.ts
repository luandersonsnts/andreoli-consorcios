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

export type ConsortiumCategory = 'automovel' | 'imovel' | 'servicos' | 'pesados';

export const CONSORTIUM_GROUPS: ConsortiumGroup[] = [
  // AUTOMÓVEIS
  {
    id: '0031',
    name: 'Grupo 0031',
    category: 'automovel',
    adminTax: 19,
    fundReserve: 1,
    maxDuration: 80,
    participants: 9999,
    minBid: 10,
    maxBid: 30,
    insuranceRate: 0.088,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos e motos zero km ou seminovos. Veículos seminovos com até 08 anos de uso e motocicletas com até 03 anos de uso',
    contemplations: '1 por sorteio e quanto mais o saldo de caixa permitir'
  },
  {
    id: 'A0032',
    name: 'Grupo A0032',
    category: 'automovel',
    adminTax: 19,
    fundReserve: 1,
    maxDuration: 80,
    participants: 9999,
    minBid: 10,
    maxBid: 50,
    insuranceRate: 0.088,
    reajustType: 'IPCA',
    priceTableRules: 'Veículos e motos zero km ou seminovos. Veículos seminovos com até 08 anos de uso e motocicletas com até 03 anos de uso',
    contemplations: '1 por sorteio e quanto mais o saldo de caixa permitir'
  },
  // IMÓVEIS
  {
    id: 'G.A1008',
    name: 'Grupo G.A1008',
    category: 'imovel',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 180,
    participants: 9999,
    minBid: 10,
    maxBid: 50,
    insuranceRate: 0.088,
    reajustType: 'IPCA',
    priceTableRules: 'Para aquisição de imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e quanto mais o saldo de caixa permitir'
  },
  {
    id: 'G.S1007',
    name: 'Grupo G.S1007',
    category: 'imovel',
    adminTax: 16,
    fundReserve: 0.5,
    maxDuration: 180,
    participants: 9999,
    minBid: 10,
    maxBid: 50,
    insuranceRate: 0.088,
    reajustType: 'IPCA',
    priceTableRules: 'Para aquisição de imóveis residenciais e comerciais',
    contemplations: '1 por sorteio e quanto mais o saldo de caixa permitir'
  },
  // SERVIÇOS
  {
    id: 'G.3003',
    name: 'Grupo G.3003',
    category: 'servicos',
    adminTax: 23,
    fundReserve: 1,
    maxDuration: 60,
    participants: 3000,
    minBid: 10,
    maxBid: 30,
    insuranceRate: 0.088,
    reajustType: 'IPCA',
    priceTableRules: 'Consórcio ideal para pessoas que desejam realizar algum tipo de serviço, como reformas em casa, viagens, cursos, cirurgias bariátricas, estéticas, placas de energia solar, entre outros',
    contemplations: '1 por sorteio e quanto mais o saldo de caixa permitir'
  },
  // PESADOS
  {
    id: 'G.S2002',
    name: 'Grupo G.S2002',
    category: 'pesados',
    adminTax: 23,
    fundReserve: 1,
    maxDuration: 150,
    participants: 3000,
    minBid: 10,
    maxBid: 50,
    insuranceRate: 0.088,
    reajustType: 'IPCA',
    priceTableRules: 'Correspondente à pesados 0km ou até 10 anos de uso',
    contemplations: '1 por sorteio e quanto mais o saldo de caixa permitir'
  },
  {
    id: 'G.U2011',
    name: 'Grupo G.U2011',
    category: 'pesados',
    adminTax: 23,
    fundReserve: 1,
    maxDuration: 150,
    participants: 9999,
    minBid: 10,
    maxBid: 50,
    insuranceRate: 0.088,
    reajustType: 'IPCA',
    priceTableRules: 'Correspondente à pesados 0km ou até 10 anos de uso',
    contemplations: '1 por sorteio e quanto mais o saldo de caixa permitir'
  }
];

export function getGroupsByCategory(category: ConsortiumCategory): ConsortiumGroup[] {
  return CONSORTIUM_GROUPS.filter(group => group.category === category);
}

export function getGroupById(id: string): ConsortiumGroup | undefined {
  return CONSORTIUM_GROUPS.find(group => group.id === id);
}

export const CATEGORY_LABELS: Record<ConsortiumCategory, string> = {
  automovel: 'Automóveis e Motos',
  imovel: 'Imóveis',
  servicos: 'Serviços',
  pesados: 'Veículos Pesados'
};