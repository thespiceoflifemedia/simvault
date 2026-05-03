import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, usersTable, facilitySettingsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { z } from "zod";
import { hashPassword } from "../lib/auth";

const router: IRouter = Router();

const updateTenantSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

const facilitySettingsSchema = z.object({
  timezone: z.string().optional(),
  advanceBookingDays: z.coerce.number().int().min(1).max(365).optional(),
  minimumDurationMinutes: z.coerce.number().int().min(15).max(480).optional(),
  onlinePaymentsRequired: z.boolean().optional(),
  currency: z.string().length(3).optional(),
  cancellationFeeDays: z.coerce.number().int().min(0).optional(),
  cancellationFeePercent: z.coerce.number().min(0).max(100).optional(),
  taxPercent: z.coerce.number().min(0).max(100).optional(),
});

const inviteEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "manager", "front-desk", "coach", "staff"]),
  phone: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
});

router.get("/tenant", requireAuth, async (req, res) => {
  const [tenant] = await db
    .select()
    .from(tenantsTable)
    .where(eq(tenantsTable.id, req.session.tenantId!))
    .limit(1);
  if (!tenant) {
    res.status(404).json({ error: "Tenant not found" });
    return;
  }
  res.json(tenant);
});

router.put("/tenant", requireAuth, async (req, res) => {
  const parsed = updateTenantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [updated] = await db
    .update(tenantsTable)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(tenantsTable.id, req.session.tenantId!))
    .returning();
  res.json(updated);
});

router.get("/facility-settings", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  let [settings] = await db
    .select()
    .from(facilitySettingsTable)
    .where(eq(facilitySettingsTable.tenantId, tenantId))
    .limit(1);
  if (!settings) {
    [settings] = await db
      .insert(facilitySettingsTable)
      .values({ tenantId })
      .returning();
  }
  res.json(settings);
});

router.put("/facility-settings", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = facilitySettingsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const existing = await db
    .select({ id: facilitySettingsTable.id })
    .from(facilitySettingsTable)
    .where(eq(facilitySettingsTable.tenantId, tenantId))
    .limit(1);
  let settings;
  if (existing.length === 0) {
    [settings] = await db
      .insert(facilitySettingsTable)
      .values({ tenantId, ...parsed.data })
      .returning();
  } else {
    [settings] = await db
      .update(facilitySettingsTable)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(facilitySettingsTable.tenantId, tenantId))
      .returning();
  }
  res.json(settings);
});

router.get("/employees", requireAuth, async (req, res) => {
  const employees = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      phone: usersTable.phone,
      role: usersTable.role,
      position: usersTable.position,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(eq(usersTable.tenantId, req.session.tenantId!));
  res.json(employees);
});

router.post("/employees", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = inviteEmployeeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const { name, email, password, role, phone, position } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const [user] = await db.insert(usersTable).values({
    tenantId,
    email,
    passwordHash,
    name,
    role,
    phone: phone ?? null,
    position: position ?? null,
  }).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    phone: usersTable.phone,
    role: usersTable.role,
    position: usersTable.position,
    createdAt: usersTable.createdAt,
  });

  res.status(201).json(user);
});

router.delete("/employees/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);

  const [target] = await db.select().from(usersTable).where(
    and(eq(usersTable.id, id), eq(usersTable.tenantId, tenantId))
  ).limit(1);

  if (!target) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  if (target.role === "owner") {
    res.status(403).json({ error: "Cannot remove the account owner" });
    return;
  }

  await db.delete(usersTable).where(
    and(eq(usersTable.id, id), eq(usersTable.tenantId, tenantId))
  );

  res.json({ ok: true });
});

export default router;
