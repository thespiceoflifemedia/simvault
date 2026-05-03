import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { membershipsTable, insertMembershipSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/memberships", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const memberships = await db.select().from(membershipsTable).where(eq(membershipsTable.tenantId, tenantId));
  res.json(memberships);
});

router.post("/memberships", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertMembershipSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [membership] = await db.insert(membershipsTable).values(parsed.data).returning();
  res.status(201).json(membership);
});

router.put("/memberships/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [membership] = await db.update(membershipsTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(membershipsTable.id, id), eq(membershipsTable.tenantId, tenantId))).returning();
  if (!membership) { res.status(404).json({ error: "Not found" }); return; }
  res.json(membership);
});

router.delete("/memberships/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(membershipsTable).where(and(eq(membershipsTable.id, id), eq(membershipsTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
