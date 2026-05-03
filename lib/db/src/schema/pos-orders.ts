import { pgTable, text, serial, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";
import { bookingsTable } from "./bookings";

export const posOrdersTable = pgTable("pos_orders", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  bookingId: integer("booking_id").references(() => bookingsTable.id, { onDelete: "set null" }),
  customerName: text("customer_name").notNull(),
  items: text("items").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPosOrderSchema = createInsertSchema(posOrdersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPosOrder = z.infer<typeof insertPosOrderSchema>;
export type PosOrder = typeof posOrdersTable.$inferSelect;
