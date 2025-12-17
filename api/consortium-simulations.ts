import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from '../lib/storage-cloud';
import { insertConsortiumSimulationSchema } from '../shared/schema';

function isAuthorized(req: VercelRequest): boolean {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) return false;
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      if (!isAuthorized(req)) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const sims = await storage.getConsortiumSimulations();
      res.status(200).json(sims);
      return;
    }

    if (req.method === 'POST') {
      const body = req.body ?? {};
      const parsed = insertConsortiumSimulationSchema.safeParse(body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Invalid payload', details: parsed.error.flatten() });
        return;
      }
      const created = await storage.createConsortiumSimulation(parsed.data);
      res.status(201).json(created);
      return;
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}