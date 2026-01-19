// File system writes are not supported in Vercel serverless functions (Read-only OS).
// We rely on Google Calendar and Email for data persistence.

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
  console.log("📩 Booking processed (Stateless):", booking);
  return booking;
}

// Local DB is disabled in production/serverless environment.
export const db = null;
