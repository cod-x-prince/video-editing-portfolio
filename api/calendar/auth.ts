// api/calendar/auth.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return res.status(500).json({ error: "Missing OAuth env vars" });
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    undefined,
    GOOGLE_REDIRECT_URI,
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar"],
  });

  // ONE redirect only
  res.writeHead(307, { Location: url });
  res.end();
}
