// Vou usar require para evitar problemas de módulo
const fs = require('fs');

// Simular os dados diretamente para teste
const CONSORTIUM_GROUPS = [
  // ELETROS
  { id: 'ELE001', name: 'Grupo Eletros 1247', category: 'eletros', adminTax: 16, fundReserve: 0.5, maxDuration: 60 },
  { id: 'ELE002', name: 'Grupo Eletros 3891', category: 'eletros', adminTax: 16, fundReserve: 0.5, maxDuration: 80 },
  { id: 'ELE003', name: 'Grupo Eletros 4521', category: 'eletros', adminTax: 16, fundReserve: 0.5, maxDuration: 100 },
  { id: 'ELE004', name: 'Grupo Eletros 7834', category: 'eletros', adminTax: 16, fundReserve: 0.5, maxDuration: 120 },
  { id: 'ELE005', name: 'Grupo Eletros 9156', category: 'eletros', adminTax: 16, fundReserve: 0.5, maxDuration: 150 },
  { id: 'ELE006', name: 'Grupo Eletros 2467', category: 'eletros', adminTax: 16, fundReserve: 0.5, maxDuration: 180 },
  
  // CARROS
  { id: 'CAR001', name: 'Grupo Carro 1234', category: 'carro', adminTax: 18, fundReserve: 1.0, maxDuration: 80 },
  { id: 'CAR002', name: 'Grupo Carro 5678', category: 'carro', adminTax: 18, fundReserve: 1.0, maxDuration: 100 },
  { id: 'CAR003', name: 'Grupo Carro 9012', category: 'carro', adminTax: 18, fundReserve: 1.0, maxDuration: 120 },
  
  // MOTOS
  { id: 'MOT001', name: 'Grupo Moto 3456', category: 'moto', adminTax: 17, fundReserve: 0.8, maxDuration: 60 },
  { id: 'MOT002', name: 'Grupo Moto 7890', category: 'moto', adminTax: 17, fundReserve: 0.8, maxDuration: 80 },
  { id: 'MOT003', name: 'Grupo Moto 1357', category: 'moto', adminTax: 17, fundReserve: 0.8, maxDuration: 100 },
  
  // IMÓVEIS
  { id: 'IMO001', name: 'Grupo Imóvel 2468', category: 'imovel', adminTax: 20, fundReserve: 1.5, maxDuration: 180 },
  { id: 'IMO002', name: 'Grupo Imóvel 1357', category: 'imovel', adminTax: 20, fundReserve: 1.5, maxDuration: 200 },
  { id: 'IMO003', name: 'Grupo Imóvel 9753', category: 'imovel', adminTax: 20, fundReserve: 1.5, maxDuration: 240 },
  
  // SERVIÇOS
  { id: 'SER001', name: 'Grupo Serviços 4681', category: 'servicos', adminTax: 15, fundReserve: 0.3, maxDuration: 60 },
  { id: 'SER002', name: 'Grupo Serviços 2593', category: 'servicos', adminTax: 15, fundReserve: 0.3, maxDuration: 80 },
  { id: 'SER003', name: 'Grupo Serviços 7410', category: 'servicos', adminTax: 15, fundReserve: 0.3, maxDuration: 100 },
  
  // ENERGIA SOLAR
  { id: 'SOL001', name: 'Grupo Solar 8520', category: 'energia_solar', adminTax: 14, fundReserve: 0.4, maxDuration: 120 },
  { id: 'SOL002', name: 'Grupo Solar 9631', category: 'energia_solar', adminTax: 14, fundReserve: 0.4, maxDuration: 150 },
  { id: 'SOL003', name: 'Grupo Solar 7412', category: 'energia_solar', adminTax: 14, fundReserve: 0.4, maxDuration: 180 }
];

function getGroupsByCategory(category) {
  return CONSORTIUM_GROUPS.filter(group => group.category === category);
}

const CATEGORY_LABELS = {
  eletros: 'Eletros',
  carro: 'Carro',
  imovel: 'Imóveis',
  moto: 'Moto',
  servicos: 'Serviços',
  barco: 'Barco',
  energia_solar: 'Energia Solar'
};

console.log('🔍 TESTANDO FUNÇÃO getGroupsByCategory\n');

// Testar todas as categorias
const categories = ['eletros', 'carro', 'imovel', 'moto', 'servicos', 'barco', 'energia_solar'];

console.log('📊 TOTAL DE GRUPOS NO SISTEMA:', CONSORTIUM_GROUPS.length);
console.log('📋 GRUPOS POR ID:');
CONSORTIUM_GROUPS.forEach(group => {
  console.log(`  - ${group.id}: ${group.name} (${group.category})`);
});

console.log('\n' + '='.repeat(60));
console.log('🏷️ TESTANDO FILTROS POR CATEGORIA:\n');

categories.forEach(category => {
  const groups = getGroupsByCategory(category);
  const label = CATEGORY_LABELS[category] || category;
  
  console.log(`📂 ${label.toUpperCase()} (${category}):`);
  console.log(`   Total: ${groups.length} grupos`);
  
  if (groups.length > 0) {
    groups.forEach(group => {
      console.log(`   ✅ ${group.id}: ${group.name}`);
      console.log(`      Taxa Admin: ${group.adminTax}% | Fundo: ${group.fundReserve}% | Duração: ${group.maxDuration} meses`);
    });
  } else {
    console.log('   ❌ Nenhum grupo encontrado');
  }
  console.log('');
});

console.log('='.repeat(60));
console.log('🔍 VERIFICANDO GRUPOS ESPECÍFICOS MENCIONADOS:\n');

// Verificar grupos específicos que foram mencionados como problemáticos
const specificGroups = ['ELE002', 'ELE004'];
specificGroups.forEach(groupId => {
  const group = CONSORTIUM_GROUPS.find(g => g.id === groupId);
  if (group) {
    console.log(`✅ ${groupId} ENCONTRADO:`);
    console.log(`   Nome: ${group.name}`);
    console.log(`   Categoria: ${group.category}`);
    console.log(`   Taxa Admin: ${group.adminTax}%`);
    console.log(`   Fundo Reserva: ${group.fundReserve}%`);
  } else {
    console.log(`❌ ${groupId} NÃO ENCONTRADO`);
  }
  console.log('');
});

console.log('='.repeat(60));
console.log('🧪 TESTANDO FILTRO MANUAL:\n');

// Testar filtro manual para eletros
const eletrosManual = CONSORTIUM_GROUPS.filter(group => group.category === 'eletros');
console.log(`🔧 Filtro manual para 'eletros': ${eletrosManual.length} grupos`);
eletrosManual.forEach(group => {
  console.log(`   - ${group.id}: ${group.name}`);
});

console.log('\n🔧 Filtro usando getGroupsByCategory para eletros:');
const eletrosFunction = getGroupsByCategory('eletros');
console.log(`   Total: ${eletrosFunction.length} grupos`);
eletrosFunction.forEach(group => {
  console.log(`   - ${group.id}: ${group.name}`);
});

// Verificar se os resultados são iguais
const areEqual = eletrosManual.length === eletrosFunction.length && 
                eletrosManual.every(group => eletrosFunction.find(g => g.id === group.id));

console.log(`\n🎯 Resultados são iguais: ${areEqual ? '✅ SIM' : '❌ NÃO'}`);