import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { membershipPlansTable, insertMembershipPlanSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/membership-plans", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const plans = await db
    .select()
    .from(membershipPlansTable)
    .where(eq(membershipPlansTable.tenantId, tenantId))
    .orderBy(desc(membershipPlansTable.createdAt));
  res.json(plans);
});

router.post("/membership-plans", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertMembershipPlanSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [plan] = await db.insert(membershipPlansTable).values(parsed.data).returning();
  res.status(201).json(plan);
});

router.put("/membership-plans/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [plan] = await db
    .update(membershipPlansTable)
    .set({ ...req.body, updatedAt: new Date() })
    .where(and(eq(membershipPlansTable.id, id), eq(membershipPlansTable.tenantId, tenantId)))
    .returning();
  if (!plan) { res.status(404).json({ error: "Not found" }); return; }
  res.json(plan);
});

router.delete("/membership-plans/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db
    .delete(membershipPlansTable)
    .where(and(eq(membershipPlansTable.id, id), eq(membershipPlansTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
