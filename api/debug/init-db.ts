import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🚀 API init-db chamada');
  
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }
  
  try {
    console.log('🔧 Iniciando processo de inicialização do banco...');
    
    // Verificar se o usuário admin já existe
    console.log('👤 Verificando se usuário admin existe...');
    const existingUser = await sql`SELECT id FROM users WHERE username = 'admin'`;
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Usuário admin já existe');
      return res.status(200).json({
        success: true,
        message: 'Usuário admin já existe',
        userId: existingUser.rows[0].id,
        timestamp: new Date().toISOString()
      });
    }

    // Criar usuário admin
    console.log('🔐 Criando usuário admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await sql`
      INSERT INTO users (username, password, email, role) 
      VALUES ('admin', ${hashedPassword}, 'admin@andreoli.com', 'admin')
      RETURNING id, username, email, role
    `;
    
    console.log('✅ Usuário admin criado com sucesso');
    
    return res.status(201).json({
      success: true,
      message: 'Usuário admin criado com sucesso',
      user: result.rows[0],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro ao inicializar banco de dados',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}