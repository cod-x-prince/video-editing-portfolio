// api/calendar/auth.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    return res.status(500).json({
      error: "Missing required Google OAuth environment variables",
    });
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    undefined,
    GOOGLE_REDIRECT_URI,
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    prompt: "consent",
  });

  return res.redirect(authUrl);
}
