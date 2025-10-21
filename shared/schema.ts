import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const simulations = sqliteTable("simulations", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  objective: text("objective").notNull(),
  monthlyAmount: text("monthly_amount").notNull(),
  timeframe: text("timeframe").notNull(),
  whatsappSent: integer("whatsapp_sent", { mode: 'boolean' }).default(false),
  whatsappSentAt: integer("whatsapp_sent_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const complaints = sqliteTable("complaints", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  type: text("type").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  contactAuthorized: text("contact_authorized").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const jobApplications = sqliteTable("job_applications", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(16))))`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  resumeFilename: text("resume_filename"),
  createdAt: integer("created_at", { mode: 'timestamp' }).default(sql`(unixepoch())`),
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

export const consortiumSimulations = sqliteTable('consortium_simulations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  category: text('category').notNull(), // automovel, imovel, servicos, pesados
  groupId: text('group_id').notNull(), // ID do grupo escolhido
  creditValue: real('credit_value').notNull(),
  useEmbedded: integer('use_embedded', { mode: 'boolean' }).default(false),
  maxInstallmentValue: real('max_installment_value').notNull(),
  installmentCount: integer('installment_count').notNull(),
  whatsappSent: integer("whatsapp_sent", { mode: 'boolean' }).default(false),
  whatsappSentAt: integer("whatsapp_sent_at", { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
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
