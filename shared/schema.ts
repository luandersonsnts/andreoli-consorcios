import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const simulations = pgTable("simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  objective: text("objective").notNull(),
  monthlyAmount: text("monthly_amount").notNull(),
  timeframe: text("timeframe").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complaints = pgTable("complaints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  type: text("type").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  contactAuthorized: text("contact_authorized").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobApplications = pgTable("job_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  resumeFilename: text("resume_filename"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  createdAt: true,
});

export const consortiumSimulations = pgTable('consortium_simulations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  creditValue: decimal('credit_value', { precision: 15, scale: 2 }).notNull(),
  useEmbedded: boolean('use_embedded').default(false),
  maxInstallmentValue: decimal('max_installment_value', { precision: 15, scale: 2 }).notNull(),
  installmentCount: integer('installment_count').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertConsortiumSimulationSchema = createInsertSchema(consortiumSimulations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Simulation = typeof simulations.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type Complaint = typeof complaints.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertConsortiumSimulation = z.infer<typeof insertConsortiumSimulationSchema>;
export type ConsortiumSimulation = typeof consortiumSimulations.$inferSelect;
