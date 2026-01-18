import React, { useState } from "react";
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

    try {
      const response = await fetch("/api/book/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold font-syne text-white mb-2">
              Book a Call
            </h2>
            <p className="text-neutral-400 text-sm mb-6">
              Select a time to discuss your project.
            </p>

            {status === "success" ? (
              <div className="text-center py-12 text-green-500">
                <CheckCircle size={48} className="mx-auto mb-4" />
                <p className="font-bold text-lg">Request Received!</p>
                <p className="text-neutral-400 text-sm mt-2">
                  I'll confirm with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase">
                      Name
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        name="date"
                        type="date"
                        required
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 appearance-none"
                      />
                      <Calendar
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-neutral-500 uppercase">
                      Time
                    </label>
                    <div className="relative">
                      <input
                        name="time"
                        type="time"
                        required
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 appearance-none"
                      />
                      <Clock
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-500 uppercase">
                    Topic / Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500"
                    placeholder="Briefly describe what you need..."
                  />
                </div>

                {status === "error" && (
                  <div className="text-red-500 text-sm flex gap-2 items-center">
                    <AlertCircle size={14} /> Request failed. Try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  {status === "submitting"
                    ? "Submitting..."
                    : "Request Booking"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
