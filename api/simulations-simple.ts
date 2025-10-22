import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json({
        success: true,
        message: 'Simulações API funcionando (versão simples)',
        simulations: [],
        timestamp: new Date().toISOString()
      });

    } else if (req.method === 'POST') {
      return res.status(201).json({
        success: true,
        message: 'Simulação criada (versão simples)',
        simulation: {
          id: 'test-' + Date.now(),
          ...req.body,
          createdAt: new Date().toISOString()
        },
        timestamp: new Date().toISOString()
      });

    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Simulations Simple API error:', error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}