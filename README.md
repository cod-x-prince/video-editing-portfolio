# 🎬 Addictive Video Editing Portfolio

A **high-performance, cinematic video editing portfolio** built with modern web technologies and an agentic workflow.  
Designed to showcase **short-form vertical (Instagram Reels–style) edits**, smooth micro-interactions, 3D elements, and real-world freelance workflows — **not a template**, not a generic site.

🔗 **Live Site:**  
https://video-editing-portfolio-seven.vercel.app

🔗 **Repository:**  
https://github.com/cod-x-prince/video-editing-portfolio

---

## ✨ Features

### 🎥 Portfolio & UI

- Instagram Reel–format video showcase (9:16)
- Smooth, buttery scroll experience
- Micro-interactions and motion-driven UI
- Performance-optimized video loading
- Modern, dark, cinematic design language

### 📩 Contact System (Server-Side Secure)

- Email popup with:
  - User email
  - Subject
  - Message
- Email delivery handled **entirely on the backend**
- No email address exposed in frontend
- Powered by **Resend API**

### 📅 Booking System (Google Calendar)

- “Book a Call” flow for clients
- Booking requests stored server-side
- Google Calendar OAuth integration
- Calendar access is **secure, private, and token-based**
- Designed for approval / reschedule workflows

### 🧠 Agentic Architecture

- Modular serverless APIs
- Clear separation of:
  - UI
  - Business logic
  - Integrations
- Designed to scale into an **AI-assisted self-maintaining project**

---

## 🛠️ Tech Stack

### Frontend

- **Vite**
- **React + TypeScript**
- **Tailwind CSS (CDN – v1, CLI planned for v2)**
- Framer Motion
- Three.js / React Three Fiber (3D elements)

### Backend (Serverless)

- **Vercel Serverless Functions**
- Node.js 18 runtime
- File-based persistence (for lightweight booking data)

### Integrations

- **Resend** — transactional email
- **Google Calendar API** — booking & scheduling
- Google OAuth 2.0

---

## 📂 Project Structure

```txt
.
├── api/
│   ├── contact.ts           # Secure email sending (Resend)
│   ├── book/
│   │   ├── request.ts       # Booking request handler
│   │   └── review.ts        # Booking review logic
│   ├── calendar/
│   │   ├── auth.ts          # Google OAuth start
│   │   └── callback.ts      # OAuth callback & token storage
│   └── utils/
│       ├── db.ts            # File-based persistence
│       └── calendar.ts      # Calendar helper utilities
│
├── components/
│   ├── BookingModal.tsx
│   ├── ContactModal.tsx
│   ├── ErrorBoundary.tsx
│   └── AdminDashboard.tsx
│
├── data/                    # Runtime data (gitignored)
├── public/
│   └── reels/               # Instagram-format videos
│
├── src/
│   └── main UI logic
│
├── index.html
├── package.json
└── README.md
```
