import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action } = req.query;

  try {
    switch (action) {
      case 'test':
        // Teste simples de conectividade
        return res.status(200).json({
          success: true,
          message: 'API funcionando',
          action: 'test',
          timestamp: new Date().toISOString(),
          environment: {
            node_version: process.version,
            platform: process.platform
          }
        });

      case 'env-check':
        // Verificar variáveis de ambiente disponíveis
        const envVars = {
          POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT_SET',
          DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
          POSTGRES_HOST: process.env.POSTGRES_HOST ? 'SET' : 'NOT_SET',
          POSTGRES_USER: process.env.POSTGRES_USER ? 'SET' : 'NOT_SET',
          POSTGRES_DATABASE: process.env.POSTGRES_DATABASE ? 'SET' : 'NOT_SET',
          NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
        };
        
        return res.status(200).json({
          success: true,
          message: 'Verificação de variáveis de ambiente',
          environment_variables: envVars,
          timestamp: new Date().toISOString()
        });

      case 'neon-direct':
        // Teste direto com Neon usando fetch
        const neonUrl = 'https://ep-morning-bush-acj230xb-pooler.sa-east-1.aws.neon.tech';
        
        try {
          const response = await fetch(neonUrl, {
            method: 'HEAD',
            headers: {
              'User-Agent': 'Vercel-Function-Test'
            }
          });
          
          return res.status(200).json({
            success: true,
            message: 'Teste de conectividade com Neon',
            neon_reachable: response.ok,
            status: response.status,
            timestamp: new Date().toISOString()
          });
        } catch (fetchError) {
          return res.status(200).json({
            success: false,
            message: 'Erro ao conectar com Neon',
            error: fetchError instanceof Error ? fetchError.message : 'Erro desconhecido',
            timestamp: new Date().toISOString()
          });
        }

      default:
        return res.status(400).json({
          success: false,
          error: 'Ação não reconhecida',
          available_actions: ['test', 'env-check', 'neon-direct'],
          timestamp: new Date().toISOString()
        });
    }

  } catch (error) {
    console.error('Erro na API Neon:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno da API',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}