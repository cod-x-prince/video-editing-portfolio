export interface Booking {
  email: string;
  utcDateTime: string;
  name?: string;
  notes?: string;
  calendarEventId?: string;
  [key: string]: unknown;
}

export function saveBooking(booking: Booking): Booking;
export const db: null;
