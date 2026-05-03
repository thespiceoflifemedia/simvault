import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { formsTable, formSubmissionsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/forms", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const forms = await db.select().from(formsTable).where(eq(formsTable.tenantId, tenantId));
  res.json(forms);
});

router.post("/forms", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const { name, description, type, active, questions, linkedTo } = req.body;
  if (!name?.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }
  const [form] = await db.insert(formsTable).values({
    tenantId,
    name,
    description: description || "",
    type: type || "intake",
    active: active !== false,
    questions: questions || [],
    linkedTo: linkedTo || null,
  }).returning();
  res.status(201).json(form);
});

router.put("/forms/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const [form] = await db.update(formsTable)
    .set({ ...req.body, updatedAt: new Date() })
    .where(and(eq(formsTable.id, id), eq(formsTable.tenantId, tenantId)))
    .returning();
  if (!form) { res.status(404).json({ error: "Not found" }); return; }
  res.json(form);
});

router.delete("/forms/:id", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  await db.delete(formsTable).where(and(eq(formsTable.id, id), eq(formsTable.tenantId, tenantId)));
  res.json({ ok: true });
});

router.get("/forms/:id/submissions", requireAuth, async (req, res) => {
  const tenantId = req.session.tenantId!;
  const id = Number(req.params.id);
  const submissions = await db.select().from(formSubmissionsTable)
    .where(and(eq(formSubmissionsTable.formId, id), eq(formSubmissionsTable.tenantId, tenantId)));
  res.json(submissions);
});

export default router;
