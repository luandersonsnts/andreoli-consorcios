export default function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responder a requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verificar método
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Método não permitido',
      allowedMethods: ['GET']
    });
  }

  return res.status(200).json({
    message: 'API JavaScript funcionando',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    type: 'javascript'
  });
}