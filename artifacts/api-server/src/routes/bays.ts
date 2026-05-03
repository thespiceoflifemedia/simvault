import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { baysTable, insertBaySchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/bays", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const bays = await db.select().from(baysTable).where(eq(baysTable.tenantId, tenantId));
  res.json(bays);
});

router.post("/bays", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertBaySchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [bay] = await db.insert(baysTable).values(parsed.data).returning();
  res.status(201).json(bay);
});

router.put("/bays/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [bay] = await db.update(baysTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(baysTable.id, id), eq(baysTable.tenantId, tenantId))).returning();
  if (!bay) { res.status(404).json({ error: "Not found" }); return; }
  res.json(bay);
});

router.delete("/bays/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(baysTable).where(and(eq(baysTable.id, id), eq(baysTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
