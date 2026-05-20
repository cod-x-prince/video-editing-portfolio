import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // If 404 it means we're on local dev without Vercel serverless
        if (response.status === 404) {
          throw new Error("Contact API is not available in local dev. Deploy to Vercel or use `npx vercel dev` to test.");
        }
        throw new Error("Failed to send message");
      }

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setErrorMessage(
        error instanceof Error && error.message.includes("local dev")
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const modal = document.getElementById("contact-modal");
        if (!modal) return;
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#18181b]/70"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            id="contact-modal"
            className="relative w-full max-w-md bg-[#FAFAF8] border border-[#e4e2dc] rounded-2xl p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#52525b] hover:text-[#18181b] transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold font-syne text-[#18181b] mb-2">
              Before we talk numbers...
            </h2>
            <p className="text-[#52525b] text-sm mb-6">
              Tell me what you're building.
            </p>

            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle size={48} className="mb-4 text-[#085041]" />
                <p className="font-bold text-lg text-[#18181b] mb-2">Conversation Started.</p>
                <p className="text-[#444441] text-sm mb-8 leading-relaxed">
                  I will review your project and email you back soon. Direct booking is temporarily paused on the public portfolio branch while scheduling protections are being rebuilt.
                </p>
                <p className="w-full rounded-lg border border-[#e4e2dc] bg-[#f5f3ee] px-4 py-3 text-sm text-[#52525b]">
                  Mention your preferred timeline in the message and I will follow up manually with next steps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div style={{ display: "none" }}>
                  <label htmlFor="_gotcha">
                    Don't fill this out if you're human:
                  </label>
                  <input type="text" name="_gotcha" id="_gotcha" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-widest">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] focus:outline-none focus:border-[#d97706] transition-all placeholder:text-[#a1a1aa]"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] focus:outline-none focus:border-[#d97706] transition-all placeholder:text-[#a1a1aa]"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="subject" className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-widest">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    required
                    className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] focus:outline-none focus:border-[#d97706] transition-all placeholder:text-[#a1a1aa]"
                    placeholder="What do you need help with?"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="message" className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-widest">
                    The Vision
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] focus:outline-none focus:border-[#d97706] transition-all placeholder:text-[#a1a1aa] resize-none"
                    placeholder="Tell me about your project and audience..."
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-[#a32d2d] text-sm bg-[#fcebeb] p-3 rounded-lg border border-[#fcebeb]">
                    <AlertCircle size={16} />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-[#18181b] text-white font-bold py-3 mt-2 rounded-lg hover:bg-[#3f3f46] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "submitting" ? (
                    "Sending..."
                  ) : (
                    "Start Conversation"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
