import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
      case 'test-basic':
        return res.status(200).json({
          success: true,
          message: 'API funcionando',
          environment: process.env.NODE_ENV || 'development',
          hasPostgresUrl: !!process.env.POSTGRES_URL,
          hasJwtSecret: !!process.env.JWT_SECRET,
          timestamp: new Date().toISOString()
        });

      case 'test-db':
        const testResult = await sql`SELECT 1 as test`;
        return res.status(200).json({
          success: true,
          message: 'Conexão PostgreSQL funcionando',
          test_result: testResult.rows[0],
          timestamp: new Date().toISOString()
        });

      case 'check-users':
        const users = await sql`SELECT id, username, created_at FROM users ORDER BY created_at DESC`;
        return res.status(200).json({
          success: true,
          users: users.rows,
          count: users.rows.length,
          timestamp: new Date().toISOString()
        });

      case 'init-db':
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
        
        if (existingAdmin.rows.length === 0) {
          // Criar usuário admin
          const hashedPassword = await bcrypt.hash('admin123', 10);
          await sql`
            INSERT INTO users (username, password) 
            VALUES ('admin', ${hashedPassword})
          `;
          
          return res.status(200).json({
            success: true,
            message: 'Tabela criada e usuário admin inicializado',
            admin_created: true,
            timestamp: new Date().toISOString()
          });
        } else {
          return res.status(200).json({
            success: true,
            message: 'Tabela já existe e admin já está configurado',
            admin_created: false,
            timestamp: new Date().toISOString()
          });
        }

      case 'jwt-check':
        if (!process.env.JWT_SECRET) {
          return res.status(500).json({
            success: false,
            error: 'JWT_SECRET não configurado'
          });
        }

        // Testar criação e verificação de token
        const testPayload = { userId: 1, username: 'test' };
        const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return res.status(200).json({
          success: true,
          message: 'JWT funcionando corretamente',
          token_created: !!token,
          token_verified: !!decoded,
          timestamp: new Date().toISOString()
        });

      case 'migrate-postgres':
        // Criar todas as tabelas necessárias
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS simulations (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            credit_value DECIMAL(10,2) NOT NULL,
            monthly_payment DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS job_applications (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            position VARCHAR(255) NOT NULL,
            experience TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS complaints (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        return res.status(200).json({
          success: true,
          message: 'Migração PostgreSQL concluída - todas as tabelas criadas',
          timestamp: new Date().toISOString()
        });

      default:
        return res.status(400).json({
          success: false,
          error: 'Ação não reconhecida',
          available_actions: ['test-basic', 'test-db', 'check-users', 'init-db', 'jwt-check', 'migrate-postgres']
        });
    }

  } catch (error) {
    console.error('Erro na API debug:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}