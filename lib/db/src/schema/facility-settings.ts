import { pgTable, text, serial, timestamp, integer, numeric, boolean } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants";

/**
 * Per-facility configuration — mirrors the Golf918 "Details" page settings:
 * Booking Settings, Payment Settings, Cancellation Fees, Taxes, etc.
 * One row per tenant, created on first access with sensible defaults.
 */
export const facilitySettingsTable = pgTable("facility_settings", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }).notNull().unique(),
  timezone: text("timezone").notNull().default("America/New_York"),
  advanceBookingDays: integer("advance_booking_days").notNull().default(30),
  minimumDurationMinutes: integer("minimum_duration_minutes").notNull().default(30),
  onlinePaymentsRequired: boolean("online_payments_required").notNull().default(false),
  currency: text("currency").notNull().default("USD"),
  cancellationFeeDays: integer("cancellation_fee_days").notNull().default(1),
  cancellationFeePercent: numeric("cancellation_fee_percent", { precision: 5, scale: 2 }).notNull().default("100"),
  taxPercent: numeric("tax_percent", { precision: 5, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type FacilitySettings = typeof facilitySettingsTable.$inferSelect;
