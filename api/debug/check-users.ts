import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../lib/storage-cloud';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Verificar se existe usuário admin
    const adminUser = await storage.getUserByUsername('admin');
    
    res.json({ 
      hasAdminUser: !!adminUser,
      adminExists: !!adminUser,
      message: adminUser ? 'Admin user exists' : 'No admin user found'
    });
  } catch (error) {
    console.error('Check users error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}