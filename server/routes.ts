import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer, { FileFilterCallback } from "multer";
import jwt from "jsonwebtoken";
import express from "express";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { 
  insertSimulationSchema,
  insertComplaintSchema,
  insertJobApplicationSchema,
  insertConsortiumSimulationSchema,
  insertUserSchema
} from "@shared/schema";

// JWT secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    (req as any).user = user;
    next();
  });
};

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Allow only PDF, DOC, and DOCX files
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files statically
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Route to download resume files
  app.get("/api/download-resume/:filename", authenticateToken, async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Arquivo não encontrado" });
    }
    
    try {
      // Get the job application to find the candidate's name
      const application = await storage.getJobApplicationByResumeFilename(filename);
      let downloadFilename = 'curriculo.pdf';
      
      if (application && application.name) {
        // Create a clean filename with candidate's name
        const cleanName = application.name
          .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .toLowerCase();
        downloadFilename = `curriculo_${cleanName}.pdf`;
      }
      
      // Set proper headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
      
      res.download(filePath, downloadFilename, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ message: "Erro ao baixar arquivo" });
        }
      });
    } catch (error) {
      console.error('Error getting application data:', error);
      // Fallback to generic filename
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="curriculo.pdf"`);
      res.download(filePath, 'curriculo.pdf');
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.authenticateUser(username, password);
      
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
  });

  app.post("/api/admin/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(validatedData);
      
      res.json({ 
        success: true, 
        message: "Admin user created successfully",
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: "Error creating admin user" });
    }
  });

  // Admin password reset endpoint
  app.post("/api/admin/reset-password", authenticateToken, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = (req as any).user.id;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      // Verify current password
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isCurrentPasswordValid = await storage.authenticateUser(user.username, currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Update password
      await storage.updateUserPassword(userId, newPassword);
      
      res.json({ 
        success: true, 
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin dashboard stats endpoint
  app.get("/api/admin/stats", authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getSimulationStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ message: "Error fetching statistics" });
    }
  });

  // Admin global config (premiação)
  app.get("/api/admin/config", authenticateToken, async (_req, res) => {
    try {
      const config = await storage.getGlobalConfig();
      res.json(config);
    } catch (error) {
      console.error('Error fetching admin config:', error);
      res.status(500).json({ message: "Error fetching admin config" });
    }
  });

  app.patch("/api/admin/config", authenticateToken, async (req, res) => {
    try {
      const { premiacaoEnabled, campaignLabel } = req.body || {};
      const updated = await storage.setGlobalConfig({
        premiacaoEnabled: typeof premiacaoEnabled === 'boolean' ? premiacaoEnabled : undefined,
        campaignLabel: typeof campaignLabel === 'string' ? campaignLabel : undefined,
      });
      res.json(updated);
    } catch (error) {
      console.error('Error updating admin config:', error);
      res.status(500).json({ message: "Error updating admin config" });
    }
  });

  // Public config (read-only)
  app.get("/api/config", async (_req, res) => {
    try {
      const config = await storage.getGlobalConfig();
      res.json(config);
    } catch (error) {
      console.error('Error fetching public config:', error);
      res.status(500).json({ message: "Error fetching public config" });
    }
  });

  // Investment simulation endpoint
  app.post("/api/simulations", async (req, res) => {
    try {
      const validatedData = insertSimulationSchema.parse(req.body);
      const simulation = await storage.createSimulation(validatedData);
      
      // Here you would typically send an email notification
      console.log('New simulation request:', simulation);
      
      res.json({ 
        success: true, 
        message: "Simulação enviada com sucesso! Entraremos em contato em breve.",
        id: simulation.id 
      });
    } catch (error) {
      console.error('Error creating simulation:', error);
      res.status(400).json({ 
        success: false, 
        message: "Erro ao enviar simulação. Verifique os dados e tente novamente." 
      });
    }
  });

  // Get all simulations (for admin purposes)
  app.get("/api/simulations", authenticateToken, async (req, res) => {
    try {
      const simulations = await storage.getSimulations();
      res.json(simulations);
    } catch (error) {
      console.error('Error fetching simulations:', error);
      res.status(500).json({ message: "Erro ao buscar simulações" });
    }
  });

  // Update simulation WhatsApp status
  app.patch("/api/simulations/:id/whatsapp", async (req, res) => {
    try {
      const { id } = req.params;
      const simulation = await storage.updateSimulationWhatsAppStatus(id);
      res.json({ success: true, simulation });
    } catch (error) {
      console.error('Error updating simulation WhatsApp status:', error);
      res.status(500).json({ message: "Erro ao atualizar status do WhatsApp" });
    }
  });

  // Complaints endpoint
  app.post("/api/complaints", async (req, res) => {
    try {
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      
      // Here you would typically send an email notification
      console.log('New complaint received:', complaint);
      
      res.json({ 
        success: true, 
        message: "Manifestação enviada com sucesso! Você receberá uma resposta em até 24 horas úteis.",
        id: complaint.id 
      });
    } catch (error) {
      console.error('Error creating complaint:', error);
      res.status(400).json({ 
        success: false, 
        message: "Erro ao enviar manifestação. Verifique os dados e tente novamente." 
      });
    }
  });

  // Get all complaints (for admin purposes)
  app.get("/api/complaints", authenticateToken, async (req, res) => {
    try {
      const complaints = await storage.getComplaints();
      res.json(complaints);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      res.status(500).json({ message: "Erro ao buscar manifestações" });
    }
  });

  // Job application endpoint with file upload
  app.post("/api/job-applications", upload.single('resume'), async (req, res) => {
    try {
      const jobApplicationData = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        resumeFilename: (req as any).file?.filename || null,
      };

      const validatedData = insertJobApplicationSchema.parse(jobApplicationData);
      const jobApplication = await storage.createJobApplication(validatedData);
      
      // Here you would typically send an email notification
      console.log('New job application:', jobApplication);
      
      res.json({ 
        success: true, 
        message: "Currículo enviado com sucesso! Entraremos em contato em breve.",
        id: jobApplication.id 
      });
    } catch (error) {
      console.error('Error creating job application:', error);
      res.status(400).json({ 
        success: false, 
        message: "Erro ao enviar currículo. Verifique os dados e tente novamente." 
      });
    }
  });

  // Get all job applications (for admin purposes)
  app.get("/api/job-applications", authenticateToken, async (req, res) => {
    try {
      const jobApplications = await storage.getJobApplications();
      res.json(jobApplications);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      res.status(500).json({ message: "Erro ao buscar candidaturas" });
    }
  });

  // Consortium simulation endpoint
  app.post("/api/consortium-simulations", async (req, res) => {
    try {
      const validatedData = insertConsortiumSimulationSchema.parse(req.body);
      const consortiumSimulation = await storage.createConsortiumSimulation(validatedData);
      
      console.log('New consortium simulation received:', consortiumSimulation);
      
      res.json({ 
        success: true, 
        message: "Simulação de consórcio enviada com sucesso! Entraremos em contato em breve.",
        id: consortiumSimulation.id 
      });
    } catch (error) {
      console.error('Error creating consortium simulation:', error);
      res.status(400).json({ 
        success: false, 
        message: "Erro ao enviar simulação de consórcio. Verifique os dados e tente novamente." 
      });
    }
  });

  // Get all consortium simulations (for admin purposes)
  app.get("/api/consortium-simulations", authenticateToken, async (req, res) => {
    try {
      const consortiumSimulations = await storage.getConsortiumSimulations();
      res.json(consortiumSimulations);
    } catch (error) {
      console.error('Error fetching consortium simulations:', error);
      res.status(500).json({ message: "Erro ao buscar simulações de consórcios" });
    }
  });

  // Test endpoint to check UTF-8 encoding
  app.get("/api/test-encoding", authenticateToken, async (req, res) => {
    try {
      const consortiumSimulations = await storage.getConsortiumSimulations();
      let textResponse = "Teste de Encoding UTF-8:\n\n";
      
      consortiumSimulations.forEach((sim, index) => {
        textResponse += `${index + 1}. Nome: ${sim.name}\n`;
        textResponse += `   Categoria: ${sim.category}\n`;
        textResponse += `   Email: ${sim.email}\n\n`;
      });
      
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(textResponse);
    } catch (error) {
      console.error('Error in test encoding:', error);
      res.status(500).send("Erro no teste de encoding");
    }
  });

  // Update consortium simulation WhatsApp status
  app.patch("/api/consortium-simulations/:id/whatsapp", async (req, res) => {
    try {
      const { id } = req.params;
      const simulation = await storage.updateConsortiumSimulationWhatsAppStatus(parseInt(id));
      res.json({ success: true, simulation });
    } catch (error) {
      console.error('Error updating consortium simulation WhatsApp status:', error);
      res.status(500).json({ message: "Erro ao atualizar status do WhatsApp" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
