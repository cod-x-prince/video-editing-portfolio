// api/chat.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const RATE_LIMIT_STORE = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_REQUESTS = 15; // 15 requests
const RATE_LIMIT_WINDOW_MS = 600000; // 10 minutes

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

const SYSTEM_PROMPT = `You are the premium virtual AI Assistant for Parmbeer (parmbeer.edits), a retention-led, conversion-focused short-form video editor for elite personal brands, founders, and content creators.

Your goal is to represent Parmbeer professionally, answer questions about his services, rates, delivery timelines, and pacing styles, and guide qualified leads toward initiating a project or booking a call.

Here is key information about Parmbeer and his work:
1. SERVICES:
   - High-retention short-form video editing (Reels, TikTok, Shorts).
   - Hook optimization (crafting attention-grabbing first 3 seconds).
   - Storytelling pacing & visual retention strategies (sound design, typography, selective visual highlights).
   - Video audits and content consulting.
2. TIMELINE:
   - Typical delivery time is 3 to 5 business days per edit.
3. NICHES & CLIENTS:
   - Finance, SaaS, personal development coaching, property, and creators.
   - Built 50+ edits with high audience retention rates.
4. PHILOSOPHY:
   - "Your viewers don't need to be entertained, they need to be convinced."
   - Edits are designed to feel premium and clean before they ever feel loud. Focuses on retention-led edits that drive revenue, not just empty views.
5. PRICING & GETTING STARTED:
   - Rates depend on the volume and specifics of the work, but clients can start with a quick fit-check by opening the "Start a Project" contact form or booking a direct call.
   - The user can click "Start a Project" to open the form.

CONSTRAINTS:
- Be concise, direct, helpful, and premium in your tone. Do not write extremely long paragraphs.
- Always remain in-character as Parmbeer's AI Assistant.
- If asked about specific contact details, mention the contact form on this website or email: parmbeeredits@gmail.com.
- Encourage users to book a call using the buttons on the screen or open the contact form if they want to collaborate.
- Do not make up facts or metrics that are not listed here.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: "Too many messages. Please wait a few minutes and try again." });
  }

  const body = req.body;
  if (!body || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: "Invalid body: messages array is required" });
  }

  const userMessages = body.messages;

  // Sanity check message history length to avoid huge payload injection
  if (userMessages.length > 30) {
    return res.status(400).json({ error: "Conversation history too long" });
  }

  const groqApiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  if (!groqApiKey) {
    console.error("Missing GROQ_API_KEY environment variable");
    return res.status(500).json({ 
      error: "Missing GROQ_API_KEY environment variable. Please set it in Vercel project settings.", 
      debug: { envKeys: Object.keys(process.env).filter(k => k.includes("GROQ") || k.includes("KEY")) }
    });
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...userMessages.map((msg: any) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: typeof msg.content === "string" ? msg.content.substring(0, 1000) : "",
      })),
    ];

    console.log("Sending request to Groq API using key prefix:", groqApiKey.substring(0, 6));
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        temperature: 0.5,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error response:", errorText);
      return res.status(502).json({ 
        error: `Bad gateway: failed to retrieve response from AI service. Status: ${response.status} ${response.statusText}`, 
        details: errorText 
      });
    }

    const data = await response.json();
    const assistantMessage = data?.choices?.[0]?.message?.content || "";

    return res.status(200).json({
      message: {
        role: "assistant",
        content: assistantMessage,
      },
    });
  } catch (error) {
    console.error("Chat completion handler error:", error);
    return res.status(500).json({ 
      error: "Internal server error: " + (error instanceof Error ? error.message : String(error)) 
    });
  }
}
