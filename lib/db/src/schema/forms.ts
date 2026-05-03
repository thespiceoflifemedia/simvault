import { pgTable, text, serial, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";

export const formsTable = pgTable("forms", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  type: text("type").notNull().default("intake"),
  active: boolean("active").notNull().default(true),
  questions: jsonb("questions").notNull().default([]),
  linkedTo: text("linked_to"),
  submissionCount: integer("submission_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertFormSchema = createInsertSchema(formsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertForm = z.infer<typeof insertFormSchema>;
export type Form = typeof formsTable.$inferSelect;

export const formSubmissionsTable = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  formId: integer("form_id").references(() => formsTable.id, { onDelete: "cascade" }).notNull(),
  customerName: text("customer_name").notNull().default(""),
  customerEmail: text("customer_email").notNull().default(""),
  responses: jsonb("responses").notNull().default({}),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissionsTable).omit({ id: true, submittedAt: true });
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;
export type FormSubmission = typeof formSubmissionsTable.$inferSelect;
