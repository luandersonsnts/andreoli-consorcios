import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../lib/storage-cloud';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ message: 'Invalid simulation ID' });
    }

    const simulation = await storage.updateSimulationWhatsAppStatus(id);
    return res.json({ success: true, simulation });
  } catch (error) {
    console.error('Error updating simulation WhatsApp status:', error);
    return res.status(500).json({ message: "Erro ao atualizar status do WhatsApp" });
  }
}