// api/contact.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_API_KEY);

/**
 * Helper: read raw body if req.body is empty.
 */
async function readRawBody(req: VercelRequest) {
  return await new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: any) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("=== /api/contact handler ===");
  console.log("Method:", req.method);
  console.log("Headers:", {
    "content-type": req.headers["content-type"],
    "content-length": req.headers["content-length"],
  });

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Try to get parsed body, but if it's empty, read raw body and attempt parse
  let body = req.body;
  if (!body || Object.keys(body).length === 0) {
    try {
      const raw = await readRawBody(req);
      console.log("Raw body (fallback):", raw ? "[present]" : "[empty]");
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch (parseErr) {
          console.error("JSON parse error for raw body:", parseErr);
          return res.status(400).json({ error: "Invalid JSON body" });
        }
      }
    } catch (e) {
      console.error("Error reading raw body:", e);
      return res.status(500).json({ error: "Could not read request body" });
    }
  }

  // Log the parsed body shape (not values)
  const providedKeys =
    body && typeof body === "object" ? Object.keys(body) : [];
  console.log("Provided body keys:", providedKeys);

  const fromEmail = body?.fromEmail || body?.email;
  const subject = body?.subject;
  const message = body?.message;

  const missing: string[] = [];
  if (!fromEmail) missing.push("fromEmail");
  if (!subject) missing.push("subject");
  if (!message) missing.push("message");

  if (missing.length > 0) {
    console.warn("Missing fields:", missing);
    return res.status(400).json({
      error: "Missing required fields",
      missing,
    });
  }

  // Basic env checks
  if (!process.env.EMAIL_API_KEY || !process.env.OWNER_EMAIL) {
    console.error("Missing server env for email.");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Send via Resend
  try {
    console.log(
      `Sending email to OWNER_EMAIL (not logged) with reply-to ${fromEmail}`,
    );
    const response = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.OWNER_EMAIL as string,
      replyTo: fromEmail,
      subject: `Portfolio Inquiry: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.4">
          <h3>New Contact</h3>
          <p><strong>From:</strong> ${fromEmail}</p>
          <p><strong>Message:</strong></p>
          <pre>${String(message).replace(/</g, "&lt;")}</pre>
        </div>
      `,
    });

    console.log("Resend response id:", (response as any)?.id || "[no id]");
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Resend send error:", err);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
