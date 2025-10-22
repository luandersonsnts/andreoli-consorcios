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
    // List environment variables (safe ones only)
    const envVars = {
      VERCEL: process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV,
      POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT_SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? 'SET' : 'NOT_SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT_SET',
      // Show first few characters of JWT_SECRET if it exists
      JWT_SECRET_PREVIEW: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 8) + '...' : 'NOT_SET'
    };

    res.json({ 
      message: 'Environment check',
      timestamp: new Date().toISOString(),
      environment: envVars
    });
  } catch (error) {
    console.error('Environment check error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}