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
} from "../shared/schema";
import { randomUUID } from "crypto";
import { eq, gte, lte, desc, count } from "drizzle-orm";
import bcrypt from "bcryptjs";

// Import database connection based on environment
let db: any;

if (process.env.VERCEL) {
  // Production: Use Vercel Postgres
  const { drizzle } = require('drizzle-orm/vercel-postgres');
  const { sql } = require('@vercel/postgres');
  db = drizzle(sql);
} else {
  // Development: Use SQLite
  const { drizzle } = require('drizzle-orm/better-sqlite3');
  const Database = require('better-sqlite3');
  const sqlite = new Database("database.sqlite");
  db = drizzle(sqlite);
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
  updateConsortiumSimulationWhatsAppStatus(id: number): Promise<ConsortiumSimulation>;
  getSimulationStats(): Promise<{
    totalSimulations: number;
    totalConsortiumSimulations: number;
    simulationsThisMonth: number;
    consortiumSimulationsThisMonth: number;
  }>;
}

class CloudStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const newUser = {
      id,
      username: user.username,
      password: hashedPassword,
      createdAt: new Date()
    };

    await db.insert(users).values(newUser);
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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    const updatedUser = await this.getUser(userId);
    return { ...updatedUser!, password: '' }; // Don't return password
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const id = randomUUID();
    const newSimulation = {
      id,
      ...simulation,
      createdAt: new Date(),
      whatsappSent: false
    };

    await db.insert(simulations).values(newSimulation);
    return newSimulation;
  }

  async getSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).orderBy(desc(simulations.createdAt));
  }

  async getAllSimulations(): Promise<Simulation[]> {
    return this.getSimulations();
  }

  async updateSimulationWhatsAppStatus(id: string): Promise<Simulation> {
    await db.update(simulations)
      .set({ whatsappSent: true })
      .where(eq(simulations.id, id));

    const result = await db.select().from(simulations).where(eq(simulations.id, id)).limit(1);
    return result[0];
  }

  async createComplaint(complaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const newComplaint = {
      id,
      ...complaint,
      createdAt: new Date()
    };

    await db.insert(complaints).values(newComplaint);
    return newComplaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    return await db.select().from(complaints).orderBy(desc(complaints.createdAt));
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return this.getComplaints();
  }

  async createJobApplication(jobApplication: InsertJobApplication): Promise<JobApplication> {
    const id = randomUUID();
    const newJobApplication = {
      id,
      ...jobApplication,
      createdAt: new Date()
    };

    await db.insert(jobApplications).values(newJobApplication);
    return newJobApplication;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
  }

  async getAllJobApplications(): Promise<JobApplication[]> {
    return this.getJobApplications();
  }

  async getJobApplicationByResumeFilename(filename: string): Promise<JobApplication | undefined> {
    const result = await db.select().from(jobApplications).where(eq(jobApplications.resumeFilename, filename)).limit(1);
    return result[0];
  }

  async createConsortiumSimulation(consortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation> {
    const newConsortiumSimulation = {
      ...consortiumSimulation,
      createdAt: new Date(),
      whatsappSent: false
    };

    const result = await db.insert(consortiumSimulations).values(newConsortiumSimulation).returning();
    return result[0];
  }

  async getConsortiumSimulations(): Promise<ConsortiumSimulation[]> {
    return await db.select().from(consortiumSimulations).orderBy(desc(consortiumSimulations.createdAt));
  }

  async getAllConsortiumSimulations(): Promise<ConsortiumSimulation[]> {
    return this.getConsortiumSimulations();
  }

  async updateConsortiumSimulationWhatsAppStatus(id: number): Promise<ConsortiumSimulation> {
    await db.update(consortiumSimulations)
      .set({ whatsappSent: true })
      .where(eq(consortiumSimulations.id, id));

    const result = await db.select().from(consortiumSimulations).where(eq(consortiumSimulations.id, id)).limit(1);
    return result[0];
  }

  async getSimulationStats(): Promise<{
    totalSimulations: number;
    totalConsortiumSimulations: number;
    simulationsThisMonth: number;
    consortiumSimulationsThisMonth: number;
  }> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalSimulationsResult,
      totalConsortiumSimulationsResult,
      simulationsThisMonthResult,
      consortiumSimulationsThisMonthResult
    ] = await Promise.all([
      db.select({ count: count() }).from(simulations),
      db.select({ count: count() }).from(consortiumSimulations),
      db.select({ count: count() }).from(simulations).where(gte(simulations.createdAt, startOfMonth)),
      db.select({ count: count() }).from(consortiumSimulations).where(gte(consortiumSimulations.createdAt, startOfMonth))
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