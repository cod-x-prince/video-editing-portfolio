# Full Project Report — Addictive Video Editing Portfolio

## 1) Executive summary

The project is a modern React + Vite portfolio with Vercel serverless APIs for contact and booking flows. The frontend build is healthy, but the backend/user-flow consistency is not fully production-safe yet. The biggest immediate issue is a **broken contact flow contract** (frontend does not send `subject`, backend requires it).

Current health at a glance:

- **Build:** passing (`npm run build`)
- **Type check:** passing (`npx tsc --noEmit` via `npm run analyze`)
- **Automated tests:** not present (no `test` script)
- **Dependency security:** `35` vulnerabilities reported in latest analysis snapshot (`27 high`, `1 critical`)
- **Booking admin workflow:** UI exists historically, API review endpoint is currently deprecated (`501`)

---

## 2) Current architecture

### Frontend

- Entry: `index.tsx` mounts `App.tsx`
- Main composition: `App.tsx` contains most page sections + modal orchestration
- UI components: `components/*` (notably `ContactModal`, `BookingModal`, `ReelCard`, `Navigation`, `ErrorBoundary`)
- Data/content:
  - Primary page content from `constants.ts`
  - Social links from `data/socials.ts`

### Backend (Vercel serverless functions)

- `api/contact.ts`: email send via Resend (`EMAIL_API_KEY`, `OWNER_EMAIL`)
- `api/book/request.ts`: validates booking request, inserts Google Calendar event
- `api/calendar/auth.ts` + `api/calendar/callback.ts`: OAuth bootstrap for Calendar tokens
- `api/book/review.ts`: deprecated endpoint; returns `501 Not Implemented`

### Persistence & deployment model

- `api/utils/db.js` is stateless in current serverless setup (logs booking payload; no file DB writes in production model)
- Build/deploy assumes Node 18 in CI (`.github/workflows/ci.yml`)

---

## 3) Confirmed bugs to handle

## Bug A — Contact form fails in normal usage (**High**)

**Where:** `components/ContactModal.tsx` + `api/contact.ts`

**What:** frontend sends `{ name, email, message }`; backend requires `subject` and returns 400 if missing.

**Impact:** users cannot submit contact form successfully unless payload is manually altered.

**Fix direction:**
1. Add `subject` input in `ContactModal.tsx` and include in payload, **or**
2. Make backend accept missing subject with a safe default (e.g., `"General Inquiry"`), while still validating message/email.

---

## Bug B — Admin booking workflow is inconsistent/dead path (**Medium/High**)

**Where:** `components/AdminDashboard.tsx` and `api/book/review.ts`

**What:** dashboard code assumes fetchable/modifiable bookings; API endpoint currently returns `501`.

**Impact:** admin review/approve/decline flow is effectively non-functional.

**Fix direction:**
1. Either remove/hide admin dashboard until real persistence exists, or
2. Implement real datastore-backed review API and wire dashboard accordingly.

---

## Bug C — Insecure fallback admin token literal in code (**Medium**)

**Where:** `api/book/review.ts`

**What:** `ADMIN_SECRET = process.env.ADMIN_TOKEN || "secret123"`.

**Impact:** if env var is misconfigured, endpoint falls back to a predictable secret.

**Fix direction:**
1. Remove hardcoded fallback; fail fast when `ADMIN_TOKEN` is missing.

---

## Bug D — Type declaration drift vs runtime behavior in DB utility (**Medium**)

**Where:** `api/utils/db.d.ts` vs `api/utils/db.js`

**What:** `.d.ts` declares `db.getAll/updateStatus`; runtime exports `db = null`.

**Impact:** future TS consumers can compile against APIs that do not exist at runtime.

**Fix direction:**
1. Align typings to current stateless runtime, or
2. Reintroduce real DB module implementation and match declarations.

---

## Bug E — Contact endpoint emits detailed request logging (**Low/Medium**)

**Where:** `api/contact.ts`

**What:** extensive logs include request metadata and body-key diagnostics.

**Impact:** noisy logs; risk of accidentally logging sensitive user data if later expanded.

**Fix direction:**
1. Keep structured minimal logs in production (method, status, request id), avoid payload-level verbosity.

---

## 4) Main cons / technical debt to solve

1. **Monolithic page composition** in `App.tsx` makes changes riskier and review harder.
2. **Feature drift between docs and implementation** (README/V2 claims vs current API reality).
3. **No test harness** (unit/integration/e2e) despite multi-step form/API flows.
4. **Security debt in dependencies** (`35` vulnerabilities in current analysis snapshot).
5. **Data duplication risk** (`constants.ts` reels vs `data/reels.ts`) can cause content divergence.
6. **Manual route handling** (`window.location.pathname` checks) is brittle compared to router-based routes.
7. **Type-safety bypass patterns** (global JSX declarations with `any` in `ThreeHero.tsx`).

---

## 5) Priority fix plan (recommended order)

1. **Repair contact flow contract** (Bug A) and verify end-to-end submit.
2. **Resolve admin workflow direction** (Bug B): either disable dead UI or implement storage-backed review.
3. **Remove insecure token fallback** (Bug C).
4. **Align DB typings/runtime** (Bug D) to prevent future integration errors.
5. **Dependency remediation pass** (incremental package updates + re-audit).
6. **Refactor App into section components** for maintainability.
7. **Add test baseline**:
   - API contract tests for `/api/contact` and `/api/book/request`
   - one happy-path UI test for contact and booking modal submission

---

## 6) Useful project commands

- Install: `npm ci`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Analysis (type + secret scan + audit): `npm run analyze`
- Calendar diagnostics: `npx tsx scripts/diagnose-calendar.ts`

---

## 7) Environment variables currently expected

- `EMAIL_API_KEY`
- `OWNER_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `GOOGLE_REFRESH_TOKEN` (needed for booking event creation flow)
- `GOOGLE_CALENDAR_ID`
- `ADMIN_TOKEN` (for any admin review workflow if retained)

---

## 8) Conclusion

The portfolio is visually strong and build-stable, but it is not yet fully operational as a production lead pipeline due to backend contract gaps and admin workflow inconsistency. Fixing the contact contract and backend alignment first will produce the fastest reliability gain.
