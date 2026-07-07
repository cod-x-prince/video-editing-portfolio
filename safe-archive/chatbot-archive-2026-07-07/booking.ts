// Bridges the chatbot tool call to your EXISTING booking endpoint
// (api/book/request.ts). Deliberately does not reimplement booking
// logic — I don't have that file's contents, so duplicating it here
// would drift out of sync with your review.ts flow. This just calls it.

interface BookingRequestInput {
  name: string;
  email: string;
  project_type: string;
  preferred_window: string;
  notes?: string;
}

interface BookingResult {
  ok: boolean;
  message: string;
}

/**
 * Forwards a booking request to your existing /api/book/request endpoint.
 *
 * IMPORTANT: check the actual field names your book/request.ts expects
 * and adjust the `body` mapping below to match — this assumes a
 * reasonably standard shape (name/email/projectType/etc). If your
 * BookingModal.tsx sends different field names, mirror those here so
 * both paths produce identical bookings.json entries.
 */
export async function submitBookingRequest(
  input: BookingRequestInput,
  requestOrigin: string
): Promise<BookingResult> {
  try {
    const res = await fetch(`${requestOrigin}/api/book/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        projectType: input.project_type,
        preferredWindow: input.preferred_window,
        notes: input.notes ?? "",
        source: "chatbot", // tag so you can tell bot-originated requests apart in bookings.json
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        message: `Booking endpoint returned ${res.status}. ${text}`.trim(),
      };
    }

    return { ok: true, message: "Booking request submitted for review." };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Unknown error submitting booking.",
    };
  }
}
