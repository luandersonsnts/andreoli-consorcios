import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

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
        return res.status(200).json({
          success: true,
          message: 'API funcionando perfeitamente',
          action: 'test',
          timestamp: new Date().toISOString(),
          environment: {
            node_version: process.version,
            platform: process.platform
          }
        });

      case 'env-check':
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

      case 'storage-test':
        try {
          // Test importing storage
          const { storage } = await import('../lib/storage-cloud');
          
          return res.status(200).json({
            success: true,
            message: 'Storage import successful',
            storageType: typeof storage,
            timestamp: new Date().toISOString(),
            action: 'storage-test'
          });
        } catch (error) {
          return res.status(500).json({
            success: false,
            error: 'Storage import failed',
            details: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString(),
            action: 'storage-test'
          });
        }

      case 'db-test':
        try {
          // Teste simples de conexão
          const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
          
          return res.status(200).json({
            success: true,
            message: 'Conexão com PostgreSQL bem-sucedida',
            database_info: {
              current_time: result.rows[0].current_time,
              postgres_version: result.rows[0].postgres_version
            },
            timestamp: new Date().toISOString()
          });
        } catch (dbError) {
          return res.status(500).json({
            success: false,
            error: 'Falha na conexão com PostgreSQL',
            details: dbError instanceof Error ? dbError.message : 'Erro desconhecido',
            timestamp: new Date().toISOString()
          });
        }

      default:
        return res.status(400).json({
          success: false,
          error: 'Ação não reconhecida',
          available_actions: ['test', 'env-check', 'db-test'],
          timestamp: new Date().toISOString()
        });
    }

  } catch (error) {
    console.error('Erro na API:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno da API',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}