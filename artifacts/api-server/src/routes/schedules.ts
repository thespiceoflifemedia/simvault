import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { schedulesTable, insertScheduleSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/schedules", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const schedules = await db.select().from(schedulesTable).where(eq(schedulesTable.tenantId, tenantId)).orderBy(desc(schedulesTable.dayOfWeek));
  res.json(schedules);
});

router.post("/schedules", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertScheduleSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [schedule] = await db.insert(schedulesTable).values(parsed.data).returning();
  res.status(201).json(schedule);
});

router.put("/schedules/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [schedule] = await db.update(schedulesTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(schedulesTable.id, id), eq(schedulesTable.tenantId, tenantId))).returning();
  if (!schedule) { res.status(404).json({ error: "Not found" }); return; }
  res.json(schedule);
});

router.delete("/schedules/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(schedulesTable).where(and(eq(schedulesTable.id, id), eq(schedulesTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
