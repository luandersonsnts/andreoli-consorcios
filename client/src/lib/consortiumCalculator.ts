import { CONSORTIUM_GROUPS } from '@shared/consortiumTypes';

// ===== SISTEMA AVANÇADO DE CÁLCULO DE CONSÓRCIO =====
// Baseado na fórmula: Z = (VC + FR + ADM) / N + (VC × (SV + SQ))

export interface ConsortiumCategory {
  fr: number;    // Fundo de Reserva (%)
  adm: number;   // Taxa de Administração (%)
  sv: number;    // Seguro de Vida mensal (%)
  sq: number;    // Seguro Quebra mensal (%)
  max: number;   // Valor máximo da carta
}

export interface AdvancedConsortiumResult {
  valorCarta: number;
  valorCartaBruto?: number; // Valor bruto da carta quando há lance embutido
  parcelaMensal: number;
  fundoReserva: number;
  taxaAdministracao: number;
  seguroVida: number;
  seguroQuebra: number;
  valorTotalPlano: number;
  
  // Cálculos com lance
  lanceNecessario?: number;
  lanceEmbutido?: number;
  lanceAPagar?: number;
  parcelaAposContemplacao?: number;
  
  // Detalhes do cálculo
  detalhes: {
    tipo: string;
    parcelas: number;
    lancePercentual?: number;
    usouEmbutido?: boolean;
  };
}

// Nova interface para cálculo automático de parcelas
export interface AutoConsortiumCalculation {
  valorCarta: number;
  parcelaMaxima: number;
  parcelasCalculadas: number;
  parcelaReal: number;
  totalComEncargos: number;
  fundoReserva: number;
  taxaAdministracao: number;
  seguroVida: number;
  seguroQuebra: number;
  lanceEmbutido: number;
  lancePercentual: number;
  lanceTotal: number; // Novo campo para lance total (50% do valor da carta)
  valorAPagar: number; // Novo campo para valor a pagar (35% do valor da carta)
  parcelaReduzida: number; // Novo campo para parcela reduzida após contemplação
  detalhes: {
    tipo: string;
    valorBaseMensal: number;
    segurosTotal: number;
  };
}

// Categorias de consórcio com todos os parâmetros
export const CONSORTIUM_CATEGORIES: Record<string, ConsortiumCategory> = {
  eletros: { 
    fr: 0.015,    // 1,5%
    adm: 0.20,    // 20%
    sv: 0.0029,   // 0,29% ao mês
    sq: 0.0020,   // 0,20% ao mês
    max: 15000 
  },
  carro: { 
    fr: 0.005,    // 0,5%
    adm: 0.16,    // 16%
    sv: 0.0012,   // 0,12% ao mês
    sq: 0.0007,   // 0,07% ao mês
    max: 150000 
  },
  imoveis: { 
    fr: 0.015,    // 1,5%
    adm: 0.23,    // 23%
    sv: 0.0006,   // 0,06% ao mês
    sq: 0.0002,   // 0,02% ao mês
    max: 500000 
  },
  moto: { 
    fr: 0.005,    // 0,5%
    adm: 0.21,    // 21%
    sv: 0.0014,   // 0,14% ao mês
    sq: 0.0009,   // 0,09% ao mês
    max: 30000 
  },
  servicos: { 
    fr: 0.02,     // 2%
    adm: 0.20,    // 20%
    sv: 0.0021,   // 0,21% ao mês
    sq: 0.0016,   // 0,16% ao mês
    max: 25000 
  },
  barco: { 
    fr: 0.005,    // 0,5%
    adm: 0.21,    // 21%
    sv: 0.0014,   // 0,14% ao mês
    sq: 0.0009,   // 0,09% ao mês
    max: 30000 
  },
  energia: { 
    fr: 0.005,    // 0,5%
    adm: 0.16,    // 16%
    sv: 0.0012,   // 0,12% ao mês
    sq: 0.0007,   // 0,07% ao mês
    max: 150000 
  }
};

export interface InvestmentCalculation {
  monthlyAmount: number;
  timeframe: number;
  totalInvested: number;
  totalReturn: number;
  profit: number;
  annualRate: number;
  monthlyRate: number;
  yearlyBreakdown: Array<{
    year: number;
    totalInvested: number;
    totalReturn: number;
    profit: number;
  }>;
}

export interface ConsortiumCalculation {
  creditValue: number;
  monthlyPayment: number;
  totalPayable: number;
  adminFee: number;
  fundFee: number;
  totalMonths: number;
  groupInfo: {
    id: string;
    name: string;
    category: string;
    adminRate: number;
    fundRate: number;
  };
}

/**
 * Calcula o valor da carta necessário quando há lance embutido
 * Fórmula: X = Valor desejado / (1 - (Y / 100))
 */
function calcularValorCartaComEmbutido(valorDesejado: number, lancePercentual: number): number {
  return valorDesejado / (1 - (lancePercentual / 100));
}

/**
 * Calcula a parcela após contemplação com redução
 * Fórmula: Z_novo = Z × (1 - lance_pago / valor_total_plano)
 */
function calcularParcelaAposContemplacao(
  parcelaOriginal: number, 
  lanceAPagar: number, 
  valorTotalPlano: number
): number {
  const fatorReducao = 1 - (lanceAPagar / valorTotalPlano);
  return parcelaOriginal * fatorReducao;
}

/**
 * Função principal de cálculo avançado de consórcio
 */
export function calcularConsorcioAvancado(
  tipo: string,
  valorDesejado: number,
  parcelas: number,
  lancePercentual: number = 0,
  usarEmbutido: boolean = false
): AdvancedConsortiumResult {
  
  const categoria = CONSORTIUM_CATEGORIES[tipo.toLowerCase()];
  if (!categoria) {
    throw new Error(`Tipo de consórcio inválido: ${tipo}`);
  }

  // Validar lance embutido
  if (usarEmbutido && lancePercentual > 0) {
    if (lancePercentual < 15) {
      throw new Error('Lance embutido mínimo é de 15%');
    }
    if (lancePercentual > 99) {
      throw new Error('Lance embutido máximo é de 99%');
    }
  }

  // Determinar o valor da carta e cálculos de embutido
  let valorCarta: number;
  let valorCartaBruto: number;
  let lanceEmbutido = 0;
  
  if (usarEmbutido && lancePercentual > 0) {
    // Com lance embutido: calcular valor bruto da carta para referência
    valorCartaBruto = calcularValorCartaComEmbutido(valorDesejado, lancePercentual);
    lanceEmbutido = valorCartaBruto * (lancePercentual / 100);
    
    // Para cálculos de encargos e parcelas, usar o valor líquido (valorDesejado)
    valorCarta = valorDesejado;
    
    // Validar valor máximo usando o valor bruto
    if (valorCartaBruto > categoria.max) {
      throw new Error(`Valor máximo para ${tipo} é R$ ${categoria.max.toLocaleString('pt-BR')}`);
    }
  } else {
    // Sem embutido: usar valor desejado diretamente
    valorCarta = valorDesejado;
    valorCartaBruto = valorDesejado;
    
    // Validar valor máximo
    if (valorCarta > categoria.max) {
      throw new Error(`Valor máximo para ${tipo} é R$ ${categoria.max.toLocaleString('pt-BR')}`);
    }
  }

  // Calcular encargos sobre o valor líquido (valorCarta = valorDesejado)
  const fundoReserva = valorCarta * categoria.fr;
  const taxaAdministracao = valorCarta * categoria.adm;
  const seguroVida = valorCarta * categoria.sv;
  const seguroQuebra = valorCarta * categoria.sq;
  const segurosTotal = seguroVida + seguroQuebra;

  // Valor total do plano (para cálculo de redução)
  const valorTotalPlano = valorCarta + fundoReserva + taxaAdministracao;

  // Fórmula principal: Z = (VC + FR + ADM) / N + (VC × (SV + SQ))
  // Usar valorCarta (valor líquido) para o cálculo da parcela
  const parcelaMensal = (valorTotalPlano / parcelas) + segurosTotal;

  // Cálculos de lance
  let lanceNecessario: number | undefined;
  let lanceAPagar: number | undefined;
  let parcelaAposContemplacao: number | undefined;

  if (lancePercentual > 0) {
    if (usarEmbutido) {
      // Com lance embutido: lance necessário é calculado sobre o valor bruto
      lanceNecessario = valorCartaBruto * (lancePercentual / 100);
      // O lance a pagar em dinheiro é zero (lance embutido - lance embutido = 0)
      lanceAPagar = lanceNecessario - lanceEmbutido;
      // A redução é baseada no valor do lance embutido que efetivamente reduz o plano
      // Como o lance embutido cobre todo o lance necessário, a parcela permanece a mesma
      parcelaAposContemplacao = parcelaMensal;
    } else {
      // Sem embutido: lance necessário é calculado sobre o valor da carta
      lanceNecessario = valorCarta * (lancePercentual / 100);
      lanceAPagar = lanceNecessario;
      parcelaAposContemplacao = calcularParcelaAposContemplacao(
        parcelaMensal, 
        lanceAPagar, 
        valorTotalPlano
      );
    }
  }

  return {
    valorCarta,
    valorCartaBruto: usarEmbutido ? valorCartaBruto : undefined,
    parcelaMensal,
    fundoReserva,
    taxaAdministracao,
    seguroVida,
    seguroQuebra,
    valorTotalPlano,
    lanceNecessario,
    lanceEmbutido: usarEmbutido ? lanceEmbutido : undefined,
    lanceAPagar,
    parcelaAposContemplacao,
    detalhes: {
      tipo,
      parcelas,
      lancePercentual: lancePercentual > 0 ? lancePercentual : undefined,
      usouEmbutido: usarEmbutido
    }
  };
}

/**
 * Função auxiliar para obter lista de tipos de consórcio
 */
export function getTiposConsorcio(): Array<{value: string, label: string}> {
  return [
    { value: 'carro', label: 'Carro' },
    { value: 'moto', label: 'Motocicleta' },
    { value: 'imoveis', label: 'Imóveis' },
    { value: 'eletros', label: 'Eletrodomésticos' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'barco', label: 'Embarcações' },
    { value: 'energia', label: 'Energia Solar' }
  ];
}

/**
 * Função para validar entrada de dados
 */
export function validarEntradaConsorcio(
  tipo: string,
  valor: number,
  parcelas: number,
  lancePercentual: number = 0
): { valido: boolean; erro?: string } {
  
  const categoria = CONSORTIUM_CATEGORIES[tipo.toLowerCase()];
  if (!categoria) {
    return { valido: false, erro: 'Tipo de consórcio inválido' };
  }

  if (valor <= 0) {
    return { valido: false, erro: 'Valor deve ser maior que zero' };
  }

  if (valor > categoria.max) {
    return { 
      valido: false, 
      erro: `Valor máximo para ${tipo} é R$ ${categoria.max.toLocaleString('pt-BR')}` 
    };
  }

  if (parcelas < 12 || parcelas > 120) {
    return { valido: false, erro: 'Número de parcelas deve estar entre 12 e 120' };
  }

  if (lancePercentual < 0 || lancePercentual > 50) {
    return { valido: false, erro: 'Percentual de lance deve estar entre 0% e 50%' };
  }

  return { valido: true };
}

export function calculateInvestment(
  monthlyAmount: number,
  timeframeYears: number,
  annualRate: number = 12 // Taxa anual padrão de 12%
): InvestmentCalculation {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = timeframeYears * 12;
  
  // Cálculo de juros compostos para aportes mensais
  // FV = PMT * [((1 + r)^n - 1) / r]
  const futureValue = monthlyAmount * (((1 + monthlyRate) ** totalMonths - 1) / monthlyRate);
  
  const totalInvested = monthlyAmount * totalMonths;
  const profit = futureValue - totalInvested;
  
  // Breakdown anual
  const yearlyBreakdown = [];
  for (let year = 1; year <= timeframeYears; year++) {
    const monthsInYear = year * 12;
    const yearlyFutureValue = monthlyAmount * (((1 + monthlyRate) ** monthsInYear - 1) / monthlyRate);
    const yearlyInvested = monthlyAmount * monthsInYear;
    const yearlyProfit = yearlyFutureValue - yearlyInvested;
    
    yearlyBreakdown.push({
      year,
      totalInvested: yearlyInvested,
      totalReturn: yearlyFutureValue,
      profit: yearlyProfit
    });
  }
  
  return {
    monthlyAmount,
    timeframe: timeframeYears,
    totalInvested,
    totalReturn: futureValue,
    profit,
    annualRate,
    monthlyRate: monthlyRate * 100,
    yearlyBreakdown
  };
}

export function calculateConsortium(
  category: string,
  groupId: string,
  creditValue: number,
  installments: number
): ConsortiumCalculation {
  const group = CONSORTIUM_GROUPS.find(g => g.id === groupId);
  
  if (!group) {
    throw new Error('Grupo não encontrado');
  }

  const adminRate = group.adminTax / 100;
  const fundRate = group.fundReserve / 100;
  
  const adminFee = creditValue * adminRate;
  const fundFee = creditValue * fundRate;
  const totalPayable = creditValue + adminFee + fundFee;
  const monthlyPayment = totalPayable / installments;

  return {
    creditValue,
    monthlyPayment,
    totalPayable,
    adminFee,
    fundFee,
    totalMonths: installments,
    groupInfo: {
      id: group.id,
      name: group.name,
      category: group.category,
      adminRate: group.adminTax,
      fundRate: group.fundReserve
    }
  };
}

export function formatConsortiumForWhatsApp(
  name: string,
  phone: string,
  email: string,
  calculation: any
): string {
  const formatMoney = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return `*SIMULAÇÃO DE CONSÓRCIO - ANDREOLI CONSÓRCIOS*

👤 *Dados do Cliente:*
Nome: ${name}
Telefone: ${phone}
Email: ${email}

===== PROPOSTA ANDREOLI CONSÓRCIOS =====
${calculation.lanceEmbutido > 0 && calculation.valorCartaReal !== calculation.valorCarta ? `Carta selecionada para o embutido: ${formatMoney(calculation.valorCartaReal)}
1ª Parcela da carta selecionada: ${formatMoney(calculation.parcelaAtual)}
Crédito disponível para uso: ${formatMoney(calculation.valorCarta)}
Lance necessário 53%: ${formatMoney(calculation.lanceTotal)}
Lance embutido: ${formatMoney(calculation.lanceEmbutido)}
Lance a pagar: ${formatMoney(calculation.lanceDeduzido)}
Parcelas após contemplado: ${formatMoney(calculation.parcelasAposContemplado)}` : `Grupo: ${calculation.grupo}
Valor da carta: ${formatMoney(calculation.valorCarta)}
Valor da primeira parcela: ${formatMoney(calculation.parcelaAtual)}
Lance necessário 53%: ${formatMoney(calculation.lanceTotal)}
Parcelas após contemplado: ${formatMoney(calculation.parcelasAposContemplado)}`}

Gostaria de mais informações sobre esta simulação!`;
}

/**
 * Função auxiliar para formatar valores monetários
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

export function formatInvestmentForWhatsApp(
  name: string,
  phone: string,
  email: string,
  objective: string,
  monthlyAmount: string,
  timeframe: string
): string {
  return `*SIMULAÇÃO DE INVESTIMENTO - ANDREOLI CONSÓRCIOS*

👤 *Dados do Cliente:*
Nome: ${name}
Telefone: ${phone}
Email: ${email}

🎯 *Objetivo:*
${objective}

💰 *Plano:*
Aporte Mensal: R$ ${monthlyAmount}
Prazo: ${timeframe}

Gostaria de receber uma proposta personalizada de investimento!`;
}

/**
 * Nova função que calcula automaticamente o número de parcelas
 * baseado no valor da carta desejada e na parcela máxima que o cliente pode pagar
 * 
 * Fórmula implementada:
 * 1. Total = VC + (VC × TA) + (VC × FR)
 * 2. ValorBaseMensal = VP - (SV + SQ)
 * 3. Parcelas = ceil(Total / ValorBaseMensal)
 * 4. ParcelaFinal = (Total / Parcelas) + (SV + SQ)
 */
export function calcularConsorcioAutomatico(
  tipo: string,
  valorCarta: number,
  parcelaMaxima: number,
  lanceEmbutidoPercentual: number = 0
): AutoConsortiumCalculation {
  // Validar tipo de consórcio
  const categoria = CONSORTIUM_CATEGORIES[tipo];
  if (!categoria) {
    throw new Error(`Tipo de consórcio inválido: ${tipo}`);
  }

  // Validar valores
  if (valorCarta <= 0) {
    throw new Error('Valor da carta deve ser maior que zero');
  }
  if (parcelaMaxima <= 0) {
    throw new Error('Parcela máxima deve ser maior que zero');
  }
  if (valorCarta > categoria.max) {
    throw new Error(`Valor da carta excede o limite máximo de ${formatarMoeda(categoria.max)} para ${tipo}`);
  }

  // Validar lance embutido
  if (lanceEmbutidoPercentual > 0) {
    if (lanceEmbutidoPercentual !== 15) {
      throw new Error('Lance embutido deve ser exatamente 15%');
    }
  }

  // Ajustar valor da carta se usar lance embutido
  let valorCartaAjustado = valorCarta;
  let lanceEmbutido = 0;
  
  // CÁLCULOS CORRETOS CONFORME REGRAS ESPECIFICADAS:
  // Lance total sempre será 50% do valor da carta
  // Lance embutido sempre será 15% do valor da carta
  // Valor a pagar = Lance total - Lance embutido = 35% do valor da carta
  
  // 1. Calcular total com encargos (usando valor original da carta)
  const fundoReserva = valorCarta * categoria.fr;
  const taxaAdministracao = valorCarta * categoria.adm;
  const totalComEncargos = valorCarta + fundoReserva + taxaAdministracao;

  // 2. Calcular seguros mensais
  const seguroVidaMensal = valorCarta * categoria.sv;
  const seguroQuebraMensal = valorCarta * categoria.sq;
  const segurosTotal = seguroVidaMensal + seguroQuebraMensal;

  // 3. Calcular valor base mensal (sem seguros)
  const valorBaseMensal = parcelaMaxima - segurosTotal;
  
  if (valorBaseMensal <= 0) {
    throw new Error('Parcela máxima é insuficiente para cobrir os seguros obrigatórios');
  }

  // 4. Calcular número de parcelas (arredondado para cima)
  const parcelasCalculadas = Math.ceil(totalComEncargos / valorBaseMensal);

  // Validar limites de parcelas
  if (parcelasCalculadas < 12) {
    throw new Error('Número mínimo de parcelas é 12');
  }
  if (parcelasCalculadas > 120) {
    throw new Error('Número máximo de parcelas é 120');
  }

  // 5. Recalcular a parcela exata
  const parcelaReal = (totalComEncargos / parcelasCalculadas) + segurosTotal;

  // 6. Calcular lance conforme regras corretas
  const lanceTotal = valorCarta * 0.50; // Lance total sempre 50% do valor da carta
  const lanceEmbutidoValor = valorCarta * 0.15; // Lance embutido sempre 15% do valor da carta
  const valorAPagar = lanceTotal - lanceEmbutidoValor; // 35% do valor da carta

  // 7. Calcular redução de parcelas baseado no valor total pago do lance
  // A redução é proporcional ao valor total do lance pago em relação ao total com encargos
  const percentualReducao = lanceTotal / totalComEncargos;
  const parcelaReduzida = parcelaReal * (1 - percentualReducao);

  return {
    valorCarta,
    parcelaMaxima,
    parcelasCalculadas,
    parcelaReal,
    totalComEncargos,
    fundoReserva,
    taxaAdministracao,
    seguroVida: seguroVidaMensal * parcelasCalculadas, // Total do seguro
    seguroQuebra: seguroQuebraMensal * parcelasCalculadas, // Total do seguro
    lanceEmbutido: lanceEmbutidoValor, // Sempre calculado (15% do valor da carta)
    lancePercentual: 15, // Sempre 15%
    lanceTotal, // Novo campo para lance total (50% do valor da carta)
    valorAPagar, // Novo campo para valor a pagar (35% do valor da carta)
    parcelaReduzida, // Novo campo para parcela reduzida após contemplação
    detalhes: {
      tipo,
      valorBaseMensal,
      segurosTotal
    }
  };
}
