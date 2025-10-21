// Usando fetch nativo do Node.js 18+

const API_BASE = 'http://localhost:5000';

// Dados de teste para simulação
const testData = {
  name: "Teste Automatizado",
  email: "teste@exemplo.com",
  phone: "11999999999",
  creditValue: 50000,
  maxInstallmentValue: 800,
  installmentCount: 60,
  useEmbedded: false
};

// Grupos para testar
const testGroups = [
  // Eletros
  { category: 'eletros', groupId: 'ELE001' },
  { category: 'eletros', groupId: 'ELE002' },
  { category: 'eletros', groupId: 'ELE003' },
  { category: 'eletros', groupId: 'ELE004' },
  { category: 'eletros', groupId: 'ELE005' },
  { category: 'eletros', groupId: 'ELE006' },
  
  // Carros
  { category: 'carro', groupId: 'CAR001' },
  { category: 'carro', groupId: 'CAR002' },
  { category: 'carro', groupId: 'CAR003' },
  
  // Motos
  { category: 'moto', groupId: 'MOT001' },
  { category: 'moto', groupId: 'MOT002' },
  { category: 'moto', groupId: 'MOT003' },
  
  // Imóveis
  { category: 'imovel', groupId: 'IMO001' },
  { category: 'imovel', groupId: 'IMO002' },
  { category: 'imovel', groupId: 'IMO003' },
  
  // Serviços
  { category: 'servicos', groupId: 'SER001' },
  { category: 'servicos', groupId: 'SER002' },
  { category: 'servicos', groupId: 'SER003' },
  
  // Energia Solar
  { category: 'energia_solar', groupId: 'SOL001' },
  { category: 'energia_solar', groupId: 'SOL002' },
  { category: 'energia_solar', groupId: 'SOL003' },
];

async function testConsortiumGroup(group) {
  try {
    const simulationData = {
      ...testData,
      category: group.category,
      groupId: group.groupId
    };

    console.log(`\n🧪 Testando ${group.category} - ${group.groupId}...`);
    
    const response = await fetch(`${API_BASE}/api/consortium-simulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${group.category} - ${group.groupId}: SUCESSO (ID: ${result.id})`);
      return { group, success: true, id: result.id };
    } else {
      console.log(`❌ ${group.category} - ${group.groupId}: ERRO - ${result.message}`);
      return { group, success: false, error: result.message };
    }
  } catch (error) {
    console.log(`💥 ${group.category} - ${group.groupId}: EXCEÇÃO - ${error.message}`);
    return { group, success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 INICIANDO TESTES DE GRUPOS DE CONSÓRCIO\n');
  console.log(`📡 API Base: ${API_BASE}`);
  console.log(`📊 Total de grupos para testar: ${testGroups.length}\n`);
  
  const results = [];
  
  for (const group of testGroups) {
    const result = await testConsortiumGroup(group);
    results.push(result);
    
    // Pequena pausa entre requisições
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('\n📋 RESUMO DOS TESTES:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Sucessos: ${successful.length}/${results.length}`);
  console.log(`❌ Falhas: ${failed.length}/${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ GRUPOS QUE FUNCIONARAM:');
    successful.forEach(r => {
      console.log(`  - ${r.group.category} - ${r.group.groupId} (ID: ${r.id})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ GRUPOS QUE FALHARAM:');
    failed.forEach(r => {
      console.log(`  - ${r.group.category} - ${r.group.groupId}: ${r.error}`);
    });
  }
  
  // Agrupar por categoria
  console.log('\n📊 RESULTADOS POR CATEGORIA:');
  const categories = [...new Set(results.map(r => r.group.category))];
  
  categories.forEach(category => {
    const categoryResults = results.filter(r => r.group.category === category);
    const categorySuccessful = categoryResults.filter(r => r.success);
    console.log(`  ${category}: ${categorySuccessful.length}/${categoryResults.length} sucessos`);
  });
}

// Executar os testes
runTests().catch(console.error);