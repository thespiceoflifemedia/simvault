import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";
import { customersTable } from "./customers";

export const passesTable = pgTable("passes", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  customerId: integer("customer_id").references(() => customersTable.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  remaining: integer("remaining").notNull(),
  expiresAt: timestamp("expires_at"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPassSchema = createInsertSchema(passesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPass = z.infer<typeof insertPassSchema>;
export type Pass = typeof passesTable.$inferSelect;
