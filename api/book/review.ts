import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.status(410).json({
    error: "Gone",
    message:
      "Booking review API is disabled in the current stateless deployment. Implement persistent storage (e.g. Postgres/Supabase) before enabling admin review endpoints.",
  });
}
