// api/calendar/callback.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const TOKEN_PATH = path.join(process.cwd(), "data", "calendar-token.json");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI) {
    return res.status(500).json({
      error: "Missing required Google OAuth environment variables",
    });
  }

  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).json({
      error: "Missing authorization code from Google",
    });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI,
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Ensure data directory exists
    fs.mkdirSync(path.dirname(TOKEN_PATH), { recursive: true });

    // Store tokens securely (server-side only)
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    return res.status(200).send(`
      <html>
        <head>
          <title>Calendar Connected</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont;
              background: #0a0a0a;
              color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .box {
              text-align: center;
              padding: 2rem;
              border-radius: 12px;
              background: #111;
              box-shadow: 0 0 40px rgba(0,0,0,.6);
            }
          </style>
        </head>
        <body>
          <div class="box">
            <h2>✅ Google Calendar Connected</h2>
            <p>You can safely close this tab.</p>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return res.status(500).json({
      error: "Failed to exchange authorization code for tokens",
    });
  }
}
