// Vercel serverless function entry point.
// Imports the self-contained Express app bundle produced by the api-server build.
let handler;
try {
  const appModule = require("../artifacts/api-server/dist/app.cjs");
  handler = appModule.default ?? appModule;
} catch (err) {
  // If the bundle fails to load (e.g. missing build artifact or missing DATABASE_URL),
  // return a clear 503 instead of crashing silently and causing Vercel to fall through
  // to the static file catch-all (which returns index.html for GET and 405 for POST).
  handler = (_req, res) => {
    res.status(503).json({
      error: "API server failed to initialize.",
      detail: err instanceof Error ? err.message : String(err),
      hint: "Ensure DATABASE_URL and SESSION_SECRET are set in Vercel → Project → Settings → Environment Variables, then redeploy.",
    });
  };
}

module.exports = handler;
