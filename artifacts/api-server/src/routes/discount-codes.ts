import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { discountCodesTable, insertDiscountCodeSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/discount-codes", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const codes = await db.select().from(discountCodesTable).where(eq(discountCodesTable.tenantId, tenantId)).orderBy(desc(discountCodesTable.createdAt));
  res.json(codes);
});

router.post("/discount-codes", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertDiscountCodeSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [code] = await db.insert(discountCodesTable).values(parsed.data).returning();
  res.status(201).json(code);
});

router.put("/discount-codes/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [code] = await db.update(discountCodesTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(discountCodesTable.id, id), eq(discountCodesTable.tenantId, tenantId))).returning();
  if (!code) { res.status(404).json({ error: "Not found" }); return; }
  res.json(code);
});

router.delete("/discount-codes/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(discountCodesTable).where(and(eq(discountCodesTable.id, id), eq(discountCodesTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
