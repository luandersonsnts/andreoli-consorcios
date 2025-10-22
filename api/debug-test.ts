import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action as string;

  if (action === 'storage-import') {
    try {
      // Test importing storage
      const { storage } = await import('../lib/storage-cloud');
      
      return res.status(200).json({
        success: true,
        message: 'Storage import successful',
        storageType: typeof storage,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Storage import failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    }
  }

  return res.status(200).json({
    message: 'Debug API funcionando!',
    timestamp: new Date().toISOString(),
    method: req.method,
    query: req.query,
    version: '1.0.0',
    availableActions: ['storage-import']
  });
}