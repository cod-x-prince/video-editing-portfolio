import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * POST /api/book/request
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(503).json({
    error: "Booking temporarily unavailable",
    message:
      "Direct booking is disabled on the public portfolio branch while scheduling protections are being rebuilt.",
  });
}
