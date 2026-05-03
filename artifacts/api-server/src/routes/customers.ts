import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { customersTable, insertCustomerSchema } from "@workspace/db";
import { eq, and, ilike, or } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { z } from "zod";

const router: IRouter = Router();

router.get("/customers", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const { search } = req.query;
  let query = db.select().from(customersTable).where(eq(customersTable.tenantId, tenantId));
  if (search && typeof search === "string" && search.trim()) {
    const term = `%${search.trim()}%`;
    query = db.select().from(customersTable).where(
      and(
        eq(customersTable.tenantId, tenantId),
        or(
          ilike(customersTable.name, term),
          ilike(customersTable.email, term),
          ilike(customersTable.phone, term)
        )
      )
    ) as typeof query;
  }
  const customers = await query;
  res.json(customers);
});

router.get("/customers/export.csv", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const customers = await db.select().from(customersTable).where(eq(customersTable.tenantId, tenantId));
  const header = "id,name,email,phone,timeCredits,lastLogin,notes,createdAt";
  const rows = customers.map((c) => [
    c.id,
    `"${(c.name ?? "").replace(/"/g, '""')}"`,
    `"${(c.email ?? "").replace(/"/g, '""')}"`,
    `"${(c.phone ?? "").replace(/"/g, '""')}"`,
    c.timeCredits ?? 0,
    c.lastLogin ? c.lastLogin.toISOString() : "",
    `"${(c.notes ?? "").replace(/"/g, '""')}"`,
    c.createdAt.toISOString(),
  ].join(","));
  const csv = [header, ...rows].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=\"customers.csv\"");
  res.send(csv);
});

const bulkImportSchema = z.array(z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  timeCredits: z.coerce.number().int().min(0).optional(),
}));

router.post("/customers/bulk-import", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = bulkImportSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const rows = parsed.data.map((c) => ({ ...c, tenantId }));
  const inserted = await db.insert(customersTable).values(rows).onConflictDoNothing().returning();
  res.status(201).json({ imported: inserted.length, skipped: rows.length - inserted.length });
});

router.post("/customers", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const parsed = insertCustomerSchema.safeParse({ ...req.body, tenantId });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const [customer] = await db.insert(customersTable).values(parsed.data).returning();
  res.status(201).json(customer);
});

router.put("/customers/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [customer] = await db
    .update(customersTable)
    .set({ ...req.body, updatedAt: new Date() })
    .where(and(eq(customersTable.id, id), eq(customersTable.tenantId, tenantId)))
    .returning();
  if (!customer) { res.status(404).json({ error: "Not found" }); return; }
  res.json(customer);
});

router.delete("/customers/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(customersTable).where(and(eq(customersTable.id, id), eq(customersTable.tenantId, tenantId)));
  res.json({ ok: true });
});

export default router;
