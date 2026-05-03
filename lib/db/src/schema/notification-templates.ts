import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { tenantsTable } from "./tenants";

export const notificationTemplatesTable = pgTable("notification_templates", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(),
  label: text("label").notNull(),
  description: text("description").notNull().default(""),
  subject: text("subject").notNull().default(""),
  body: text("body").notNull().default(""),
  activeEmail: boolean("active_email").notNull().default(false),
  activeSms: boolean("active_sms").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertNotificationTemplateSchema = createInsertSchema(notificationTemplatesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertNotificationTemplate = z.infer<typeof insertNotificationTemplateSchema>;
export type NotificationTemplate = typeof notificationTemplatesTable.$inferSelect;
