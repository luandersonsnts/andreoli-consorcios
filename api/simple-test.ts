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

  if (action === 'test-storage') {
    try {
      // Test importing storage
      const { storage } = await import('../lib/storage-cloud');
      
      return res.status(200).json({
        success: true,
        message: 'Storage import successful',
        storageType: typeof storage,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Storage import failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(200).json({
    message: 'API funcionando!',
    timestamp: new Date().toISOString(),
    method: req.method,
    query: req.query,
    availableActions: ['test-storage']
  });
}