import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, XCircle, Clock, Calendar, RefreshCcw } from "lucide-react";

interface Booking {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  notes?: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/book/review?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "approve" | "decline") => {
    try {
      const res = await fetch("/api/book/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, token }), // Should pass token in header or body for write ops too
      });
      if (res.ok) {
        // Optimistic update
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id
              ? { ...b, status: action === "approve" ? "APPROVED" : "DECLINED" }
              : b,
          ),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBookings();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
              <h2 className="text-2xl font-bold text-white font-syne">
                Admin Dashboard
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={fetchBookings}
                  className="text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-800"
                >
                  <RefreshCcw
                    size={20}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white transition-colors p-2 rounded-full hover:bg-neutral-800"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {bookings.length === 0 && !loading && (
                <div className="text-center text-neutral-500 py-20">
                  No bookings found.
                </div>
              )}

              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-neutral-800/50 border border-neutral-800 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 items-start md:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-2 h-2 rounded-full ${booking.status === "APPROVED" ? "bg-green-500" : booking.status === "DECLINED" ? "bg-red-500" : "bg-yellow-500"}`}
                      />
                      <span className="font-bold text-white">
                        {booking.name}
                      </span>
                      <span className="text-neutral-400 text-sm">
                        ({booking.email})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-neutral-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {booking.time}
                      </span>
                    </div>
                    {booking.notes && (
                      <div className="mt-2 text-sm text-neutral-300 bg-neutral-900/50 p-2 rounded border border-neutral-800/50">
                        "{booking.notes}"
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {booking.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleAction(booking.id, "approve")}
                          className="flex items-center gap-1 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg font-medium transition-colors"
                        >
                          <Check size={16} /> Approve
                        </button>
                        <button
                          onClick={() => handleAction(booking.id, "decline")}
                          className="flex items-center gap-1 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-medium transition-colors"
                        >
                          <XCircle size={16} /> Decline
                        </button>
                      </>
                    )}
                    {booking.status !== "PENDING" && (
                      <span className="px-4 py-2 text-neutral-500 font-medium border border-neutral-800 rounded-lg bg-neutral-900/50">
                        {booking.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
