const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');

console.log('=== Verificando categorias de simulações ===');

// Buscar todas as categorias únicas
const categories = db.prepare('SELECT DISTINCT category, COUNT(*) as count FROM consortium_simulations GROUP BY category ORDER BY count DESC').all();
console.log('Categorias encontradas:');
categories.forEach(cat => {
    console.log(`- ${cat.category}: ${cat.count} simulações`);
});

console.log('\n=== Simulações recentes por categoria ===');

// Buscar simulações de cada categoria (últimas 3 de cada)
categories.forEach(cat => {
    console.log(`\n--- Categoria: ${cat.category} ---`);
    const simulations = db.prepare('SELECT id, name, email, created_at FROM consortium_simulations WHERE category = ? ORDER BY id DESC LIMIT 3').all(cat.category);
    simulations.forEach(sim => {
        const date = new Date(sim.created_at * 1000).toLocaleString('pt-BR');
        console.log(`ID: ${sim.id} | Nome: ${sim.name} | Email: ${sim.email} | Data: ${date}`);
    });
});

// Verificar se há simulações com categoria 'carro' ou similar
console.log('\n=== Buscando simulações relacionadas a carros ===');
const carSimulations = db.prepare(`SELECT * FROM consortium_simulations WHERE category LIKE '%carro%' OR category LIKE '%auto%' OR category LIKE '%veiculo%' ORDER BY id DESC`).all();
console.log(`Encontradas ${carSimulations.length} simulações relacionadas a carros:`);
carSimulations.forEach(sim => {
    const date = new Date(sim.created_at * 1000).toLocaleString('pt-BR');
    console.log(`ID: ${sim.id} | Nome: ${sim.name} | Categoria: ${sim.category} | Data: ${date}`);
});

// Verificar as últimas 10 simulações
console.log('\n=== Últimas 10 simulações ===');
const latestSimulations = db.prepare('SELECT id, name, email, category, created_at FROM consortium_simulations ORDER BY id DESC LIMIT 10').all();
latestSimulations.forEach(sim => {
    const date = new Date(sim.created_at * 1000).toLocaleString('pt-BR');
    console.log(`ID: ${sim.id} | Nome: ${sim.name} | Categoria: ${sim.category} | Data: ${date}`);
});

db.close();