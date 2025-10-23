// Script para testar envio de simulação através do formulário público
const testFormSubmission = async () => {
  const baseUrl = 'http://localhost:5173';
  
  const simulationData = {
    name: "Teste Formulário Público",
    phone: "11999999999",
    email: "teste@formulario.com",
    category: "carro",
    groupId: "CAR001",
    creditValue: 50000,
    maxInstallmentValue: 800,
    installmentCount: 60,
    useEmbedded: false,
    whatsappSent: false
  };

  try {
    console.log('🧪 Testando envio através do formulário público...');
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
testFormSubmission().then(result => {
  if (result) {
    console.log('🎉 Teste concluído com sucesso! ID da simulação:', result.id);
  } else {
    console.log('💥 Teste falhou!');
  }
});