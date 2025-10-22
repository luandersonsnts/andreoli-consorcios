import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔍 API check-users chamada');
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    // Verificar usuários existentes
    console.log('📊 Consultando usuários no banco...');
    const result = await sql`SELECT id, username, created_at FROM users ORDER BY created_at DESC`;
    
    console.log(`✅ Encontrados ${result.rows.length} usuários`);
    
    return res.status(200).json({
      success: true,
      message: `Encontrados ${result.rows.length} usuários`,
      users: result.rows,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro ao verificar usuários',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}