import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { posOrdersTable, insertPosOrderSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/pos-orders", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const orders = await db.select().from(posOrdersTable).where(eq(posOrdersTable.tenantId, tenantId)).orderBy(desc(posOrdersTable.createdAt));
  res.json(orders);
});

router.post("/pos-orders", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertPosOrderSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [order] = await db.insert(posOrdersTable).values(parsed.data).returning();
  res.status(201).json(order);
});

router.put("/pos-orders/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [order] = await db.update(posOrdersTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(posOrdersTable.id, id), eq(posOrdersTable.tenantId, tenantId))).returning();
  if (!order) { res.status(404).json({ error: "Not found" }); return; }
  res.json(order);
});

router.delete("/pos-orders/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(posOrdersTable).where(and(eq(posOrdersTable.id, id), eq(posOrdersTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
