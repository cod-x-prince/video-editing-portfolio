import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, Sparkles, AlertCircle } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarMissing, setAvatarMissing] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey! I'm Parmbeer's **AI partner**. Ask me anything about his **video editing services**, **rates**, **delivery timelines**, or **pacing styles**! How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      // Small timeout to allow the transition animation to start before scrolling
      setTimeout(scrollToBottom, 100);
      setShowTooltip(false); // hide tooltip forever once opened
    }
  }, [isOpen, messages, isLoading]);

  const parseLinksAndEmails = (text: string) => {
    const regex = /([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}|https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);
    return parts.map((part, idx) => {
      // Check if it's an email
      if (part.includes("@") && part.match(/[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/)) {
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(part)}`;
        return (
          <a
            key={idx}
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-[#c4871f] hover:text-[#a36f18] transition-colors"
          >
            {part}
          </a>
        );
      }
      // Check if it's a link
      if (part.startsWith("http://") || part.startsWith("https://")) {
        return (
          <a
            key={idx}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold text-[#c4871f] hover:text-[#a36f18] transition-colors"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const parseMessage = (text: string) => {
    // Split by bold patterns first
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const cleanBoldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold text-[#18181b]">
            {parseLinksAndEmails(cleanBoldText)}
          </strong>
        );
      }
      return <React.Fragment key={index}>{parseLinksAndEmails(part)}</React.Fragment>;
    });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setHasError(false);

    const updatedMessages = [...messages, { role: "user", content: userMessage } as Message];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      let errorMsg = "Failed to get response";
      if (!response.ok) {
        try {
          const errData = await response.json();
          errorMsg = errData.error || errorMsg;
        } catch (_) {
          try {
            const txt = await response.text();
            if (txt) errorMsg = txt;
          } catch (_) {}
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Chatbot API Error:", errorMessage);
      setHasError(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting to my AI partner right now. Please feel free to reach out directly at parmbeeredits@gmail.com!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[99999] font-body">
      {/* Tooltip speech bubble invite message */}
      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ delay: 2.2, duration: 0.45 }} // show 2.2s after mount
            onClick={() => setIsOpen(true)}
            className="absolute right-18 bottom-1 w-52 rounded-xl border border-[#e4e2dc] bg-[#FAFAF8] p-3 text-xs text-[#3f3f46] shadow-lg cursor-pointer hover:border-[#c4871f] transition-all flex items-start gap-2 select-none"
          >
            <span className="flex-1 leading-normal font-medium">
              I'm here to help if you need anything!
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="text-[#a1a1aa] hover:text-[#18181b] p-0.5 rounded-full cursor-pointer transition-colors shrink-0"
            >
              <X size={12} />
            </button>
            {/* Small speech bubble tail */}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#FAFAF8]" />
            <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-[#e4e2dc] -z-10" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Bubble Button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle AI assistant chat"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#18181b] text-white shadow-xl hover:bg-[#3f3f46] transition-colors border border-white/10 cursor-pointer relative"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              {!avatarMissing ? (
                <img
                  src="/brand/ai-assistant.jpg"
                  alt="AI Assistant Avatar"
                  onError={() => setAvatarMissing(true)}
                  className="h-14 w-14 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#c4871f]">
                  <MessageSquare size={22} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulsing indicator when closed */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4871f] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#c4871f]"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            style={{ transformOrigin: "bottom right" }}
            className="absolute bottom-18 right-0 flex h-[460px] w-[340px] max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-[#e5dfd5] bg-[#FAFAF8]/96 backdrop-blur-lg shadow-[0_1px_3px_rgba(0,0,0,0.06),0_16px_40px_rgba(0,0,0,0.1)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e5dfd5] bg-[#f5f3ee] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {!avatarMissing ? (
                    <img
                      src="/brand/ai-assistant.jpg"
                      alt="AI Assistant"
                      onError={() => setAvatarMissing(true)}
                      className="h-10 w-10 rounded-full object-cover border border-[#e4e2dc]"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-[#c4871f] to-[#faeeda] text-[#18181b] font-bold border border-[#e4e2dc]">
                      AI
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div>
                  <h3 className="font-syne text-[0.82rem] font-bold text-[#18181b] leading-tight flex items-center gap-1.5">
                    Parmbeer's Partner <Sparkles size={11} className="text-[#c4871f]" />
                  </h3>
                  <span className="text-[9px] text-emerald-600 font-semibold tracking-[0.08em] uppercase">AI Assistant</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-[#71717a] hover:bg-[#FAFAF8] hover:text-[#18181b] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-xl px-3.5 py-2.5 text-[0.82rem] leading-[1.6] ${
                      msg.role === "user"
                        ? "bg-[#18181b] text-white rounded-br-sm"
                        : "bg-[#f5f3ee] text-[#3f3f46] rounded-bl-sm border border-[#e5dfd5]"
                    }`}
                  >
                    {parseMessage(msg.content)}
                  </div>
                </div>
              ))}

              {/* Thinking / Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl bg-[#f5f3ee] border border-[#e4e2dc] px-4 py-3 rounded-bl-none">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#71717a] [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#71717a] [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#71717a]" />
                  </div>
                </div>
              )}

              {/* Error indicator */}
              {hasError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>Failed to send. Click try again or email directly.</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="border-t border-[#e5dfd5] bg-[#f5f3ee] p-2.5 flex items-center gap-1.5"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me a question..."
                className="flex-1 rounded-lg border border-[#e5dfd5] bg-[#FAFAF8] px-3.5 py-2 text-[0.82rem] text-[#18181b] placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-[#c4871f]/50 focus:border-[#c4871f]/40"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all cursor-pointer ${
                  input.trim() && !isLoading
                    ? "bg-[#18181b] text-white hover:bg-[#3f3f46]"
                    : "bg-[#FAFAF8] text-[#a1a1aa] border border-[#e4e2dc] cursor-not-allowed"
                }`}
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
