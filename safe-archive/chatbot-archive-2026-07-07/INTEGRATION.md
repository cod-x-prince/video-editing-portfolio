# Chatbot integration — wiring notes

## Drop-in

Copy into matching paths in `video-editing-portfolio/`:
- `api/chat.ts`
- `lib/tools.ts`
- `lib/booking.ts`
- `data/persona.ts`
- `components/ChatWidget.tsx`

Mount in `App.tsx`:
```tsx
import ChatWidget from "./components/ChatWidget";
// ...inside your root render, alongside Navigation/Footer:
<ChatWidget />
```

## Env var

Set on your host (Vercel dashboard → Environment Variables, not `.env` committed to git):
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Dependency

`api/chat.ts` imports Vercel's request/response types:
```
npm install --save-dev @vercel/node
```
If you're not on Vercel, swap the handler signature for whatever your host's serverless function shape is (Netlify, Cloudflare Workers, etc. all differ slightly) — the tool-loop logic in the middle is host-agnostic.

## Things I assumed — verify before shipping

1. **`lib/booking.ts` field names.** I don't have `api/book/request.ts`'s actual body shape, so I guessed `{ name, email, projectType, preferredWindow, notes, source }`. Open that file and match the real field names, or the bot's bookings will fail silently against your validation.

2. **No live availability check exists yet.** Your `calendar/auth.ts`/`callback.ts` handle OAuth only — there's no endpoint to query free/busy slots. The bot currently asks for a preferred window in plain text and lets your existing manual review (`book/request.ts` → `review.ts`) confirm the actual slot, same as `BookingModal.tsx` today. If you want the bot to check real availability inline, that needs a new `api/calendar/availability.ts` endpoint — say the word and I'll build it.

3. **Persona placeholders.** `data/persona.ts` has `[PLACEHOLDER]` markers for services/turnaround/pricing copy — fill with real numbers or the bot will (correctly) refuse to state them and redirect to booking a call instead.

4. **Rate limiting is in-memory**, scoped to a single serverless instance — fine as a first line of defense, not bulletproof under real load. Upgrade to Vercel KV or similar if abuse becomes a problem.

5. **Streaming not implemented.** Current version waits for the full reply (including any tool round-trip) before responding — simpler and more robust for a multi-step tool loop. Can add SSE streaming later if the wait feels slow in practice.
