import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";
import { customersTable } from "./customers";

export const loyaltyPointsTable = pgTable("loyalty_points", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  customerId: integer("customer_id").references(() => customersTable.id, { onDelete: "cascade" }).notNull(),
  customerName: text("customer_name").notNull(),
  pointsBalance: numeric("points_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  totalEarned: numeric("total_earned", { precision: 12, scale: 2 }).notNull().default("0"),
  totalRedeemed: numeric("total_redeemed", { precision: 12, scale: 2 }).notNull().default("0"),
  lastRedeemDate: timestamp("last_redeem_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLoyaltyPointSchema = createInsertSchema(loyaltyPointsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertLoyaltyPoint = z.infer<typeof insertLoyaltyPointSchema>;
export type LoyaltyPoint = typeof loyaltyPointsTable.$inferSelect;
