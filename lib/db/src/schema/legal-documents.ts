import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";

export const legalDocumentsTable = pgTable("legal_documents", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull().default(""),
  active: boolean("active").notNull().default(true),
  requireAcceptance: boolean("require_acceptance").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLegalDocumentSchema = createInsertSchema(legalDocumentsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLegalDocument = z.infer<typeof insertLegalDocumentSchema>;
export type LegalDocument = typeof legalDocumentsTable.$inferSelect;
