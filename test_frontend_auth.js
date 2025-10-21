async function testFrontendAuth() {
  try {
    console.log('Testando autenticação do frontend...');
    
    // Simular o que o frontend faz
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
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      const token = loginData.token;
      console.log('Login bem-sucedido!');
      
      // Simular como o frontend armazena o token
      console.log('\n2. Testando requisição como o frontend faz...');
      const response = await fetch('http://localhost:5000/api/job-applications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status da requisição:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Candidaturas encontradas:', data.length);
        console.log('Primeira candidatura:', data[0]);
        
        // Verificar se há candidaturas com currículo
        const withResume = data.filter(app => app.resumeFilename);
        console.log('Candidaturas com currículo:', withResume.length);
        
      } else {
        const errorText = await response.text();
        console.log('Erro na requisição:', errorText);
      }
      
    } else {
      console.log('Erro no login:', await loginResponse.text());
    }
    
  } catch (error) {
    console.error('Erro no teste:', error.message);
  }
}

testFrontendAuth();