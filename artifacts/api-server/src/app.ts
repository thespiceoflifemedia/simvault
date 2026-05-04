import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cookieParser from "cookie-parser";
import { pool } from "@workspace/db";
import router from "./routes";
import { logger } from "./lib/logger";

const PgStore = connectPgSimple(session);

const app: Express = express();

// Trust Vercel's (and any other) reverse proxy so:
// — req.ip is the real client IP
// — req.protocol is "https" (not "http" from the internal hop)
// — secure session cookies are set correctly on the client
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new PgStore({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    name: "simvault.sid",
    secret: process.env.SESSION_SECRET ?? "simvault-dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use("/api", router);

// Global error handler — catches DB connection failures and other unhandled errors.
// Returns a proper JSON 500 instead of crashing the process / returning no response.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  const isDatabaseError =
    message.includes("DATABASE_URL") ||
    message.includes("ECONNREFUSED") ||
    message.includes("connect ETIMEDOUT");

  logger.error({ err }, "Unhandled application error");

  res.status(503).json({
    error: isDatabaseError
      ? "Database not configured. Set DATABASE_URL in your environment variables."
      : "Internal server error",
  });
});

export default app;
