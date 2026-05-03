// Vercel serverless function entry point.
// Imports the self-contained Express app bundle produced by the api-server build.
const appModule = require("../artifacts/api-server/dist/app.cjs");
module.exports = appModule.default ?? appModule;
