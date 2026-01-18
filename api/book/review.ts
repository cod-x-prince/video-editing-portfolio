import { db } from "../utils/db";
import { calendar } from "../utils/calendar";

export default async function handler(req: any, res: any) {
  // Simple "Admin Token" auth (query param or header)
  const token = req.query.token || req.headers["x-admin-token"];
  const ADMIN_SECRET = process.env.ADMIN_TOKEN || "secret123"; // Logic for fallback/env

  if (token !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // GET: List all bookings
  if (req.method === "GET") {
    const bookings = db.getAll();
    return res.status(200).json({ bookings });
  }

  // POST: Approve or Decline
  if (req.method === "POST") {
    const { id, action } = req.body;

    if (!id || !["approve", "decline"].includes(action)) {
      return res.status(400).json({ error: "Invalid action" });
    }

    const booking = db.updateStatus(
      id,
      action === "approve" ? "APPROVED" : "DECLINED",
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (action === "approve") {
      // Create Google Calendar Event
      await calendar.createEvent(booking);
    }

    return res.status(200).json({ success: true, booking });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
