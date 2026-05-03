import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable, customersTable, baysTable, membershipsTable } from "@workspace/db";
import { eq, and, gte, count, sql } from "drizzle-orm";
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

  const rangeStart = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const customerRows = await db.execute(sql`
    SELECT
      EXTRACT(YEAR FROM created_at)::int  AS year,
      EXTRACT(MONTH FROM created_at)::int AS month,
      COUNT(*)::int                        AS cnt
    FROM customers
    WHERE tenant_id = ${tenantId}
      AND created_at >= ${rangeStart}
    GROUP BY year, month
  `);

  const bookingRows = await db.execute(sql`
    SELECT
      EXTRACT(YEAR FROM start_time)::int  AS year,
      EXTRACT(MONTH FROM start_time)::int AS month,
      COUNT(*)::int                        AS cnt,
      COALESCE(SUM(
        CASE
          WHEN total_price ~ '^[0-9]+(\\.[0-9]+)?$'
          THEN total_price::numeric
          ELSE 0
        END
      ), 0)::float AS revenue
    FROM bookings
    WHERE tenant_id = ${tenantId}
      AND status != 'cancelled'
      AND start_time >= ${rangeStart}
    GROUP BY year, month
  `);

  type MonthPoint = { year: number; month: number; label: string };
  const months: MonthPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    });
  }

  type CustomerRow = { year: number; month: number; cnt: number };
  type BookingRow  = { year: number; month: number; cnt: number; revenue: number };

  const customerMap = new Map(
    (customerRows.rows as CustomerRow[]).map((r) => [`${r.year}-${r.month}`, r.cnt])
  );
  const bookingMap = new Map(
    (bookingRows.rows as BookingRow[]).map((r) => [`${r.year}-${r.month}`, r])
  );

  const charts = {
    customers: months.map((m) => ({
      label: m.label,
      count: customerMap.get(`${m.year}-${m.month}`) ?? 0,
    })),
    bookings: months.map((m) => ({
      label: m.label,
      count: bookingMap.get(`${m.year}-${m.month}`)?.cnt ?? 0,
    })),
    revenue: months.map((m) => ({
      label: m.label,
      revenue: bookingMap.get(`${m.year}-${m.month}`)?.revenue ?? 0,
    })),
  };

  res.json({
    totalCustomers: totalCustomers.count,
    totalBays: totalBays.count,
    activeMemberships: activeMemberships.count,
    todayBookings: todayBookings.count,
    charts,
  });
});

export default router;
