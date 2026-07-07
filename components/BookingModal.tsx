import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const dateStr = data.date as string;
    const timeStr = data.time as string;
    const localDateTime = new Date(`${dateStr}T${timeStr}`);
    const utcDateTime = localDateTime.toISOString();

    const payload = {
      name: data.name,
      email: data.email,
      utcDateTime,
      notes: data.notes
    };

    try {
      const response = await fetch("/api/book/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to book");

      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 3000);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const minBookingDate = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const modal = document.getElementById("booking-modal");
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
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#18181b]/70"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            id="booking-modal"
            className="relative w-full max-w-md bg-[#FAFAF8] border border-[#e4e2dc] rounded-2xl p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close booking form"
              className="absolute top-6 right-6 text-[#52525b] hover:text-[#18181b] transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold font-syne text-[#18181b] mb-2">
              Claim a Spot
            </h2>
            <p className="text-[#52525b] text-sm mb-6">
              Skip the line and schedule a direct consultation.
            </p>

            {status === "success" ? (
              <div className="text-center py-12 text-[#085041]">
                <CheckCircle size={48} className="mx-auto mb-4" />
                <p className="font-bold text-lg text-[#18181b]">Booking Requested</p>
                <p className="text-[#444441] text-sm mt-2">
                  I will confirm your slot shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-widest">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      required
                      className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#d97706] transition-colors"
                      placeholder="Your Name"
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
                      className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#d97706] transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="date" className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-widest">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        id="date"
                        name="date"
                        type="date"
                        min={minBookingDate}
                        required
                        className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] focus:outline-none focus:border-[#d97706] appearance-none"
                      />
                      <Calendar
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="time" className="text-[10px] font-medium text-[#a1a1aa] uppercase tracking-widest">
                      Time
                    </label>
                    <div className="relative">
                      <input
                        id="time"
                        name="time"
                        type="time"
                        required
                        className="w-full bg-[#f5f3ee] border border-[#e4e2dc] rounded-lg px-4 py-2 text-[#18181b] focus:outline-none focus:border-[#d97706] appearance-none"
                      />
                      <Clock
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-[#a32d2d] text-sm bg-[#fcebeb] p-3 rounded-lg border border-[#fcebeb]">
                    <AlertCircle size={14} /> Request failed. Try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-[#18181b] text-white font-bold py-3 mt-4 rounded-lg hover:bg-[#3f3f46] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "submitting"
                    ? "Submitting..."
                    : "Secure Slot"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
