import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { loyaltyPointsTable, insertLoyaltyPointSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/loyalty-points", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const points = await db.select().from(loyaltyPointsTable).where(eq(loyaltyPointsTable.tenantId, tenantId)).orderBy(desc(loyaltyPointsTable.pointsBalance));
  res.json(points);
});

router.post("/loyalty-points", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertLoyaltyPointSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [point] = await db.insert(loyaltyPointsTable).values(parsed.data).returning();
  res.status(201).json(point);
});

router.put("/loyalty-points/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [point] = await db.update(loyaltyPointsTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(loyaltyPointsTable.id, id), eq(loyaltyPointsTable.tenantId, tenantId))).returning();
  if (!point) { res.status(404).json({ error: "Not found" }); return; }
  res.json(point);
});

router.delete("/loyalty-points/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(loyaltyPointsTable).where(and(eq(loyaltyPointsTable.id, id), eq(loyaltyPointsTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
