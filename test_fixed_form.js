// Script para testar o formulário corrigido
const testFixedForm = async () => {
  const baseUrl = 'http://localhost:5173';
  
  const simulationData = {
    name: "Teste Formulário Corrigido",
    phone: "11888888888",
    email: "teste@corrigido.com",
    category: "carro",
    groupId: "CAR001",
    creditValue: 75000,
    maxInstallmentValue: 1200,
    installmentCount: 72,
    useEmbedded: false,
    whatsappSent: false
  };

  try {
    console.log('🧪 Testando formulário corrigido...');
    console.log('📦 Dados a serem enviados:', simulationData);
    
    const response = await fetch(`${baseUrl}/api/consortium-simulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData)
    });

    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Status text:', response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Simulação criada com sucesso!');
      console.log('📄 Resultado:', result);
      return result;
    } else {
      const errorText = await response.text();
      console.error('❌ Erro na requisição:', response.status, response.statusText);
      console.error('❌ Detalhes do erro:', errorText);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    return null;
  }
};

// Executar o teste
testFixedForm().then(result => {
  if (result) {
    console.log('🎉 Formulário corrigido funciona! ID da simulação:', result.id);
  } else {
    console.log('💥 Ainda há problemas no formulário!');
  }
});