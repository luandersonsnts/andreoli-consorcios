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
} from "../shared/schema.pg";
import { randomUUID } from "crypto";
import { eq, gte, lte, desc, count } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Import database connection based on environment
let db: any;

async function initializeDatabase() {
  if (db) return db; // Return existing connection if already initialized
  
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV) {
    // Production: Use Vercel Postgres
    const { drizzle } = await import('drizzle-orm/vercel-postgres');
    const { sql } = await import('@vercel/postgres');
    db = drizzle(sql);
  } else {
    // Development: Use SQLite
    const { drizzle } = await import('drizzle-orm/better-sqlite3');
    const Database = (await import('better-sqlite3')).default;
    const sqlite = new Database("database.sqlite");
    db = drizzle(sqlite);
  }
  
  return db;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(username: string, password: string): Promise<User | null>;
  updateUserPassword(userId: string, newPassword: string): Promise<User>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  getSimulations(): Promise<Simulation[]>;
  getAllSimulations(): Promise<Simulation[]>;
  updateSimulationWhatsAppStatus(id: string): Promise<Simulation>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaints(): Promise<Complaint[]>;
  getAllComplaints(): Promise<Complaint[]>;
  createJobApplication(jobApplication: InsertJobApplication): Promise<JobApplication>;
  getJobApplications(): Promise<JobApplication[]>;
  getAllJobApplications(): Promise<JobApplication[]>;
  getJobApplicationByResumeFilename(filename: string): Promise<JobApplication | undefined>;
  createConsortiumSimulation(consortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation>;
  getConsortiumSimulations(): Promise<ConsortiumSimulation[]>;
  getAllConsortiumSimulations(): Promise<ConsortiumSimulation[]>;
  updateConsortiumSimulationWhatsAppStatus(id: string): Promise<ConsortiumSimulation>;
  getSimulationStats(): Promise<{
    totalSimulations: number;
    totalConsortiumSimulations: number;
    simulationsThisMonth: number;
    consortiumSimulationsThisMonth: number;
  }>;
}

class CloudStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const database = await initializeDatabase();
    const result = await database.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const database = await initializeDatabase();
    const result = await database.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const database = await initializeDatabase();
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const newUser = {
      id,
      username: user.username,
      password: hashedPassword,
      createdAt: new Date()
    };

    await database.insert(users).values(newUser);
    return { ...newUser, password: '' }; // Don't return password
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return { ...user, password: '' }; // Don't return password
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    const database = await initializeDatabase();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await database.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    const updatedUser = await this.getUser(userId);
    return { ...updatedUser!, password: '' }; // Don't return password
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const database = await initializeDatabase();
    const id = randomUUID();
    const newSimulation = {
      id,
      ...simulation,
      createdAt: new Date(),
      whatsappSent: false,
      whatsappSentAt: simulation.whatsappSentAt ?? null
    };

    await database.insert(simulations).values(newSimulation);
    return newSimulation;
  }

  async getSimulations(): Promise<Simulation[]> {
    const database = await initializeDatabase();
    return await database.select().from(simulations).orderBy(desc(simulations.createdAt));
  }

  async getAllSimulations(): Promise<Simulation[]> {
    return this.getSimulations();
  }

  async updateSimulationWhatsAppStatus(id: string): Promise<Simulation> {
    const database = await initializeDatabase();
    await database.update(simulations)
      .set({ whatsappSent: true, whatsappSentAt: new Date() })
      .where(eq(simulations.id, id));

    const result = await database.select().from(simulations).where(eq(simulations.id, id)).limit(1);
    return result[0];
  }

  async createComplaint(complaint: InsertComplaint): Promise<Complaint> {
    const database = await initializeDatabase();
    const id = randomUUID();
    const newComplaint = {
      id,
      ...complaint,
      createdAt: new Date()
    };

    await database.insert(complaints).values(newComplaint);
    return newComplaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    const database = await initializeDatabase();
    return await database.select().from(complaints).orderBy(desc(complaints.createdAt));
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return this.getComplaints();
  }

  async createJobApplication(jobApplication: InsertJobApplication): Promise<JobApplication> {
    const database = await initializeDatabase();
    const id = randomUUID();
    const newJobApplication = {
      id,
      name: jobApplication.name,
      phone: jobApplication.phone,
      email: jobApplication.email,
      position: jobApplication.position ?? null,
      linkedin: jobApplication.linkedin ?? null,
      resumeFilename: jobApplication.resumeFilename ?? null,
      createdAt: new Date()
    };

    await database.insert(jobApplications).values(newJobApplication);
    return newJobApplication;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    const database = await initializeDatabase();
    return await database.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
  }

  async getAllJobApplications(): Promise<JobApplication[]> {
    return this.getJobApplications();
  }

  async getJobApplicationByResumeFilename(filename: string): Promise<JobApplication | undefined> {
    const database = await initializeDatabase();
    const result = await database.select().from(jobApplications).where(eq(jobApplications.resumeFilename, filename)).limit(1);
    return result[0];
  }

  async createConsortiumSimulation(consortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation> {
    const database = await initializeDatabase();
    const id = randomUUID();
    const newConsortiumSimulation = {
      id,
      ...consortiumSimulation,
      createdAt: new Date()
    };

    const result = await database.insert(consortiumSimulations).values(newConsortiumSimulation).returning();
    return result[0];
  }

  async getConsortiumSimulations(): Promise<ConsortiumSimulation[]> {
    const database = await initializeDatabase();
    return await database.select().from(consortiumSimulations).orderBy(desc(consortiumSimulations.createdAt));
  }

  async getAllConsortiumSimulations(): Promise<ConsortiumSimulation[]> {
    return this.getConsortiumSimulations();
  }

  async updateConsortiumSimulationWhatsAppStatus(id: string): Promise<ConsortiumSimulation> {
    const database = await initializeDatabase();
    const numericId = parseInt(id, 10);
    await database.update(consortiumSimulations)
      .set({ whatsappSent: true, whatsappSentAt: new Date() })
      .where(eq(consortiumSimulations.id, numericId));

    const result = await database.select().from(consortiumSimulations).where(eq(consortiumSimulations.id, numericId)).limit(1);
    return result[0];
  }

  async getSimulationStats(): Promise<{
    totalSimulations: number;
    totalConsortiumSimulations: number;
    simulationsThisMonth: number;
    consortiumSimulationsThisMonth: number;
  }> {
    const database = await initializeDatabase();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalSimulationsResult,
      totalConsortiumSimulationsResult,
      simulationsThisMonthResult,
      consortiumSimulationsThisMonthResult
    ] = await Promise.all([
      database.select({ count: count() }).from(simulations),
      database.select({ count: count() }).from(consortiumSimulations),
      database.select({ count: count() }).from(simulations).where(gte(simulations.createdAt, startOfMonth)),
      database.select({ count: count() }).from(consortiumSimulations).where(gte(consortiumSimulations.createdAt, startOfMonth))
    ]);

    return {
      totalSimulations: totalSimulationsResult[0]?.count || 0,
      totalConsortiumSimulations: totalConsortiumSimulationsResult[0]?.count || 0,
      simulationsThisMonth: simulationsThisMonthResult[0]?.count || 0,
      consortiumSimulationsThisMonth: consortiumSimulationsThisMonthResult[0]?.count || 0
    };
  }
}

export const storage = new CloudStorage();