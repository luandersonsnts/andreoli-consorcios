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
    // List all environment variables (safely)
    const envVars: Record<string, any> = {};
    
    // Check for common database variables
    const dbVars = [
      'DATABASE_URL',
      'POSTGRES_URL', 
      'POSTGRES_PRISMA_URL',
      'POSTGRES_URL_NO_SSL',
      'POSTGRES_URL_NON_POOLING',
      'POSTGRES_USER',
      'POSTGRES_HOST',
      'POSTGRES_PASSWORD',
      'POSTGRES_DATABASE',
      'JWT_SECRET',
      'NODE_ENV',
      'VERCEL'
    ];

    dbVars.forEach(varName => {
      const value = process.env[varName];
      if (value) {
        // Hide sensitive values but show they exist
        if (varName.includes('PASSWORD') || varName.includes('SECRET') || varName.includes('URL')) {
          envVars[varName] = `[HIDDEN - ${value.length} chars]`;
        } else {
          envVars[varName] = value;
        }
      } else {
        envVars[varName] = '[NOT SET]';
      }
    });

    // Count total env vars
    const totalEnvVars = Object.keys(process.env).length;

    res.json({ 
      message: 'Environment variables check',
      timestamp: new Date().toISOString(),
      totalEnvVars,
      checkedVars: envVars
    });
  } catch (error) {
    console.error('Env list error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}