import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, customersTable, baysTable, membershipsTable } from "@workspace/db";
import { eq, and, gte, count } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/dashboard", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalCustomers] = await db.select({ count: count() }).from(customersTable).where(eq(customersTable.tenantId, tenantId));
  const [totalBays] = await db.select({ count: count() }).from(baysTable).where(eq(baysTable.tenantId, tenantId));
  const [activeMemberships] = await db.select({ count: count() }).from(membershipsTable).where(and(eq(membershipsTable.tenantId, tenantId), eq(membershipsTable.status, "active")));
  const [todayBookings] = await db.select({ count: count() }).from(bookingsTable).where(and(eq(bookingsTable.tenantId, tenantId), gte(bookingsTable.startTime, today)));

  res.json({
    totalCustomers: totalCustomers.count,
    totalBays: totalBays.count,
    activeMemberships: activeMemberships.count,
    todayBookings: todayBookings.count,
  });
});

export default router;
