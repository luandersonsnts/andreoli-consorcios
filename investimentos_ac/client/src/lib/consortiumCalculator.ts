import { CONSORTIUM_GROUPS } from '@shared/consortiumTypes';

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
  calculation: ConsortiumCalculation
): string {
  return `*SIMULAÇÃO DE CONSÓRCIO - ANDREOLI CONSÓRCIOS*

👤 *Dados do Cliente:*
Nome: ${name}
Telefone: ${phone}
Email: ${email}

📋 *Detalhes da Simulação:*
Categoria: ${calculation.groupInfo.category}
Grupo: ${calculation.groupInfo.name}

💰 *Valores:*
Crédito Solicitado: R$ ${calculation.creditValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Taxa Administrativa (${calculation.groupInfo.adminRate}%): R$ ${calculation.adminFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Taxa do Fundo Comum (${calculation.groupInfo.fundRate}%): R$ ${calculation.fundFee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

📊 *Plano:*
Total a Pagar: R$ ${calculation.totalPayable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
Parcelas: ${calculation.totalMonths}x de R$ ${calculation.monthlyPayment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}

Gostaria de mais informações sobre esta simulação!`;
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
