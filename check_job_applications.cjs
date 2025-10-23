const Database = require('better-sqlite3');

const db = new Database('./database.sqlite');

console.log('=== VERIFICANDO TABELA JOB_APPLICATIONS ===\n');

// Verificar estrutura da tabela
try {
  const tableInfo = db.prepare("PRAGMA table_info(job_applications)").all();
  console.log('📋 Estrutura da tabela job_applications:');
  tableInfo.forEach(column => {
    console.log(`  - ${column.name}: ${column.type}`);
  });
  
  console.log('\n📊 Dados da tabela:');
  const jobApplications = db.prepare('SELECT * FROM job_applications LIMIT 5').all();
  jobApplications.forEach((app, index) => {
    console.log(`\n${index + 1}. ID: ${app.id}`);
    console.log(`   Nome: ${app.name}`);
    console.log(`   Email: ${app.email}`);
    console.log(`   Telefone: ${app.phone}`);
    if (app.position) console.log(`   Posição: ${app.position}`);
    if (app.experience) console.log(`   Experiência: ${app.experience}`);
    if (app.resume_filename) console.log(`   Currículo: ${app.resume_filename}`);
    const date = new Date(app.created_at).toLocaleString('pt-BR');
    console.log(`   Data: ${date}`);
  });
  
} catch (error) {
  console.log('❌ Erro:', error.message);
}

db.close();