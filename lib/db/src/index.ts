import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Lazy initialization — module loads fine even without DATABASE_URL.
// The error surfaces on the first actual DB call, not at import time.
// This prevents Vercel serverless functions from crashing before handling any request.
let _pool: InstanceType<typeof Pool> | undefined;

function getPool(): InstanceType<typeof Pool> {
  if (!_pool) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL must be set. Add it to your environment variables (Vercel → Project → Settings → Environment Variables).",
      );
    }
    _pool = new Pool({ connectionString: url });
  }
  return _pool;
}

export const pool: InstanceType<typeof Pool> = new Proxy(
  {} as InstanceType<typeof Pool>,
  {
    get(_target, prop: string | symbol) {
      const p = getPool();
      const val = (p as Record<string | symbol, unknown>)[prop];
      return typeof val === "function" ? (val as Function).bind(p) : val;
    },
  },
);

export const db = drizzle(pool, { schema });

export * from "./schema";
