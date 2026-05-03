import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { customersTable, insertCustomerSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/customers", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const customers = await db.select().from(customersTable).where(eq(customersTable.tenantId, tenantId));
  res.json(customers);
});

router.post("/customers", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertCustomerSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [customer] = await db.insert(customersTable).values(parsed.data).returning();
  res.status(201).json(customer);
});

router.put("/customers/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [customer] = await db.update(customersTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(customersTable.id, id), eq(customersTable.tenantId, tenantId))).returning();
  if (!customer) { res.status(404).json({ error: "Not found" }); return; }
  res.json(customer);
});

router.delete("/customers/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(customersTable).where(and(eq(customersTable.id, id), eq(customersTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
