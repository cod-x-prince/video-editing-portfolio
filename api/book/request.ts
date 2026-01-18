import { db } from "../utils/db";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, date, time, notes } = req.body;

    // Validation
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Basic date validation (simple check)
    const bookingDate = new Date(`${date}T${time}`);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({ error: "Invalid date or time" });
    }

    // Save to DB
    const booking = db.add({ name, email, date, time, notes });

    // TODO: Send email notification to owner (future step)

    return res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Booking request failed:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
