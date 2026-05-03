import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, insertBookingSchema } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/bookings", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const bookings = await db.select().from(bookingsTable).where(eq(bookingsTable.tenantId, tenantId)).orderBy(desc(bookingsTable.startTime));
  res.json(bookings);
});

router.post("/bookings", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertBookingSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [booking] = await db.insert(bookingsTable).values(parsed.data).returning();
  res.status(201).json(booking);
});

router.put("/bookings/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [booking] = await db.update(bookingsTable).set({ ...req.body, updatedAt: new Date() }).where(and(eq(bookingsTable.id, id), eq(bookingsTable.tenantId, tenantId))).returning();
  if (!booking) { res.status(404).json({ error: "Not found" }); return; }
  res.json(booking);
});

router.delete("/bookings/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(bookingsTable).where(and(eq(bookingsTable.id, id), eq(bookingsTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
