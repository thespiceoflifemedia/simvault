import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";

/**
 * Membership plan templates — what the Golf918 "Memberships" admin page manages.
 * e.g. "Golf Membership – 8hrs of play per month"
 * Distinct from the `memberships` table which tracks individual customer subscriptions.
 */
export const membershipPlansTable = pgTable("membership_plans", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  price: numeric("price", { precision: 10, scale: 2 }),
  hoursPerMonth: numeric("hours_per_month", { precision: 5, scale: 1 }),
  active: boolean("active").notNull().default(true),
  visibility: text("visibility").notNull().default("public"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertMembershipPlanSchema = createInsertSchema(membershipPlansTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertMembershipPlan = z.infer<typeof insertMembershipPlanSchema>;
export type MembershipPlan = typeof membershipPlansTable.$inferSelect;
