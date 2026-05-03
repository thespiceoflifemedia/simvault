import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tenantsTable, usersTable } from "@workspace/db";
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

const inviteEmployeeSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "staff"]),
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

router.get("/employees", requireAuth, async (req, res) => {
  const employees = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
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

  const { name, email, password, role } = parsed.data;

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
  }).returning({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
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
