export default function handler(req: any, res: any) {
  res.status(200).json({ 
    message: 'API funcionando!', 
    timestamp: new Date().toISOString(),
    method: req.method,
    query: req.query
  });
}