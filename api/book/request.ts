import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import { saveBooking } from "../utils/db.js";

/**
 * POST /api/book/request
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, date, time, notes } = req.body || {};

    // 🔒 Validate input
    if (!name || !email || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("📩 Booking payload:", req.body);

    // 🕒 Convert date + time → ISO
    const startDateTime = new Date(`${date} ${time}`);
    if (isNaN(startDateTime.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format" });
    }

    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

    // 🔐 Google OAuth client
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const calendar = google.calendar({
      version: "v3",
      auth,
    });

    // 📅 Create calendar event
    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: {
        summary: `📞 Call with ${name}`,
        description: `Email: ${email}\n\nNotes:\n${notes || "—"}`,
        start: {
          dateTime: startDateTime.toISOString(),
        },
        end: {
          dateTime: endDateTime.toISOString(),
        },
      },
    });

    // 💾 Save booking locally (JSON)
    saveBooking({
      name,
      email,
      date,
      time,
      notes,
      calendarEventId: event.data.id,
    });

    return res.status(200).json({
      success: true,
      eventId: event.data.id,
    });
  } catch (err: any) {
    console.error("❌ Booking failed:", err?.response?.data || err.message);
    return res.status(500).json({
      error: "Failed to create booking",
    });
  }
}
