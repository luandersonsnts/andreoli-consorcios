const Database = require('better-sqlite3');

console.log('=== TESTE DE CODIFICAÇÃO UTF-8 ===\n');

const db = new Database('./database.sqlite');

// Configurar UTF-8 (mesmo que no storage.ts)
db.pragma('encoding = "UTF-8"');

// Teste 1: Inserir dados com caracteres especiais
console.log('📝 Teste 1: Inserindo dados com caracteres especiais...');

const testData = {
  name: 'João da Silva',
  email: 'joao@teste.com',
  phone: '11999999999',
  category: 'automóvel',
  group_id: 'CAR001',
  credit_value: 50000,
  use_embedded: false,
  max_installment_value: 800,
  installment_count: 60,
  whatsapp_sent: false,
  whatsapp_sent_at: null
};

try {
  const insertStmt = db.prepare(`
    INSERT INTO consortium_simulations 
    (name, email, phone, category, group_id, credit_value, use_embedded, max_installment_value, installment_count, whatsapp_sent, whatsapp_sent_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = insertStmt.run(
    testData.name,
    testData.email,
    testData.phone,
    testData.category,
    testData.group_id,
    testData.credit_value,
    testData.use_embedded ? 1 : 0,
    testData.max_installment_value,
    testData.installment_count,
    testData.whatsapp_sent ? 1 : 0,
    testData.whatsapp_sent_at
  );
  
  console.log(`✅ Dados inseridos com ID: ${result.lastInsertRowid}`);
  
  // Teste 2: Recuperar os dados inseridos
  console.log('\n📖 Teste 2: Recuperando dados inseridos...');
  
  const selectStmt = db.prepare('SELECT * FROM consortium_simulations WHERE id = ?');
  const retrievedData = selectStmt.get(result.lastInsertRowid);
  
  console.log('Dados recuperados:');
  console.log(`  Nome: "${retrievedData.name}"`);
  console.log(`  Email: "${retrievedData.email}"`);
  console.log(`  Categoria: "${retrievedData.category}"`);
  
  // Teste 3: Verificar encoding dos caracteres
  console.log('\n🔍 Teste 3: Análise de caracteres...');
  
  const nameBytes = Buffer.from(retrievedData.name, 'utf8');
  console.log(`  Nome em bytes: [${Array.from(nameBytes).join(', ')}]`);
  console.log(`  Nome length: ${retrievedData.name.length} caracteres`);
  console.log(`  Nome bytes length: ${nameBytes.length} bytes`);
  
  // Verificar se contém o caractere 'ã'
  if (retrievedData.name.includes('ã')) {
    console.log('✅ Caractere "ã" preservado corretamente');
  } else {
    console.log('❌ Caractere "ã" não foi preservado');
    console.log(`  Caracteres encontrados: ${retrievedData.name.split('').map(c => `"${c}"`).join(', ')}`);
  }
  
  // Teste 4: Verificar últimas simulações
  console.log('\n📊 Teste 4: Últimas 3 simulações na base...');
  
  const lastSimulations = db.prepare('SELECT id, name, email FROM consortium_simulations ORDER BY id DESC LIMIT 3').all();
  lastSimulations.forEach((sim, index) => {
    console.log(`  ${index + 1}. ID: ${sim.id} | Nome: "${sim.name}" | Email: "${sim.email}"`);
  });
  
} catch (error) {
  console.log('❌ Erro:', error.message);
}

db.close();
console.log('\n✅ Teste concluído!');