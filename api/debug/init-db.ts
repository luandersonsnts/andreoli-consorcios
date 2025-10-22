import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../lib/storage-cloud';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verificar se já existe um usuário admin
    const existingAdmin = await storage.getUserByUsername('admin');
    
    if (existingAdmin) {
      return res.json({ 
        message: 'Admin user already exists',
        success: true,
        created: false
      });
    }

    // Criar usuário admin padrão
    const adminUser = await storage.createUser({
      username: 'admin',
      password: 'admin123'
    });

    res.json({ 
      message: 'Admin user created successfully',
      success: true,
      created: true,
      user: { id: adminUser.id, username: adminUser.username }
    });
  } catch (error) {
    console.error('Init DB error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
}