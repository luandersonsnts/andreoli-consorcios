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
  type InsertConsortiumSimulation
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  getSimulations(): Promise<Simulation[]>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaints(): Promise<Complaint[]>;
  createJobApplication(jobApplication: InsertJobApplication): Promise<JobApplication>;
  getJobApplications(): Promise<JobApplication[]>;
  createConsortiumSimulation(consortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation>;
  getConsortiumSimulations(): Promise<ConsortiumSimulation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private simulations: Map<string, Simulation>;
  private complaints: Map<string, Complaint>;
  private jobApplications: Map<string, JobApplication>;
  private consortiumSimulations: Map<string, ConsortiumSimulation>;

  constructor() {
    this.users = new Map();
    this.simulations = new Map();
    this.complaints = new Map();
    this.jobApplications = new Map();
    this.consortiumSimulations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSimulation(insertSimulation: InsertSimulation): Promise<Simulation> {
    const id = randomUUID();
    const simulation: Simulation = { 
      ...insertSimulation, 
      id, 
      createdAt: new Date() 
    };
    this.simulations.set(id, simulation);
    return simulation;
  }

  async getSimulations(): Promise<Simulation[]> {
    return Array.from(this.simulations.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const complaint: Complaint = { 
      ...insertComplaint, 
      id, 
      createdAt: new Date() 
    };
    this.complaints.set(id, complaint);
    return complaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createJobApplication(insertJobApplication: InsertJobApplication): Promise<JobApplication> {
    const id = randomUUID();
    const jobApplication: JobApplication = { 
      ...insertJobApplication, 
      id, 
      createdAt: new Date(),
      resumeFilename: insertJobApplication.resumeFilename || null
    };
    this.jobApplications.set(id, jobApplication);
    return jobApplication;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return Array.from(this.jobApplications.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createConsortiumSimulation(insertConsortiumSimulation: InsertConsortiumSimulation): Promise<ConsortiumSimulation> {
    const id = randomUUID();
    const consortiumSimulation: ConsortiumSimulation = {
      ...insertConsortiumSimulation,
      id: Number(id.replace(/-/g, '').substring(0, 8), 16),
      useEmbedded: insertConsortiumSimulation.useEmbedded ?? false,
      createdAt: new Date()
    };
    this.consortiumSimulations.set(id, consortiumSimulation);
    return consortiumSimulation;
  }

  async getConsortiumSimulations(): Promise<ConsortiumSimulation[]> {
    return Array.from(this.consortiumSimulations.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }
}

export const storage = new MemStorage();
