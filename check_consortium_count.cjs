const Database = require('better-sqlite3');

try {
  const db = new Database('./database.sqlite');
  
  // Contar total de simulações
  const result = db.prepare('SELECT COUNT(*) as count FROM consortium_simulations').get();
  console.log('Total de simulações de consórcio no banco:', result.count);
  
  // Listar todas as simulações
  const all = db.prepare('SELECT id, name, email, whatsapp_sent, created_at FROM consortium_simulations ORDER BY created_at DESC').all();
  console.log('\nSimulações encontradas:');
  all.forEach((sim, i) => {
    console.log(`${i+1}. ID: ${sim.id}, Nome: ${sim.name}, WhatsApp: ${sim.whatsapp_sent}, Data: ${sim.created_at}`);
  });
  
  db.close();
} catch (error) {
  console.error('Erro ao acessar o banco de dados:', error.message);
}