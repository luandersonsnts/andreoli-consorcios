import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('🚀 Iniciando setup do admin...');
    
    // Passo 1: Criar tabela users
    console.log('📋 Criando tabela users...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Passo 2: Verificar se admin já existe
    console.log('🔍 Verificando se admin existe...');
    const existingAdmin = await sql`
      SELECT id, username FROM users WHERE username = 'admin'
    `;
    
    if (existingAdmin.rows.length > 0) {
      console.log('✅ Admin já existe');
      return res.status(200).json({
        success: true,
        message: 'Setup concluído - Admin já existe',
        admin: existingAdmin.rows[0],
        action: 'existing_admin'
      });
    }
    
    // Passo 3: Criar usuário admin
    console.log('👤 Criando usuário admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const newAdmin = await sql`
      INSERT INTO users (username, password)
      VALUES ('admin', ${hashedPassword})
      RETURNING id, username, created_at
    `;
    
    console.log('✅ Admin criado com sucesso');
    
    return res.status(201).json({
      success: true,
      message: 'Setup concluído - Admin criado com sucesso!',
      admin: newAdmin.rows[0],
      action: 'admin_created',
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    });

  } catch (error) {
    console.error('❌ Erro no setup:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro no setup do admin',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}