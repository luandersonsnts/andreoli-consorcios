import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { storage } from '../../lib/storage-cloud';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
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

    let user = await storage.authenticateUser(username, password);
    
    // If user doesn't exist and it's admin with default password, create it
    if (!user && username === 'admin' && password === 'admin123') {
      try {
        const existingUser = await storage.getUserByUsername('admin');
        if (!existingUser) {
          // Create admin user
          await storage.createUser({
            username: 'admin',
            password: 'admin123'
          });
          
          // Try authentication again
          user = await storage.authenticateUser(username, password);
        }
      } catch (createError) {
        console.error('Error creating admin user:', createError);
      }
    }
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}