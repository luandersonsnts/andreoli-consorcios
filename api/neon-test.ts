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
        const testResult = await sql`SELECT NOW() as current_time, version() as postgres_version`;
        
        return res.status(200).json({
          success: true,
          message: 'Conexão Neon PostgreSQL funcionando',
          data: testResult.rows[0],
          timestamp: new Date().toISOString()
        });

      case 'init':
        // Criar tabela users
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        // Verificar se admin existe
        const existingAdmin = await sql`SELECT id FROM users WHERE username = 'admin'`;
        
        let adminCreated = false;
        if (existingAdmin.rows.length === 0) {
          // Criar usuário admin com senha simples (será criptografada depois)
          const bcrypt = require('bcryptjs');
          const hashedPassword = await bcrypt.hash('admin123', 10);
          
          await sql`INSERT INTO users (username, password) VALUES ('admin', ${hashedPassword})`;
          adminCreated = true;
        }
        
        return res.status(200).json({
          success: true,
          message: 'Banco inicializado com sucesso',
          admin_created: adminCreated,
          timestamp: new Date().toISOString()
        });

      case 'users':
        const users = await sql`SELECT id, username, created_at FROM users ORDER BY created_at DESC`;
        
        return res.status(200).json({
          success: true,
          users: users.rows,
          count: users.rows.length,
          timestamp: new Date().toISOString()
        });

      default:
        return res.status(400).json({
          success: false,
          error: 'Ação não reconhecida',
          available_actions: ['test', 'init', 'users']
        });
    }

  } catch (error) {
    console.error('Erro na API Neon:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro de conexão com Neon PostgreSQL',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}