import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default function handler(req: VercelRequest, res: VercelResponse) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/api/calendar/callback",
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    prompt: "consent",
  });

  res.redirect(authUrl);
}
