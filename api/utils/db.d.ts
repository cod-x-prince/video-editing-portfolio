export interface Booking {
  email: string;
  date: string;
  time: string;
  name?: string;
  notes?: string;
  calendarEventId?: string;
  status?: string;
}

export function saveBooking(booking: Booking): void;

export const db: {
  getAll(): Booking[];
  updateStatus(id: string, status: string): Booking | null;
};
