# Copilot Instructions for `video-editing-portfolio`

## Build, test, and lint commands

This repo uses npm scripts from `package.json` and CI (`.github/workflows/ci.yml`) on Node 18.

| Task | Command | Notes |
| --- | --- | --- |
| Install deps | `npm ci` | Matches CI setup. |
| Run dev server | `npm run dev` | Vite dev server on port 3000 (`vite.config.ts`). |
| Production build | `npm run build` | Vite production build. |
| Preview build | `npm run preview` | Serves built output. |
| Analysis gate (types + security + audit) | `npm run analyze` | Runs `scripts/analyze.js` (TypeScript check + secret scan + `npm audit`). |
| Calendar integration diagnostic (targeted check) | `npx tsx scripts/diagnose-calendar.ts` | Focused verification for Google Calendar env/auth flow. |

There is currently **no dedicated unit/integration test runner** (no `test` script in `package.json`). For targeted verification, use the calendar diagnostic script above or run `npx tsc --noEmit` directly.

## High-level architecture

- **Frontend SPA (Vite + React + TS)**: `index.tsx` mounts `App.tsx`, and `App.tsx` currently orchestrates most page sections and modal flows (`ContactModal`, `BookingModal`, optional `AdminDashboard` pattern).
- **UI/content composition**: Primary hero/reel/process copy comes from `constants.ts`; social links are centralized in `data/socials.ts`.
- **Serverless backend (Vercel functions in `api/`)**:
  - `api/contact.ts`: accepts form payload, validates required fields, sends mail via Resend (`EMAIL_API_KEY`, `OWNER_EMAIL`).
  - `api/book/request.ts`: validates booking payload, creates Google Calendar event via OAuth refresh token, then calls `saveBooking(...)`.
  - `api/calendar/auth.ts` + `api/calendar/callback.ts`: OAuth helper endpoints to bootstrap/refresh Google Calendar credentials.
  - `api/book/review.ts`: currently returns `501 Not Implemented` (admin review workflow is not active in current serverless setup).
- **Persistence model**: `api/utils/db.js` is intentionally stateless in current deployment model (logs booking payload instead of writing local files).
- **Styling model**: Tailwind utility classes are used heavily in components, with additional global styles/utilities in `index.css`; `index.html` loads `/tailwind.js`.

## Key repository conventions

- **Vercel handler style**: API files default-export a request handler `(req, res)` and gate HTTP methods explicitly (`405` for unsupported methods).
- **TS-to-JS utility imports in API routes**: TypeScript handlers import runtime utility modules with `.js` extensions (example: `import { saveBooking } from "../utils/db.js"`). Keep this pattern when editing API routes.
- **Contact payload compatibility**: backend accepts either `fromEmail` or `email`; frontend currently sends `email`. Maintain this compatibility unless both sides are updated together.
- **Booking/admin reality vs UI history**: `AdminDashboard` exists as a UI component, but `api/book/review.ts` is deprecated/501. Treat review/admin changes as full-stack work, not frontend-only.
- **Route handling in frontend is manual**: `App.tsx` includes lightweight pathname checks for `/403`/`/forbidden`/fallback 404 rather than a router library.
- **Visual language is explicit and hardcoded**: color tokens are mostly inline hex classes (`#FAFAF8`, `#18181b`, `#e4e2dc`, `#d97706`) plus custom CSS helpers (`skeleton-custom`, `hero-tilt`).
- **Docs-to-code mismatch can exist**: prefer current behavior in `api/*`, `App.tsx`, and `package.json` over archived documents under `safe-archive/`.
