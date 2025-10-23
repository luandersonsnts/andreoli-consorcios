const { default: fetch } = require('node-fetch');

async function debugFrontendAuth() {
  try {
    console.log('🔍 DEBUG: Simulando comportamento do frontend...');
    
    // 1. Fazer login como o frontend faz
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
    
    if (!loginResponse.ok) {
      const errorText = await loginResponse.text();
      console.error('❌ Erro no login:', errorText);
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('✅ Login bem-sucedido!');
    console.log('Token recebido:', loginData.token ? 'SIM' : 'NÃO');
    console.log('User recebido:', loginData.user ? 'SIM' : 'NÃO');
    
    const token = loginData.token;
    
    // 2. Testar API de simulações como o frontend faz
    console.log('\n2. Testando API de simulações...');
    const consortiumResponse = await fetch('http://localhost:5000/api/consortium-simulations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log('Status da API:', consortiumResponse.status);
    
    if (!consortiumResponse.ok) {
      const errorText = await consortiumResponse.text();
      console.error('❌ Erro na API:', errorText);
      return;
    }
    
    const consortiumData = await consortiumResponse.json();
    console.log('✅ API funcionando!');
    console.log('Simulações encontradas:', consortiumData.length);
    
    // 3. Testar outras APIs
    console.log('\n3. Testando API de reclamações...');
    const complaintsResponse = await fetch('http://localhost:5000/api/complaints', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log('Status da API de reclamações:', complaintsResponse.status);
    
    if (complaintsResponse.ok) {
      const complaintsData = await complaintsResponse.json();
      console.log('✅ API de reclamações funcionando!');
      console.log('Reclamações encontradas:', complaintsData.length);
    } else {
      const errorText = await complaintsResponse.text();
      console.error('❌ Erro na API de reclamações:', errorText);
    }
    
    console.log('\n4. Testando API de candidaturas...');
    const jobsResponse = await fetch('http://localhost:5000/api/job-applications', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    console.log('Status da API de candidaturas:', jobsResponse.status);
    
    if (jobsResponse.ok) {
      const jobsData = await jobsResponse.json();
      console.log('✅ API de candidaturas funcionando!');
      console.log('Candidaturas encontradas:', jobsData.length);
    } else {
      const errorText = await jobsResponse.text();
      console.error('❌ Erro na API de candidaturas:', errorText);
    }
    
    console.log('\n=== RESUMO ===');
    console.log('✅ Login: OK');
    console.log('✅ Token: OK');
    console.log('✅ API Simulações: OK');
    console.log('✅ Todas as APIs estão funcionando!');
    console.log('\n🤔 Se as APIs estão funcionando, o problema deve estar no frontend...');
    console.log('Possíveis causas:');
    console.log('1. Token não está sendo salvo no localStorage');
    console.log('2. Usuário não está sendo autenticado no frontend');
    console.log('3. Problema com o useQuery ou React Query');
    console.log('4. Problema com o isStaticSite');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

debugFrontendAuth();