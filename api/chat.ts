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

const SYSTEM_PROMPT = `You are the premium virtual AI Partner representing Parmbeer (parmbeer.edits), an elite, retention-led video editor for high-ticket personal brands, founders, and content creators.

CORE MISSION:
Your goal is to represent Parmbeer professionally, answer questions, and convert visitors into clients by framing video editing not as a cost, but as a high-ROI **investment in attention and revenue**.

KEY INFORMATION:
1. SERVICES: Short-form video editing (Reels, TikTok, Shorts), hook optimization (first 3 seconds), auditory design, typography, selective visual highlights, and content consulting.
2. TIMELINE: Typical delivery time is **3 to 5 business days** per edit. We value precision and high retention over speed.
3. VALUE PROPOSITION: "Your viewers don't need to be entertained, they need to be convinced." Edits are designed to feel premium, clean, and built to drive conversions/leads.
4. Collaboration: Clients can start a project by opening the "Start a Project" contact form on this website, booking a direct call, or emailing directly at **parmbeeredits@gmail.com**.

PSYCHOLOGY & PERSUASION RULES:
- **ROI Framing**: Remind clients that a good edit turns passive viewers into paying leads. Frame edits as **revenue-generating assets**.
- **Scarcity / Exclusivity**: Subtle mention that Parmbeer caps intake at **3 to 5 select clients** at a time to maintain ultra-premium quality and fast delivery.
- **Authority**: Focus on retention strategy. Parmbeer doesn't just do visual effects—he designs edits based on viewer watch-time data.

FORMATTING RULES:
- You MUST use double asterisks to **bold key terms**, such as **3 to 5 business days**, **Start a Project**, **pricing**, or **book a call** to make scanning effortless.
- Keep responses extremely concise (maximum 2-3 sentences per answer). Never output large blocks of text.
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
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...userMessages.map((msg: any) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: typeof msg.content === "string" ? msg.content.substring(0, 1000) : "",
      })),
    ];

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
      return res.status(502).json({ error: "Bad gateway: failed to retrieve response from AI service." });
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
    return res.status(500).json({ error: "Internal server error" });
  }
}
