import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer, { FileFilterCallback } from "multer";
import { storage } from "./storage";
import { 
  insertSimulationSchema,
  insertComplaintSchema,
  insertJobApplicationSchema,
  insertConsortiumSimulationSchema
} from "@shared/schema";

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
  app.get("/api/simulations", async (req, res) => {
    try {
      const simulations = await storage.getSimulations();
      res.json(simulations);
    } catch (error) {
      console.error('Error fetching simulations:', error);
      res.status(500).json({ message: "Erro ao buscar simulações" });
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
  app.get("/api/complaints", async (req, res) => {
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
  app.get("/api/job-applications", async (req, res) => {
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
  app.get("/api/consortium-simulations", async (req, res) => {
    try {
      const consortiumSimulations = await storage.getConsortiumSimulations();
      res.json(consortiumSimulations);
    } catch (error) {
      console.error('Error fetching consortium simulations:', error);
      res.status(500).json({ message: "Erro ao buscar simulações de consórcios" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
