import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "bookings.json");

/**
 * @param {Object} booking
 * @param {string} booking.email
 * @param {string} booking.date
 * @param {string} booking.time
 * @param {string} [booking.name]
 * @param {string} [booking.notes]
 * @param {string} [booking.calendarEventId]
 * @param {any} [booking.other]
 */
export function saveBooking(booking) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });

  let existing = [];
  if (fs.existsSync(DATA_PATH)) {
    existing = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  }

  existing.push({
    ...booking,
    createdAt: new Date().toISOString(),
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2));
}

export const db = {
  getAll: () => {
    if (fs.existsSync(DATA_PATH)) {
      return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    }
    return [];
  },
  updateStatus: (id, status) => {
    if (!fs.existsSync(DATA_PATH)) return null;
    const bookings = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
    // Match by id (if present) or fallback (this is simplified as logic wasn't fully defined)
    const index = bookings.findIndex((b) => b.id === id || b.email === id);
    if (index === -1) return null;

    bookings[index].status = status;
    bookings[index].updatedAt = new Date().toISOString();

    fs.writeFileSync(DATA_PATH, JSON.stringify(bookings, null, 2));
    return bookings[index];
  },
};
