import { Router, type IRouter } from "express";
import { pool } from "@workspace/db";

const router: IRouter = Router();

router.get("/healthz", async (_req, res) => {
  const start = Date.now();
  let dbStatus: "ok" | "error" = "error";
  let dbLatencyMs: number | null = null;
  let dbError: string | null = null;
  let dbVersion: string | null = null;

  try {
    const client = await pool.connect();
    try {
      const result = await client.query<{ version: string }>("SELECT version() AS version");
      dbVersion = result.rows[0]?.version?.split(" ").slice(0, 2).join(" ") ?? null;
      dbStatus = "ok";
    } finally {
      client.release();
    }
  } catch (err) {
    dbError = err instanceof Error ? err.message : "unknown error";
  }

  dbLatencyMs = Date.now() - start;
  const overall = dbStatus === "ok" ? "ok" : "degraded";

  res.status(overall === "ok" ? 200 : 503).json({
    status: overall,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "unknown",
    services: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        version: dbVersion,
        error: dbError,
      },
    },
  });
});

export default router;
