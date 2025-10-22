import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🚀 API migrate-postgres chamada');
  
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
    console.log('🔧 Iniciando migração PostgreSQL...');
    
    // Criar tabela users
    console.log('👤 Criando tabela users...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Criar tabela simulations
    console.log('📊 Criando tabela simulations...');
    await sql`
      CREATE TABLE IF NOT EXISTS simulations (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        objective TEXT NOT NULL,
        monthly_amount TEXT NOT NULL,
        timeframe TEXT NOT NULL,
        whatsapp_sent BOOLEAN DEFAULT false,
        whatsapp_sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Criar tabela complaints
    console.log('📝 Criando tabela complaints...');
    await sql`
      CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        type TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        contact_authorized TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Criar tabela job_applications
    console.log('💼 Criando tabela job_applications...');
    await sql`
      CREATE TABLE IF NOT EXISTS job_applications (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        resume_filename TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Criar tabela consortium_simulations
    console.log('🏢 Criando tabela consortium_simulations...');
    await sql`
      CREATE TABLE IF NOT EXISTS consortium_simulations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        category TEXT NOT NULL,
        group_id TEXT NOT NULL,
        credit_value DECIMAL NOT NULL,
        use_embedded BOOLEAN DEFAULT false,
        max_installment_value DECIMAL NOT NULL,
        installment_count INTEGER NOT NULL,
        whatsapp_sent BOOLEAN DEFAULT false,
        whatsapp_sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Todas as tabelas criadas com sucesso');
    
    // Verificar se usuário admin existe
    console.log('👤 Verificando usuário admin...');
    const existingUser = await sql`SELECT id FROM users WHERE username = 'admin'`;
    
    if (existingUser.rows.length === 0) {
      console.log('🔐 Criando usuário admin...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const result = await sql`
        INSERT INTO users (username, password) 
        VALUES ('admin', ${hashedPassword})
        RETURNING id, username, created_at
      `;
      
      console.log('✅ Usuário admin criado com sucesso');
      
      return res.status(201).json({
        success: true,
        message: 'Migração concluída e usuário admin criado',
        user: result.rows[0],
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('✅ Usuário admin já existe');
      
      return res.status(200).json({
        success: true,
        message: 'Migração concluída - usuário admin já existe',
        userId: existingUser.rows[0].id,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Erro na migração:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro na migração PostgreSQL',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}