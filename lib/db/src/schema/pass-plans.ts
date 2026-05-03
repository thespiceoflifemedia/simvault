import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";

/**
 * Pass product templates — what the Golf918 "Passes" admin page manages.
 * e.g. "10-Session Pass – $199 – 10 credits"
 * Distinct from the `passes` table which tracks individual customer purchases.
 */
export const passPlansTable = pgTable("pass_plans", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  creditsValue: integer("credits_value").notNull().default(0),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPassPlanSchema = createInsertSchema(passPlansTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPassPlan = z.infer<typeof insertPassPlanSchema>;
export type PassPlan = typeof passPlansTable.$inferSelect;
