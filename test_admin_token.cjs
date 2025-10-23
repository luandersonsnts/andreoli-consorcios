const { default: fetch } = require('node-fetch');

async function testAdminToken() {
  try {
    console.log('🔐 Testando autenticação do admin...');
    
    // 1. Fazer login para obter token
    console.log('\n1. Fazendo login...');
    const loginResponse = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    console.log('Status do login:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login bem-sucedido!');
      const token = loginData.token;
      console.log('Token obtido:', token ? 'SIM' : 'NÃO');
      
      // 2. Testar API de simulações de consórcio com token
      console.log('\n2. Testando API de simulações de consórcio...');
      const consortiumResponse = await fetch('http://localhost:5000/api/consortium-simulations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Status da API:', consortiumResponse.status);
      
      if (consortiumResponse.ok) {
        const consortiumData = await consortiumResponse.json();
        console.log('✅ API funcionando!');
        console.log('Número de simulações retornadas:', consortiumData.length);
        
        consortiumData.forEach((sim, i) => {
          console.log(`${i+1}. ID: ${sim.id}, Nome: ${sim.name}, WhatsApp: ${sim.whatsappSent ? 'Enviado' : 'Não enviado'}`);
        });
      } else {
        const errorText = await consortiumResponse.text();
        console.log('❌ Erro na API:', errorText);
      }
      
    } else {
      const loginError = await loginResponse.text();
      console.log('❌ Erro no login:', loginError);
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testAdminToken();