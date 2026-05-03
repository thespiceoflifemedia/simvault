import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, tenantsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../lib/auth";
import { requireAuth } from "../middlewares/requireAuth";
import { z } from "zod";

const router: IRouter = Router();

const registerSchema = z.object({
  facilityName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const { facilityName, email, password, name } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const slug = facilityName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const passwordHash = await hashPassword(password);

  const [tenant] = await db.insert(tenantsTable).values({
    name: facilityName,
    slug,
    email,
    plan: "starter",
  }).returning();

  const [user] = await db.insert(usersTable).values({
    tenantId: tenant.id,
    email,
    passwordHash,
    name,
    role: "owner",
  }).returning();

  req.session.userId = user.id;
  req.session.tenantId = tenant.id;

  res.status(201).json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan },
  });
});

router.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const [tenant] = await db.select().from(tenantsTable).where(eq(tenantsTable.id, user.tenantId)).limit(1);

  req.session.userId = user.id;
  req.session.tenantId = tenant.id;

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan },
  });
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("simvault.sid");
    res.json({ ok: true });
  });
});

router.get("/auth/me", requireAuth, async (req, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Session invalid" });
    return;
  }
  const [tenant] = await db.select().from(tenantsTable).where(eq(tenantsTable.id, user.tenantId)).limit(1);
  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug, plan: tenant.plan },
  });
});

export default router;
