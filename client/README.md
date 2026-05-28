# BetteResume — React Frontend

## Stack
- React 18 + Vite
- Tailwind CSS (custom design system — dark, acid green + cyan palette)
- Zustand (auth state)
- Axios (API calls, auto-attaches JWT)
- React Router v6
- Lucide React (icons)
- Fonts: Syne (display) + DM Sans (body) + JetBrains Mono

## Pages
| Route | Component | Auth |
|-------|-----------|------|
| `/` | Landing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/dashboard` | Dashboard | Protected |
| `/upload` | Upload | Protected |
| `/analysis/:id` | Analysis | Protected |
| `/latex/:id` | Latex | Protected |

## Setup

```bash
cd client
npm install
npm run dev
```

Runs on http://localhost:5173

## API proxy
Vite proxies `/api/*` → `http://localhost:8000` (FastAPI backend).
Change the target in `vite.config.js` if your backend runs on a different port.

## Environment
No `.env` needed for the frontend — backend URL is set via the Vite proxy.

## Design system
All tokens are in `tailwind.config.js`:
- `ink` / `ink-light` / `ink-mid` — dark backgrounds
- `acid` (#C8F135) — primary accent (lime green)
- `cyan` (#00E5FF) — secondary accent
- `ghost` (#E0E0F0) — primary text
- `muted` / `muted-light` — secondary text
- `surface` / `surface-light` — card/border backgrounds
