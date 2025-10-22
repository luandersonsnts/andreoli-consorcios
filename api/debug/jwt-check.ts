import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    // Detailed JWT_SECRET check
    const jwtSecret = process.env.JWT_SECRET;
    
    const diagnostics = {
      JWT_SECRET_EXISTS: !!jwtSecret,
      JWT_SECRET_TYPE: typeof jwtSecret,
      JWT_SECRET_LENGTH: jwtSecret ? jwtSecret.length : 0,
      JWT_SECRET_FIRST_CHARS: jwtSecret ? jwtSecret.substring(0, 10) + '...' : 'NOT_SET',
      ALL_ENV_KEYS: Object.keys(process.env).filter(key => 
        key.includes('JWT') || 
        key.includes('SECRET') || 
        key.includes('POSTGRES') || 
        key.includes('DATABASE')
      ).sort()
    };

    res.json({ 
      message: 'JWT Secret diagnostic',
      timestamp: new Date().toISOString(),
      diagnostics
    });
  } catch (error) {
    console.error('JWT check error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}