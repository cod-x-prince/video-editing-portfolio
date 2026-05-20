// api/calendar/auth.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(503).json({
    error: "Calendar setup temporarily unavailable",
    message:
      "Google Calendar OAuth is disabled on the public portfolio branch while the scheduling flow is being hardened.",
  });
}
