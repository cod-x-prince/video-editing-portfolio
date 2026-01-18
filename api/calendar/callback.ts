// api/calendar/callback.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
    process.env;

  const code = req.query.code as string | undefined;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return res.status(500).send("OAuth env vars missing");
  }

  if (!code) {
    return res.status(400).send("Missing authorization code");
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI,
    );

    await oauth2Client.getToken(code);

    // 🔴 CRITICAL: DO NOT REDIRECT AFTER THIS
    res.status(200).send(`
      <html>
        <body style="background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;font-family:system-ui">
          <div style="text-align:center">
            <h1>✅ Google Calendar Connected</h1>
            <p>You can close this tab.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth failed");
  }
}
