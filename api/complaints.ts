import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from '../lib/storage-cloud';
import { insertComplaintSchema } from '../shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to verify JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Get all complaints (requires authentication)
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      const complaints = await storage.getComplaints();
      return res.json(complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return res.status(500).json({ message: 'Erro ao buscar manifestações' });
    }
  }

  if (req.method === 'POST') {
    // Create new complaint (public endpoint)
    try {
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      
      console.log('New complaint received:', complaint);
      
      return res.json({ 
        success: true, 
        message: "Manifestação enviada com sucesso! Você receberá uma resposta em até 24 horas úteis.",
        id: complaint.id 
      });
    } catch (error) {
      console.error('Error creating complaint:', error);
      return res.status(400).json({ 
        success: false, 
        message: "Erro ao enviar manifestação. Verifique os dados e tente novamente." 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}