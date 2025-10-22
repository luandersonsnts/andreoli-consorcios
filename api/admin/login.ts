import { VercelRequest, VercelResponse } from '@vercel/node';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🔐 API login chamada');
  
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
    const { username, password } = req.body;
    
    console.log('👤 Tentativa de login para usuário:', username);

    if (!username || !password) {
      console.log('❌ Credenciais incompletas');
      return res.status(400).json({
        success: false,
        error: 'Username e password são obrigatórios'
      });
    }

    // Verificar se a tabela users existe e criar se necessário
    console.log('🔧 Verificando/criando tabela users...');
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      console.log('✅ Tabela users verificada/criada');
    } catch (tableError) {
      console.log('⚠️ Erro ao criar tabela users:', tableError);
    }

    // Verificar se o usuário existe
    console.log('🔍 Buscando usuário no banco...');
    let userResult = await sql`SELECT id, username, password, created_at FROM users WHERE username = ${username}`;
    
    // Se o usuário admin não existir, criar automaticamente
    if (userResult.rows.length === 0 && username === 'admin') {
      console.log('🔧 Usuário admin não encontrado, criando automaticamente...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const createResult = await sql`
        INSERT INTO users (username, password) 
        VALUES ('admin', ${hashedPassword})
        RETURNING id, username, password, created_at
      `;
      
      userResult = createResult;
      console.log('✅ Usuário admin criado automaticamente');
    }
    
    if (userResult.rows.length === 0) {
      console.log('❌ Usuário não encontrado');
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    const user = userResult.rows[0];
    
    // Verificar senha
    console.log('🔐 Verificando senha...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Senha inválida');
      return res.status(401).json({
        success: false,
        error: 'Credenciais inválidas'
      });
    }

    // Gerar token JWT
    console.log('🎫 Gerando token JWT...');
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET não configurado');
      return res.status(500).json({
        success: false,
        error: 'Configuração do servidor incompleta'
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    console.log('✅ Login realizado com sucesso');
    
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        username: user.username,
        created_at: user.created_at
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    });
  }
}