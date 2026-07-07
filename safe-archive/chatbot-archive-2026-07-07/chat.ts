// POST /api/chat
// Body: { messages: { role: "user" | "assistant"; content: string }[] }
// Returns: { reply: string }
//
// Vercel serverless function (Node runtime). ANTHROPIC_API_KEY must be
// set as a server-side env var — never exposed to the client.

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { TOOLS } from "../lib/tools";
import { submitBookingRequest } from "../lib/booking";
import { SYSTEM_PROMPT } from "../data/persona";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";
const MAX_TOOL_ROUNDS = 4; // hard cap so a stuck loop can't run forever

// --- very basic in-memory rate limit (per serverless instance) ---
// Good enough to blunt casual abuse. For real protection, use Vercel's
// edge config / KV or a proper rate-limit service.
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 min per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  requestLog.set(ip, hits);
  return hits.length > RATE_LIMIT;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
    req.socket.remoteAddress ??
    "unknown";

  if (isRateLimited(ip)) {
    res.status(429).json({ error: "Too many requests. Try again shortly." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured: missing ANTHROPIC_API_KEY." });
    return;
  }

  const { messages } = req.body as { messages?: ChatMessage[] };
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array required" });
    return;
  }

  // cap history sent to the model — keep last ~12 turns
  const trimmed = messages.slice(-12);

  const proto = (req.headers["x-forwarded-proto"] as string) ?? "https";
  const host = req.headers.host;
  const origin = `${proto}://${host}`;

  try {
    // conversation array Claude will append tool_use / tool_result to
    let convo: any[] = trimmed.map((m) => ({ role: m.role, content: m.content }));

    let finalText = "";

    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const apiRes = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          tools: TOOLS,
          messages: convo,
        }),
      });

      if (!apiRes.ok) {
        const errText = await apiRes.text().catch(() => "");
        res.status(502).json({ error: `Claude API error: ${apiRes.status} ${errText}` });
        return;
      }

      const data = await apiRes.json();
      const blocks: any[] = data.content ?? [];

      const toolUseBlocks = blocks.filter((b) => b.type === "tool_use");
      const textBlocks = blocks.filter((b) => b.type === "text");
      finalText = textBlocks.map((b) => b.text).join("\n").trim();

      if (toolUseBlocks.length === 0) {
        // no tool calls this round — model is done, return its text
        break;
      }

      // append assistant turn (with tool_use blocks) to convo
      convo.push({ role: "assistant", content: blocks });

      // execute each requested tool, build tool_result blocks
      const toolResults = [];
      for (const call of toolUseBlocks) {
        let resultText: string;

        if (call.name === "create_booking_request") {
          const result = await submitBookingRequest(call.input, origin);
          resultText = result.message;
        } else {
          resultText = `Unknown tool: ${call.name}`;
        }

        toolResults.push({
          type: "tool_result",
          tool_use_id: call.id,
          content: resultText,
        });
      }

      convo.push({ role: "user", content: toolResults });
      // loop continues so Claude can respond to the tool result
    }

    res.status(200).json({ reply: finalText || "Sorry, something went wrong. Try again?" });
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "Unknown server error",
    });
  }
}
