// Teste da nova função de cálculo automático
// Exemplo: R$ 50.000, parcela máxima R$ 900

// Simulando a função calcularConsorcioAutomatico
function calcularConsorcioAutomatico(tipo, valorCarta, parcelaMaxima, lanceEmbutidoPercentual = 0) {
  // Categorias de consórcio
  const CONSORTIUM_CATEGORIES = {
    carro: { 
      fr: 0.005,    // 0,5%
      adm: 0.16,    // 16%
      sv: 0.0012,   // 0,12% ao mês
      sq: 0.0007,   // 0,07% ao mês
      max: 150000 
    }
  };

  const categoria = CONSORTIUM_CATEGORIES[tipo];
  
  // Ajustar valor da carta se usar lance embutido
  let valorCartaAjustado = valorCarta;
  let lanceEmbutido = 0;
  
  if (lanceEmbutidoPercentual > 0) {
    // Para lance embutido, calcular o valor bruto da carta
    valorCartaAjustado = valorCarta / (1 - (lanceEmbutidoPercentual / 100));
    lanceEmbutido = valorCartaAjustado * (lanceEmbutidoPercentual / 100);
  }

  // 1. Calcular total com encargos
  const fundoReserva = valorCartaAjustado * categoria.fr;
  const taxaAdministracao = valorCartaAjustado * categoria.adm;
  const totalComEncargos = valorCartaAjustado + fundoReserva + taxaAdministracao;

  // 2. Calcular seguros mensais
  const seguroVidaMensal = valorCartaAjustado * categoria.sv;
  const seguroQuebraMensal = valorCartaAjustado * categoria.sq;
  const segurosTotal = seguroVidaMensal + seguroQuebraMensal;

  // 3. Calcular valor base mensal (sem seguros)
  const valorBaseMensal = parcelaMaxima - segurosTotal;

  // 4. Calcular número de parcelas (arredondado para cima)
  const parcelasCalculadas = Math.ceil(totalComEncargos / valorBaseMensal);

  // 5. Recalcular a parcela exata
  const parcelaReal = (totalComEncargos / parcelasCalculadas) + segurosTotal;

  return {
    valorCarta,
    valorCartaAjustado,
    parcelaMaxima,
    parcelasCalculadas,
    parcelaReal,
    totalComEncargos,
    fundoReserva,
    taxaAdministracao,
    seguroVida: seguroVidaMensal * parcelasCalculadas,
    seguroQuebra: seguroQuebraMensal * parcelasCalculadas,
    lanceEmbutido: lanceEmbutidoPercentual > 0 ? lanceEmbutido : undefined,
    detalhes: {
      tipo,
      valorBaseMensal,
      segurosTotal,
      seguroVidaMensal,
      seguroQuebraMensal
    }
  };
}

function formatMoney(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

console.log('=== TESTE CÁLCULO AUTOMÁTICO ===');
console.log('Exemplo: Carro R$ 50.000, parcela máxima R$ 900');
console.log('');

// Teste sem lance embutido
console.log('--- SEM LANCE EMBUTIDO ---');
const resultado1 = calcularConsorcioAutomatico('carro', 50000, 900, 0);
console.log('Valor da carta:', formatMoney(resultado1.valorCarta));
console.log('Parcela máxima informada:', formatMoney(resultado1.parcelaMaxima));
console.log('Número de parcelas calculado:', resultado1.parcelasCalculadas);
console.log('Parcela real:', formatMoney(resultado1.parcelaReal));
console.log('Total com encargos:', formatMoney(resultado1.totalComEncargos));
console.log('Fundo de reserva:', formatMoney(resultado1.fundoReserva));
console.log('Taxa de administração:', formatMoney(resultado1.taxaAdministracao));
console.log('Seguro de vida (total):', formatMoney(resultado1.seguroVida));
console.log('Seguro quebra (total):', formatMoney(resultado1.seguroQuebra));
console.log('Valor base mensal:', formatMoney(resultado1.detalhes.valorBaseMensal));
console.log('Seguros mensais:', formatMoney(resultado1.detalhes.segurosTotal));
console.log('');

// Teste com lance embutido de 15%
console.log('--- COM LANCE EMBUTIDO 15% ---');
const resultado2 = calcularConsorcioAutomatico('carro', 50000, 900, 15);
console.log('Valor da carta desejada:', formatMoney(resultado2.valorCarta));
console.log('Valor da carta ajustada:', formatMoney(resultado2.valorCartaAjustado));
console.log('Lance embutido:', formatMoney(resultado2.lanceEmbutido));
console.log('Parcela máxima informada:', formatMoney(resultado2.parcelaMaxima));
console.log('Número de parcelas calculado:', resultado2.parcelasCalculadas);
console.log('Parcela real:', formatMoney(resultado2.parcelaReal));
console.log('Total com encargos:', formatMoney(resultado2.totalComEncargos));
console.log('Fundo de reserva:', formatMoney(resultado2.fundoReserva));
console.log('Taxa de administração:', formatMoney(resultado2.taxaAdministracao));
console.log('Seguro de vida (total):', formatMoney(resultado2.seguroVida));
console.log('Seguro quebra (total):', formatMoney(resultado2.seguroQuebra));
console.log('Valor base mensal:', formatMoney(resultado2.detalhes.valorBaseMensal));
console.log('Seguros mensais:', formatMoney(resultado2.detalhes.segurosTotal));

console.log('');
console.log('=== COMPARAÇÃO COM EXEMPLO MANUAL ===');
console.log('Exemplo manual do usuário (com seguros fixos):');
console.log('1️⃣ Total com encargos: 50000 + (50000×0.16) + (50000×0.005) = 58250');
console.log('2️⃣ Valor base mensal: 900 - (30 + 20) = 850');
console.log('3️⃣ Parcelas: 58250 / 850 = 68,53 → 69 parcelas');
console.log('4️⃣ Parcela real: (58250 / 69) + 50 = 894,20');
console.log('');
console.log('Nosso cálculo (com seguros percentuais):');
console.log('Total com encargos:', formatMoney(resultado1.totalComEncargos));
console.log('Valor base mensal:', formatMoney(resultado1.detalhes.valorBaseMensal));
console.log('Parcelas:', resultado1.parcelasCalculadas);
console.log('Parcela real:', formatMoney(resultado1.parcelaReal));
console.log('');
console.log('Diferença: Seguros calculados como % do valor da carta:');
console.log('- Seguro vida mensal: R$ 50.000 × 0,12% = R$', (50000 * 0.0012).toFixed(2));
console.log('- Seguro quebra mensal: R$ 50.000 × 0,07% = R$', (50000 * 0.0007).toFixed(2));
console.log('- Total seguros mensais: R$', ((50000 * 0.0012) + (50000 * 0.0007)).toFixed(2));
console.log('- No exemplo manual: R$ 30 + R$ 20 = R$ 50');