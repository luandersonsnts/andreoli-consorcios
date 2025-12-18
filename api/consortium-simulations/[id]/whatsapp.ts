import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../../lib/storage-cloud';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'PATCH') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const idParam = req.query.id;
    if (!idParam || Array.isArray(idParam)) {
      res.status(400).json({ error: 'Invalid id' });
      return;
    }

    const simulation = await storage.updateConsortiumSimulationWhatsAppStatus(idParam);
    res.status(200).json({ success: true, simulation });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}