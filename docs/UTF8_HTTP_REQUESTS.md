# Solução para Problema de Codificação UTF-8 em Requisições HTTP

## Problema Identificado

Durante os testes da aplicação, foi identificado um problema de codificação de caracteres especiais (acentos, cedilhas, etc.) quando dados eram enviados via requisições HTTP para a API. Caracteres como "ã", "é", "ç" estavam sendo corrompidos e exibidos incorretamente no banco de dados.

## Análise do Problema

### Sintomas Observados
- Simulações criadas diretamente no banco de dados preservavam caracteres especiais corretamente
- Simulações criadas via API HTTP apresentavam caracteres corrompidos
- Exemplo: "João" se tornava "Jos" (caractere "ã" era perdido)

### Causa Raiz
O problema ocorria porque as requisições HTTP não especificavam explicitamente a codificação UTF-8 no cabeçalho `Content-Type`, causando interpretação incorreta dos caracteres especiais pelo servidor.

## Solução Implementada

### Para Requisições PowerShell/Invoke-WebRequest
Especificar explicitamente `charset=utf-8` no `ContentType`:

```powershell
$headers = @{
    'Content-Type' = 'application/json; charset=utf-8'
    'Authorization' = "Bearer $token"
}

$body = @{
    name = "Maria José"
    email = "maria@example.com"
    # ... outros campos
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost:5000/api/consortium-simulations" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

### Para Requisições JavaScript/Fetch
```javascript
const response = await fetch('/api/consortium-simulations', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
});
```

### Para Requisições cURL
```bash
curl -X POST http://localhost:5000/api/consortium-simulations \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "João da Silva", "email": "joao@example.com", ...}'
```

## Verificação da Solução

### Teste Realizado
1. **Simulação ID 36**: Criada sem `charset=utf-8` → "Jos da Silva" (corrompido)
2. **Simulação ID 38**: Criada com `charset=utf-8` → "Maria José" (correto)

### Comando de Teste
```powershell
# Teste com UTF-8 explícito
$headers = @{
    'Content-Type' = 'application/json; charset=utf-8'
    'Authorization' = "Bearer $token"
}

$testData = @{
    name = "José da Silva"
    email = "jose@test.com"
    phone = "11999999999"
    category = "Automóvel"
    groupId = "AUTO001"
    creditValue = 50000
    maxInstallmentValue = 800
    installmentCount = 60
    useEmbedded = $false
    whatsappSent = $false
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost:5000/api/consortium-simulations" `
    -Method POST `
    -Headers $headers `
    -Body $testData
```

## Configuração do Servidor

### Verificação da Configuração UTF-8
O servidor já estava configurado corretamente para UTF-8:
- Banco de dados SQLite com codificação UTF-8
- API retornando dados com caracteres especiais corretos
- Problema estava apenas nas requisições de entrada

### Middleware de Parsing
O servidor utiliza middleware adequado para parsing JSON:
```javascript
app.use(express.json({ limit: '10mb' }));
```

## Recomendações

### Para Desenvolvedores
1. **Sempre especificar `charset=utf-8`** em requisições HTTP que contenham dados com caracteres especiais
2. **Testar com dados contendo acentos** durante o desenvolvimento
3. **Verificar a codificação** tanto na ida quanto na volta dos dados

### Para Ferramentas de Teste
- **Postman**: Verificar se o Content-Type inclui `charset=utf-8`
- **Insomnia**: Configurar adequadamente os headers
- **Scripts automatizados**: Incluir charset em todas as requisições

## Status da Implementação

✅ **Problema identificado e solucionado**
✅ **Solução testada e validada**
✅ **Documentação criada**

## Arquivos Relacionados

- `server/routes.ts` - Endpoints da API
- `shared/schema.ts` - Schemas de validação
- `test_encoding.cjs` - Script de teste de codificação
- Simulações de teste: IDs 35-39

---

**Data da Documentação**: Janeiro 2025
**Responsável**: Assistente de Desenvolvimento
**Status**: Resolvido