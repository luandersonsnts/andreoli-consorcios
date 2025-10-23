// Script para executar no console do navegador
// Copie e cole este código no console do navegador (F12)

console.log("=== VERIFICAÇÃO DO PAINEL ADMINISTRATIVO ===");

// 1. Verificar localStorage
console.log("\n1. Verificando localStorage:");
const adminToken = localStorage.getItem('admin_token');
const adminUser = localStorage.getItem('admin_user');
console.log("admin_token:", adminToken ? 'EXISTE' : 'NÃO EXISTE');
console.log("admin_user:", adminUser ? 'EXISTE' : 'NÃO EXISTE');

if (adminToken) {
    console.log("Token:", adminToken.substring(0, 50) + "...");
}
if (adminUser) {
    console.log("User:", adminUser);
}

// 2. Função para fazer login
async function doLogin() {
    console.log("\n2. Fazendo login...");
    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            console.log("✅ Login bem-sucedido!");
            console.log("Token salvo:", data.token.substring(0, 50) + "...");
            return data.token;
        } else {
            console.error("❌ Erro no login:", response.status, await response.text());
            return null;
        }
    } catch (error) {
        console.error("❌ Erro na requisição:", error);
        return null;
    }
}

// 3. Função para testar API
async function testAPI(token) {
    console.log("\n3. Testando API de simulações...");
    try {
        const response = await fetch('/api/consortium-simulations', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("✅ API funcionando!");
            console.log("Simulações encontradas:", data.length);
            console.log("Dados:", data);
            return data;
        } else {
            console.error("❌ Erro na API:", response.status, await response.text());
            return null;
        }
    } catch (error) {
        console.error("❌ Erro na requisição:", error);
        return null;
    }
}

// 4. Executar teste completo
async function testeCompleto() {
    console.log("\n=== TESTE COMPLETO ===");
    
    // Limpar localStorage primeiro
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    console.log("localStorage limpo");
    
    // Fazer login
    const token = await doLogin();
    if (!token) {
        console.error("❌ Falha no login, parando teste");
        return;
    }
    
    // Testar API
    const data = await testAPI(token);
    if (data) {
        console.log("✅ Teste completo bem-sucedido!");
        console.log("Agora recarregue a página /admin para ver se os dados aparecem");
    } else {
        console.error("❌ Falha no teste da API");
    }
}

// Executar automaticamente
console.log("\nExecutando teste completo...");
testeCompleto();

// Disponibilizar funções globalmente para uso manual
window.doLogin = doLogin;
window.testAPI = testAPI;
window.testeCompleto = testeCompleto;

console.log("\nFunções disponíveis:");
console.log("- doLogin(): Fazer login");
console.log("- testAPI(token): Testar API com token");
console.log("- testeCompleto(): Executar teste completo");