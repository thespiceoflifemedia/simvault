import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";

export const baysTable = pgTable("bays", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  simulator: text("simulator"),
  bayType: text("bay_type").notNull().default("regular"),
  minPlayers: integer("min_players").notNull().default(1),
  maxPlayers: integer("max_players").notNull().default(6),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBaySchema = createInsertSchema(baysTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBay = z.infer<typeof insertBaySchema>;
export type Bay = typeof baysTable.$inferSelect;
