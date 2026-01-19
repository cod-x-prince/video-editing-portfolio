import { db } from "../utils/db.js";
import { calendar } from "../utils/calendar.js";

export default async function handler(req: any, res: any) {
  // Simple "Admin Token" auth (query param or header)
  const token = req.query.token || req.headers["x-admin-token"];
  const ADMIN_SECRET = process.env.ADMIN_TOKEN || "secret123"; // Logic for fallback/env

  if (token !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // With strict serverless/Vercel deployment, local file-based DB is disabled.
  // Bookings are now sent directly via Email/Calendar (Stateless).
  // This endpoint is deprecated for now unless a real DB (Postgres/Supabase) is added.

  return res.status(501).json({
    error: "Not Implemented",
    message:
      "Local database storage is disabled in serverless environment. Check Google Calendar for bookings.",
  });
}
