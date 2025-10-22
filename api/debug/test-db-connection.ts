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
    // Test direct connection to Vercel Postgres
    const { sql } = require('@vercel/postgres');
    
    // Simple query to test connection
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`;
    
    res.json({ 
      message: 'Database connection successful',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        currentTime: result.rows[0]?.current_time,
        version: result.rows[0]?.postgres_version
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ 
      message: "Database connection failed",
      error: error instanceof Error ? error.message : 'Unknown error',
      connected: false
    });
  }
}