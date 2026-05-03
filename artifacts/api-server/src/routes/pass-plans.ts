import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { passPlansTable, insertPassPlanSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/pass-plans", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const plans = await db
    .select()
    .from(passPlansTable)
    .where(eq(passPlansTable.tenantId, tenantId))
    .orderBy(desc(passPlansTable.createdAt));
  res.json(plans);
});

router.post("/pass-plans", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertPassPlanSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [plan] = await db.insert(passPlansTable).values(parsed.data).returning();
  res.status(201).json(plan);
});

router.put("/pass-plans/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [plan] = await db
    .update(passPlansTable)
    .set({ ...req.body, updatedAt: new Date() })
    .where(and(eq(passPlansTable.id, id), eq(passPlansTable.tenantId, tenantId)))
    .returning();
  if (!plan) { res.status(404).json({ error: "Not found" }); return; }
  res.json(plan);
});

router.delete("/pass-plans/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db
    .delete(passPlansTable)
    .where(and(eq(passPlansTable.id, id), eq(passPlansTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
