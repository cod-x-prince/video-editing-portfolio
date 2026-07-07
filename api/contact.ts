// api/contact.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.EMAIL_API_KEY);
const MAX_MESSAGE_LENGTH = 5000;
const MAX_SUBJECT_LENGTH = 200;
const RATE_LIMIT_STORE = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 3600000; // 1 hour

async function readRawBody(req: VercelRequest) {
  return await new Promise<string>((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: any) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length < 255;
}

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_STORE.get(clientIp);

  if (!record || now > record.reset) {
    RATE_LIMIT_STORE.set(clientIp, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  let body = req.body;
  if (!body || Object.keys(body).length === 0) {
    try {
      const raw = await readRawBody(req);
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch (parseErr) {
          return res.status(400).json({ error: "Invalid JSON body" });
        }
      }
    } catch {
      return res.status(400).json({ error: "Could not read request body" });
    }
  }

  if (!body || typeof body !== "object") {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // Honeypot field from frontend; silently accept bot submissions without sending.
  if (typeof body._gotcha === "string" && body._gotcha.trim().length > 0) {
    return res.status(200).json({ success: true });
  }

  const fromEmailRaw = body.fromEmail || body.email;
  const messageRaw = body.message;
  const subjectRaw = body.subject || "General Inquiry";

  const fromEmail = typeof fromEmailRaw === "string" ? fromEmailRaw.trim() : "";
  const message = typeof messageRaw === "string" ? messageRaw.trim() : "";
  const subject = typeof subjectRaw === "string" ? subjectRaw.trim() : "";

  const missing: string[] = [];
  if (!fromEmail) missing.push("email");
  if (!message) missing.push("message");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing,
    });
  }

  // Validate input lengths
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters)`,
    });
  }

  if (subject.length > MAX_SUBJECT_LENGTH) {
    return res.status(400).json({
      error: `Subject is too long (max ${MAX_SUBJECT_LENGTH} characters)`,
    });
  }

  // Validate email format
  if (!validateEmail(fromEmail)) {
    return res.status(400).json({
      error: "Invalid email format",
    });
  }

  // Basic env checks
  if (!process.env.EMAIL_API_KEY || !process.env.OWNER_EMAIL) {
    console.error("Missing EMAIL_API_KEY or OWNER_EMAIL environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Send via Resend
  try {
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.OWNER_EMAIL as string,
      replyTo: fromEmail,
      subject: `[Addictive Edits] New Project Inquiry: ${escapeHtml(subject)}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
          <h2 style="color: #000;">New Project Inquiry</h2>
          <hr style="border: 0; border-top: 1px solid #ccc;" />
          <p><strong>Name/Email:</strong> ${escapeHtml(fromEmail)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #eee;">
            ${escapeHtml(message).replace(/\n/g, "<br/>")}
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">
            Sent from Addictive Edits Portfolio at ${new Date().toISOString()}
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}

