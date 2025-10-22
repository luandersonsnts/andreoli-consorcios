import { 
  type User, 
  type InsertUser, 
  type Simulation, 
  type InsertSimulation,
  type Complaint,
  type InsertComplaint,
  type JobApplication,
  type InsertJobApplication,
  type ConsortiumSimulation,
  type InsertConsortiumSimulation,
  users,
  simulations,
  complaints,
  jobApplications,
  consortiumSimulations
} from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, gte, lte, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  updateUserPassword(userId: string, newPassword: string): Promise<User>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  getSimulations(): Promise<Simulation[]>;
  updateSimulationWhatsAppStatus(id: string): Promise<Simulation>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaints(): Promise<Complaint[]>;
  createJobApplication(jobApplication: InsertJobApplication): Promise<JobApplication>;
  getJobApplications(): Promise<JobApplication[]>;
  getJobApplicationByResumeFilename(filename: string): Promise<JobApplication | undefined>;
  createConsortiumSimulation(consortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation>;
  getConsortiumSimulations(): Promise<ConsortiumSimulation[]>;
  updateConsortiumSimulationWhatsAppStatus(id: number): Promise<ConsortiumSimulation>;
  getSimulationStats(): Promise<{
    totalSimulations: number;
    totalConsortiumSimulations: number;
    simulationsThisMonth: number;
    consortiumSimulationsThisMonth: number;
  }>;
}

// Initialize database connection
let db: any = null;
try {
  const databasePath = process.env.DATABASE_URL || "./database.sqlite";
  const sqlite = new Database(databasePath);
  
  // Configure SQLite for UTF-8 encoding
  sqlite.pragma('encoding = "UTF-8"');
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('synchronous = NORMAL');
  sqlite.pragma('cache_size = 1000');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('temp_store = MEMORY');
  
  db = drizzle(sqlite);
  console.log("Database connected successfully with UTF-8 encoding:", databasePath);
} catch (error) {
  console.error("Failed to connect to database:", error);
}

// In-memory storage fallback
class MemoryStorage implements IStorage {
  private users: User[] = [];
  private simulations: Simulation[] = [];
  private complaints: Complaint[] = [];
  private jobApplications: JobApplication[] = [];
  private consortiumSimulations: ConsortiumSimulation[] = [];
  private consortiumIdCounter = 1;

  constructor() {
    // Create a default admin user for testing
    this.initializeDefaultAdmin();
  }

  private async initializeDefaultAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    this.users.push({
      id: randomUUID(),
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date()
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const user: User = {
      id: randomUUID(),
      username: insertUser.username,
      password: hashedPassword,
      createdAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    return user;
  }

  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const simulation: Simulation = {
      id: randomUUID(),
      ...insertSimulation,
      whatsappSent: false,
      whatsappSentAt: null,
      createdAt: new Date()
    };
    this.simulations.push(simulation);
    return simulation;
  }

  async getSimulations(): Promise<Simulation[]> {
    return this.simulations;
  }

  async updateSimulationWhatsAppStatus(id: string): Promise<Simulation> {
    const simulation = this.simulations.find(s => s.id === id);
    if (!simulation) {
      throw new Error("Simulation not found");
    }
    simulation.whatsappSent = true;
    simulation.whatsappSentAt = new Date();
    return simulation;
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const complaint: Complaint = {
      id: randomUUID(),
      ...insertComplaint,
      createdAt: new Date()
    };
    this.complaints.push(complaint);
    return complaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    return this.complaints;
  }

  async createJobApplication(insertJobApplication: InsertJobApplication): Promise<JobApplication> {
    const jobApplication: JobApplication = {
      id: randomUUID(),
      ...insertJobApplication,
      resumeFilename: insertJobApplication.resumeFilename ?? null,
      createdAt: new Date()
    };
    this.jobApplications.push(jobApplication);
    return jobApplication;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return this.jobApplications;
  }

  async getJobApplicationByResumeFilename(filename: string): Promise<JobApplication | undefined> {
    return this.jobApplications.find(app => app.resumeFilename === filename);
  }

  async createConsortiumSimulation(insertConsortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation> {
    const consortiumSimulation: ConsortiumSimulation = {
      id: this.consortiumIdCounter++,
      ...insertConsortiumSimulation,
      useEmbedded: insertConsortiumSimulation.useEmbedded ?? null,
      whatsappSent: false,
      whatsappSentAt: null,
      createdAt: new Date()
    };
    this.consortiumSimulations.push(consortiumSimulation);
    return consortiumSimulation;
  }

  async getConsortiumSimulations(): Promise<ConsortiumSimulation[]> {
    return this.consortiumSimulations;
  }

  async updateConsortiumSimulationWhatsAppStatus(id: number): Promise<ConsortiumSimulation> {
    const simulation = this.consortiumSimulations.find(s => s.id === id);
    if (!simulation) {
      throw new Error("Consortium simulation not found");
    }
    simulation.whatsappSent = true;
    simulation.whatsappSentAt = new Date();
    return simulation;
  }

  async getSimulationStats(): Promise<{
    totalSimulations: number;
    totalConsortiumSimulations: number;
    simulationsThisMonth: number;
    consortiumSimulationsThisMonth: number;
  }> {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const simulationsThisMonth = this.simulations.filter(s => {
      if (!s.createdAt) return false;
      const date = new Date(s.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    const consortiumSimulationsThisMonth = this.consortiumSimulations.filter(s => {
      if (!s.createdAt) return false;
      const date = new Date(s.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    return {
      totalSimulations: this.simulations.length,
      totalConsortiumSimulations: this.consortiumSimulations.length,
      simulationsThisMonth,
      consortiumSimulationsThisMonth
    };
  }
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize default admin user
    this.initializeDefaultAdmin();
  }

  private async initializeDefaultAdmin() {
    try {
      if (!db) return;
      
      // Check if admin user already exists
      const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin')).limit(1);
      
      if (existingAdmin.length === 0) {
        // Create default admin user
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await db.insert(users).values({
          username: 'admin',
          password: hashedPassword
        });
        console.log("Default admin user created successfully");
      }
    } catch (error) {
      console.error("Error initializing default admin:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not initialized");
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const userWithHashedPassword = { ...insertUser, password: hashedPassword };
    
    const result = await db.insert(users).values(userWithHashedPassword).returning();
    return result[0];
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    if (!db) throw new Error("Database not initialized");
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId))
      .returning();
    
    if (result.length === 0) {
      throw new Error("User not found");
    }
    
    return result[0];
  }

  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.insert(simulations).values(insertSimulation).returning();
    return result[0];
  }

  async getSimulations(): Promise<Simulation[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(simulations).orderBy(desc(simulations.createdAt));
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.insert(complaints).values(insertComplaint).returning();
    return result[0];
  }

  async getComplaints(): Promise<Complaint[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(complaints).orderBy(desc(complaints.createdAt));
  }

  async createJobApplication(insertJobApplication: InsertJobApplication): Promise<JobApplication> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.insert(jobApplications).values(insertJobApplication).returning();
    return result[0];
  }

  async getJobApplications(): Promise<JobApplication[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
  }

  async getJobApplicationByResumeFilename(filename: string): Promise<JobApplication | undefined> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.select().from(jobApplications).where(eq(jobApplications.resumeFilename, filename)).limit(1);
    return result[0] || undefined;
  }

  async createConsortiumSimulation(insertConsortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.insert(consortiumSimulations).values(insertConsortiumSimulation).returning();
    return result[0];
  }

  async getConsortiumSimulations(): Promise<ConsortiumSimulation[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(consortiumSimulations).orderBy(desc(consortiumSimulations.createdAt));
  }

  async updateSimulationWhatsAppStatus(id: string): Promise<Simulation> {
    if (!db) throw new Error("Database not initialized");
    const result = await db
      .update(simulations)
      .set({ 
        whatsappSent: true, 
        whatsappSentAt: new Date() 
      })
      .where(eq(simulations.id, id))
      .returning();
    return result[0];
  }

  async updateConsortiumSimulationWhatsAppStatus(id: number): Promise<ConsortiumSimulation> {
    if (!db) throw new Error("Database not initialized");
    const result = await db
      .update(consortiumSimulations)
      .set({ 
        whatsappSent: true, 
        whatsappSentAt: new Date() 
      })
      .where(eq(consortiumSimulations.id, id))
      .returning();
    return result[0];
  }

  async getSimulationStats(): Promise<{
    totalSimulations: number;
    totalConsortiumSimulations: number;
    simulationsThisMonth: number;
    consortiumSimulationsThisMonth: number;
  }> {
    if (!db) throw new Error("Database not initialized");
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [
      totalSims,
      totalConsortiumSims,
      monthSims,
      monthConsortiumSims
    ] = await Promise.all([
      db.select().from(simulations),
      db.select().from(consortiumSimulations),
      db.select().from(simulations).where(gte(simulations.createdAt, startOfMonth)),
      db.select().from(consortiumSimulations).where(gte(consortiumSimulations.createdAt, startOfMonth))
    ]);

    return {
      totalSimulations: totalSims.length,
      totalConsortiumSimulations: totalConsortiumSims.length,
      simulationsThisMonth: monthSims.length,
      consortiumSimulationsThisMonth: monthConsortiumSims.length,
    };
  }
}

// Use database storage if available, otherwise fallback to memory storage
export const storage: IStorage = db ? new DatabaseStorage() : new MemoryStorage();
