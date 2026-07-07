import { useState, useRef, useEffect, useCallback } from "react";

// Monochrome, quiet-authority design matching the studio's visual language.
// Signature element: a live timecode readout in the header (HH:MM:SS:FF,
// 24fps) — a nod to the NLE/editing-bay identity rather than a generic
// "online" dot. Ticks while the panel is open, pauses when closed.
//
// Tokens (inline, no Tailwind dependency assumed — adjust to your
// existing design system / CSS vars if you have them):
const T = {
  bg: "#0A0A0A",
  surface: "#141414",
  border: "#242424",
  text: "#F5F4F0",
  muted: "#8A8A88",
  accent: "#E4402C", // used ONLY for the rec dot — spend boldness in one place
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

function useTimecode(running: boolean) {
  const [tc, setTc] = useState("00:00:00:00");
  const frame = useRef(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      frame.current += 1;
      const totalFrames = frame.current;
      const ff = totalFrames % 24;
      const totalSeconds = Math.floor(totalFrames / 24);
      const ss = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const mm = totalMinutes % 60;
      const hh = Math.floor(totalMinutes / 60);
      const pad = (n: number) => n.toString().padStart(2, "0");
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`);
    }, 1000 / 24);
    return () => clearInterval(id);
  }, [running]);

  return tc;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey — what are you working on? Happy to talk through the edit, or get you booked in.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timecode = useTimecode(open);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't reach the assistant.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: T.text,
          color: T.bg,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 60,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Chat with Parmbeer Edits"
          style={{
            position: "fixed",
            bottom: 88,
            right: 24,
            width: 360,
            maxWidth: "calc(100vw - 32px)",
            height: 480,
            maxHeight: "calc(100vh - 140px)",
            background: T.bg,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            zIndex: 60,
            fontFamily: "inherit",
            overflow: "hidden",
          }}
        >
          {/* Header — timecode as signature element */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 14px",
              borderBottom: `1px solid ${T.border}`,
              flexShrink: 0,
            }}
          >
            <div>
              <div style={{ color: T.text, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em" }}>
                PARMBEER EDITS
              </div>
              <div style={{ color: T.muted, fontSize: 10, letterSpacing: "0.08em" }}>ASSISTANT</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                fontSize: 11,
                color: T.muted,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: T.accent,
                  display: "inline-block",
                }}
              />
              {timecode}
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "14px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                {m.role === "assistant" && (
                  <span style={{ color: T.muted, fontSize: 10, letterSpacing: "0.06em", marginBottom: 2 }}>
                    ASSISTANT
                  </span>
                )}
                <div
                  style={{
                    alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "88%",
                    background: m.role === "user" ? T.surface : "transparent",
                    color: T.text,
                    padding: m.role === "user" ? "8px 12px" : "0",
                    borderRadius: m.role === "user" ? 6 : 0,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ color: T.muted, fontSize: 12, letterSpacing: "0.04em" }}>...</div>
            )}
            {error && (
              <div style={{ color: T.accent, fontSize: 12 }}>{error}</div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderTop: `1px solid ${T.border}`,
              flexShrink: 0,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about your project..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: T.text,
                fontSize: 13.5,
              }}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              style={{
                background: "none",
                border: "none",
                cursor: loading || !input.trim() ? "default" : "pointer",
                color: loading || !input.trim() ? T.border : T.text,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
