import { NextRequest, NextResponse } from 'next/server';
import { storage } from '../../lib/storage-cloud';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Verificando usuários no banco de dados...');
    
    // Verificar se há usuários no banco
    const users = await storage.getAllUsers();
    
    const response = {
      success: true,
      message: 'Verificação de usuários concluída',
      data: {
        totalUsers: users.length,
        users: users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }))
      },
      timestamp: new Date().toISOString()
    };

    console.log('✅ Usuários encontrados:', response.data.totalUsers);
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('❌ Erro ao verificar usuários:', error);
    
    const errorResponse = {
      success: false,
      message: 'Erro ao verificar usuários',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}