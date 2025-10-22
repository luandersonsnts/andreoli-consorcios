import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../lib/storage-cloud';

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Inicializando banco de dados...');
    
    // Verificar se já existe um usuário admin
    const existingAdmin = await storage.getUserByUsername('admin');
    
    if (existingAdmin) {
      const response = {
        message: 'Admin user already exists',
        success: true,
        created: false,
        user: { id: existingAdmin.id, username: existingAdmin.username },
        timestamp: new Date().toISOString()
      };
      
      console.log('ℹ️ Usuário admin já existe');
      return NextResponse.json(response, { status: 200 });
    }

    // Criar usuário admin padrão
    const adminUser = await storage.createUser({
      username: 'admin',
      password: 'admin123'
    });

    const response = {
      message: 'Admin user created successfully',
      success: true,
      created: true,
      user: { id: adminUser.id, username: adminUser.username },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Usuário admin criado com sucesso');
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    
    const errorResponse = {
      message: "Erro ao inicializar banco de dados",
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      success: false,
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}