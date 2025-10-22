import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from '../lib/storage-cloud';
import { insertJobApplicationSchema } from '../shared/schema';

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
    // Get all job applications (requires authentication)
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

      const jobApplications = await storage.getJobApplications();
      return res.json(jobApplications);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return res.status(500).json({ message: 'Erro ao buscar candidaturas' });
    }
  }

  if (req.method === 'POST') {
    // Create new job application (public endpoint)
    // Note: File upload functionality would need to be implemented separately
    // For now, we'll accept job applications without file upload
    try {
      const jobApplicationData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        resumeFilename: null, // File upload not implemented in serverless version yet
      };

      const validatedData = insertJobApplicationSchema.parse(jobApplicationData);
      const jobApplication = await storage.createJobApplication(validatedData);
      
      console.log('New job application:', jobApplication);
      
      return res.json({ 
        success: true, 
        message: "Candidatura enviada com sucesso! Entraremos em contato em breve.",
        id: jobApplication.id 
      });
    } catch (error) {
      console.error('Error creating job application:', error);
      return res.status(400).json({ 
        success: false, 
        message: "Erro ao enviar candidatura. Verifique os dados e tente novamente." 
      });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}