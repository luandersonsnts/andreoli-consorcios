import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { storage } from '../../lib/storage-cloud';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Tentativa de login...');
    
    const body = await request.json();
    const { username, password } = body;
    
    if (!username || !password) {
      console.log('❌ Username ou password não fornecidos');
      return NextResponse.json({ 
        message: "Username and password are required",
        success: false 
      }, { status: 400 });
    }

    let user = await storage.authenticateUser(username, password);
    
    // If user doesn't exist and it's admin with default password, create it
    if (!user && username === 'admin' && password === 'admin123') {
      try {
        const existingUser = await storage.getUserByUsername('admin');
        if (!existingUser) {
          console.log('🔧 Criando usuário admin automaticamente...');
          // Create admin user
          await storage.createUser({
            username: 'admin',
            password: 'admin123'
          });
          
          // Try authentication again
          user = await storage.authenticateUser(username, password);
        }
      } catch (createError) {
        console.error('❌ Erro ao criar usuário admin:', createError);
      }
    }
    
    if (!user) {
      console.log('❌ Credenciais inválidas para:', username);
      return NextResponse.json({ 
        message: "Invalid credentials",
        success: false 
      }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login realizado com sucesso para:', username);
    
    const response = {
      success: true, 
      token,
      user: { id: user.id, username: user.username },
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('❌ Erro no login:', error);
    
    const errorResponse = {
      message: "Erro interno do servidor",
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      success: false,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}