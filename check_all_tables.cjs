const Database = require('better-sqlite3');

const db = new Database('./database.sqlite');

console.log('=== VERIFICANDO TODAS AS TABELAS ===\n');

// Verificar simulações de consórcio
try {
  const consortiumCount = db.prepare('SELECT COUNT(*) as count FROM consortium_simulations').get();
  console.log(`✅ Simulações de Consórcio: ${consortiumCount.count} registros`);
} catch (error) {
  console.log('❌ Erro ao verificar simulações de consórcio:', error.message);
}

// Verificar reclamações
try {
  const complaintsCount = db.prepare('SELECT COUNT(*) as count FROM complaints').get();
  console.log(`✅ Reclamações: ${complaintsCount.count} registros`);
  
  if (complaintsCount.count > 0) {
    const recentComplaints = db.prepare('SELECT name, subject, created_at FROM complaints ORDER BY created_at DESC LIMIT 3').all();
    console.log('📋 Últimas reclamações:');
    recentComplaints.forEach(complaint => {
      const date = new Date(complaint.created_at).toLocaleString('pt-BR');
      console.log(`  - ${complaint.name} | ${complaint.subject} | ${date}`);
    });
  }
} catch (error) {
  console.log('❌ Erro ao verificar reclamações:', error.message);
}

// Verificar candidaturas
try {
  const jobApplicationsCount = db.prepare('SELECT COUNT(*) as count FROM job_applications').get();
  console.log(`✅ Candidaturas: ${jobApplicationsCount.count} registros`);
  
  if (jobApplicationsCount.count > 0) {
    const recentApplications = db.prepare('SELECT name, email, created_at FROM job_applications ORDER BY created_at DESC LIMIT 3').all();
    console.log('📋 Últimas candidaturas:');
    recentApplications.forEach(application => {
      const date = new Date(application.created_at).toLocaleString('pt-BR');
      console.log(`  - ${application.name} | ${application.email} | ${date}`);
    });
  }
} catch (error) {
  console.log('❌ Erro ao verificar candidaturas:', error.message);
}

// Verificar usuários
try {
  const usersCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  console.log(`✅ Usuários: ${usersCount.count} registros`);
  
  if (usersCount.count > 0) {
    const users = db.prepare('SELECT username, created_at FROM users').all();
    console.log('👥 Usuários cadastrados:');
    users.forEach(user => {
      const date = new Date(user.created_at).toLocaleString('pt-BR');
      console.log(`  - ${user.username} | ${date}`);
    });
  }
} catch (error) {
  console.log('❌ Erro ao verificar usuários:', error.message);
}

db.close();