import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../../lib/storage-cloud';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await storage.authenticateUser(username, password);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new admin user
    const user = await storage.createUser({ username, password });
    
    return res.json({ 
      success: true, 
      message: "Admin user created successfully",
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(400).json({ message: "Error creating admin user" });
  }
}