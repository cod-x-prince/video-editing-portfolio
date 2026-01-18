import fs from "fs";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data/bookings.json");

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: string; // ISO Date string
  time: string;
  notes?: string;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
}

// Ensure DB file exists
if (!fs.existsSync(DB_PATH)) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

export const db = {
  getAll: (): Booking[] => {
    try {
      if (!fs.existsSync(DB_PATH)) return [];
      const data = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Database read error:", error);
      return [];
    }
  },

  add: (booking: Omit<Booking, "id" | "createdAt" | "status">): Booking => {
    const bookings = db.getAll();
    const newBooking: Booking = {
      ...booking,
      id: Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
      status: "PENDING",
    };
    bookings.push(newBooking);
    fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2));
    return newBooking;
  },

  updateStatus: (id: string, status: Booking["status"]): Booking | null => {
    const bookings = db.getAll();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;

    bookings[index].status = status;
    fs.writeFileSync(DB_PATH, JSON.stringify(bookings, null, 2));
    return bookings[index];
  },
};
