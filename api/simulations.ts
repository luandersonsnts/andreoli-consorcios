import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from '../lib/storage-cloud';
import { insertSimulationSchema } from '../shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
const authenticateToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

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
      // Get all simulations (requires authentication)
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const user = authenticateToken(token);
      if (!user) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      const simulations = await storage.getAllSimulations();
      res.json(simulations);

    } else if (req.method === 'POST') {
      // Create new simulation (public endpoint)
      const validatedData = insertSimulationSchema.parse(req.body);
      const simulation = await storage.createSimulation(validatedData);
      res.status(201).json(simulation);

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Simulations API error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}