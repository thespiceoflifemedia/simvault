import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { passesTable, insertPassSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/passes", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const passes = await db.select().from(passesTable).where(eq(passesTable.tenantId, tenantId)).orderBy(desc(passesTable.createdAt));
  res.json(passes);
});

router.post("/passes", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertPassSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [pass] = await db.insert(passesTable).values(parsed.data).returning();
  res.status(201).json(pass);
});

router.put("/passes/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [pass] = await db.update(passesTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(passesTable.id, id), eq(passesTable.tenantId, tenantId))).returning();
  if (!pass) { res.status(404).json({ error: "Not found" }); return; }
  res.json(pass);
});

router.delete("/passes/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(passesTable).where(and(eq(passesTable.id, id), eq(passesTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
