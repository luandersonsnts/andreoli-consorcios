import Database from 'better-sqlite3';

try {
  const db = new Database('./database.sqlite');
  
  console.log('=== VERIFICANDO SIMULAÇÕES DE CONSÓRCIO ===\n');
  
  // Verificar se a tabela existe
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='consortium_simulations'").all();
  
  if (tables.length === 0) {
    console.log('❌ Tabela consortium_simulations não encontrada!');
    
    // Listar todas as tabelas
    const allTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('\n📋 Tabelas disponíveis:');
    allTables.forEach(table => console.log(`  - ${table.name}`));
  } else {
    console.log('✅ Tabela consortium_simulations encontrada');
    
    // Verificar estrutura da tabela
    const schema = db.prepare("PRAGMA table_info(consortium_simulations)").all();
    console.log('\n📋 Estrutura da tabela:');
    schema.forEach(col => console.log(`  - ${col.name}: ${col.type}`));
    
    // Contar total de simulações
    const count = db.prepare("SELECT COUNT(*) as total FROM consortium_simulations").get();
    console.log(`\n📊 Total de simulações: ${count.total}`);
    
    if (count.total > 0) {
      // Verificar simulações por categoria
      const byCategory = db.prepare(`
        SELECT category, COUNT(*) as count 
        FROM consortium_simulations 
        GROUP BY category 
        ORDER BY count DESC
      `).all();
      
      console.log('\n📈 Simulações por categoria:');
      byCategory.forEach(row => console.log(`  - ${row.category}: ${row.count}`));
      
      // Verificar simulações por grupo
      const byGroup = db.prepare(`
        SELECT group_id, COUNT(*) as count 
        FROM consortium_simulations 
        GROUP BY group_id 
        ORDER BY count DESC
      `).all();
      
      console.log('\n🏷️ Simulações por grupo:');
      byGroup.forEach(row => console.log(`  - ${row.group_id}: ${row.count}`));
      
      // Mostrar últimas 5 simulações
      const recent = db.prepare(`
        SELECT name, category, group_id, credit_value, created_at 
        FROM consortium_simulations 
        ORDER BY created_at DESC 
        LIMIT 5
      `).all();
      
      console.log('\n🕒 Últimas 5 simulações:');
      recent.forEach(sim => {
        const date = new Date(sim.created_at).toLocaleString('pt-BR');
        console.log(`  - ${sim.name} | ${sim.category} | ${sim.group_id} | R$ ${sim.credit_value} | ${date}`);
      });
    }
  }
  
  db.close();
} catch (error) {
  console.error('❌ Erro ao verificar banco de dados:', error.message);
}