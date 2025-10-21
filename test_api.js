async function testJobApplicationAPIWithAuth() {
  try {
    console.log('Testando API de candidaturas com autenticação...');
    
    // Primeiro, fazer login para obter um token válido
    console.log('\n1. Fazendo login para obter token...');
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
    
    console.log('Status Login:', loginResponse.status);
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('Login bem-sucedido! Token obtido.');
      const token = loginData.token;
      
      // Agora testar a rota GET com o token válido
      console.log('\n2. Testando GET /api/job-applications com token válido');
      const getResponse = await fetch('http://localhost:5000/api/job-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Status GET:', getResponse.status);
      const getData = await getResponse.text();
      console.log('Resposta GET:', getData);
      
      // Testar POST novamente para confirmar
      console.log('\n3. Testando POST /api/job-applications');
      const postResponse = await fetch('http://localhost:5000/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Teste Usuario 2',
          phone: '11888888888',
          email: 'teste2@email.com'
        })
      });
      
      console.log('Status POST:', postResponse.status);
      const postData = await postResponse.text();
      console.log('Resposta POST:', postData);
      
      // Verificar novamente as candidaturas após o POST
      console.log('\n4. Verificando candidaturas após POST');
      const getResponse2 = await fetch('http://localhost:5000/api/job-applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Status GET final:', getResponse2.status);
      const getData2 = await getResponse2.text();
      console.log('Resposta GET final:', getData2);
      
    } else {
      const loginError = await loginResponse.text();
      console.log('Erro no login:', loginError);
    }
    
  } catch (error) {
    console.error('Erro no teste:', error.message);
  }
}

testJobApplicationAPIWithAuth();