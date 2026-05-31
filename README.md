<div align="center">

<img src="https://img.shields.io/badge/BetteResume_AI-4F46E5?style=for-the-badge&logo=files&logoColor=white" alt="BetteResume AI"/>

# BetteResume AI 

### Crush the ATS "Black Hole" using AI Agents

**BetteResume AI** is an intelligent, full-stack career-optimization platform that bridges the gap between candidate resumes and modern Applicant Tracking Systems. By combining LLM-powered semantic analysis with dynamic LaTeX compilation, the platform scans profiles for keyword discrepancies and exports perfectly formatted, machine-readable resumes instantly.

[![Live Demo](https://img.shields.io/badge/Live_Demo-bette--resume--ai.vercel.app-4F46E5?style=for-the-badge&logo=vercel&logoColor=white)](https://bette-resume-ai.vercel.app)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://cloud.mongodb.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](./LICENSE)

</div>

---

## 🌟 Core Features

| Feature | Description |
|---|---|
| **Intelligent Skill Gap Analysis** | Parses resume files against target job roles using an AI agent pipeline — reveals missing keywords, hidden requirements, and phrasing mismatches |
| **ATS-Engineered LaTeX Generation** | Dynamically builds clean, standard-compliant LaTeX layouts optimized for structural parsers (Workday, Greenhouse, Lever) |
| **Secure JWT Authentication** | Lightweight token-based auth with bcrypt password hashing and 7-day session persistence |
| **Dark / Light Mode** | Full theme system with `localStorage` persistence — defaults to light, toggles instantly |
| **Async Processing** | Event-driven FastAPI backend delivers high-concurrency analysis without freezing client-side UI |
| **PDF & DOCX Parsing** | PyMuPDF + python-docx extract raw text from any uploaded resume format |

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Zustand, Axios, Lucide React |
| **Backend** | FastAPI, Uvicorn, Pydantic v2, python-jose, passlib |
| **Database** | MongoDB Atlas, Motor (async ODM) |
| **AI Orchestration** | Groq API — LLaMA 3.3 70B (high-performance inference) |
| **Document Engine** | Custom LaTeX conversion via Groq-structured output |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                          │
│   React + Zustand + Tailwind CSS (Vercel)                   │
│   PDF/DOCX upload → Role selection → Score display          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS + JWT Bearer
┌────────────────────────▼────────────────────────────────────┐
│                      API GATEWAY                            │
│   FastAPI + Uvicorn (Render)                                │
│   JWT middleware → Route handlers → Pydantic validation     │
└──────┬──────────────────┬──────────────────┬───────────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼───────┐  ┌──────▼──────────────┐
│   MongoDB   │  │  Groq API      │  │  File Parser        │
│   Atlas     │  │  LLaMA 3.3 70B │  │  PyMuPDF / docx     │
│             │  │                │  │                     │
│  users      │  │  extract()     │  │  PDF → raw text     │
│  resumes    │  │  analyze()     │  │  DOCX → raw text    │
│  analyses   │  │  latex_gen()   │  │                     │
└─────────────┘  └────────────────┘  └─────────────────────┘
```

**Flow:**
1. User uploads PDF/DOCX → backend extracts raw text via PyMuPDF/python-docx
2. Groq LLaMA parses resume into structured JSON (skills, experience, education)
3. Groq compares extracted skills against role requirements → gap report + score
4. Optional: Groq generates a full ATS-optimized LaTeX template from resume data
5. Results stored in MongoDB Atlas → returned to React dashboard

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Python 3.11
- MongoDB Atlas cluster (free M0 tier works)
- Groq API key — get one free at [console.groq.com](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/Solidx74/BetteResume-AI.git
cd BetteResume-AI
```

### 2. Configure & run the backend

```bash
cd server
python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt
```

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/?retryWrites=true
DB_NAME=betteresume
JWT_SECRET=your_random_32_char_string
GROQ_API_KEY=gsk_your_groq_key_here
MAX_FILE_SIZE_MB=10
PORT=8000
FRONTEND_URL=http://localhost:5173
```

Start the API:

```bash
uvicorn main:app --reload --port 8000
```

> ✅ You should see: `✓ MongoDB connected → betteresume`  
> 📖 Swagger docs at: `http://localhost:8000/docs`

### 3. Configure & run the frontend

```bash
cd ../client
npm install
```

For production API, create `client/.env`:

```env
# Leave empty for local dev — Vite proxy handles /api → localhost:8000
# Set this only when deploying to Vercel:
VITE_API_URL=https://your-render-backend.onrender.com
```

Start the dev server:

```bash
npm run dev
```

> ✅ App running at: `http://localhost:5173`

---

## ☁️ Production Deployment

### Backend → Render

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `bash start.sh` |

Add all `.env` keys as Render environment variables. Set `FRONTEND_URL` to your Vercel domain after deploying the frontend.

### Frontend → Vercel

| Setting | Value |
|---|---|
| Root Directory | `client` |
| Framework | Vite |
| Build Command | `npm run build` |

Add `VITE_API_URL=https://your-render-url.onrender.com` as a Vercel environment variable.

> ⚠️ **Important:** After both are deployed, update `FRONTEND_URL` on Render to your Vercel URL and redeploy — this enables CORS.

---

## 📁 Project Structure

```
BetteResume-AI/
├── client/                     # React + Vite frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Analysis.jsx
│   │   │   └── Latex.jsx
│   │   ├── store/
│   │   │   └── authStore.js
│   │   └── utils/
│   │       └── axios.js
│   ├── vercel.json
│   └── tailwind.config.js
│
└── server/                     # FastAPI backend
    ├── routers/
    │   ├── auth.py             # register · login · me
    │   ├── resume.py           # upload · history · latex
    │   └── analyze.py          # skill gap analysis
    ├── services/
    │   ├── groq_service.py     # LLaMA prompt engineering
    │   └── file_parser.py      # PyMuPDF + python-docx
    ├── models/
    │   ├── user.py
    │   └── resume.py
    ├── middleware/
    │   └── auth.py             # JWT dependency
    ├── main.py
    ├── config.py               # pydantic-settings
    ├── db.py                   # Motor async client
    ├── start.sh                # Render start command
    └── requirements.txt
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Create account |
| `POST` | `/api/auth/login` | ❌ | Login, receive JWT |
| `GET` | `/api/auth/me` | ✅ | Get current user |
| `POST` | `/api/resume/upload` | ✅ | Upload PDF/DOCX |
| `GET` | `/api/resume/history` | ✅ | List analyses |
| `POST` | `/api/analyze/resume` | ✅ | Run skill gap analysis |
| `GET` | `/api/analyze/:id` | ✅ | Get analysis result |
| `POST` | `/api/resume/generate-latex` | ✅ | Generate LaTeX |
| `GET` | `/api/resume/latex/:id` | ✅ | Retrieve saved LaTeX |
| `GET` | `/api/health` | ❌ | Health check |

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full terms.

---

## 👤 Author

<div align="center">

<img src="https://github.com/user-attachments/assets/b736a153-ec9f-4a2a-9021-cf7d045f6393" width="160" style="border-radius:50%" alt="Md. Kareeb Sadab"/>

**Md. Kareeb Sadab**  
Computer Science & Engineering - Chittagong University of Engineering and Technology (CUET)

[![GitHub](https://img.shields.io/badge/GitHub-Solidx74-181717?style=flat-square&logo=github)](https://github.com/Solidx74)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Kareeb_Sadab-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/karib-sadab-43666a407/)
[![Live App](https://img.shields.io/badge/Live_App-bette--resume--ai.vercel.app-4F46E5?style=flat-square&logo=vercel)](https://bette-resume-ai.vercel.app)

</div>

---

<div align="center">
<sub>Built with FastAPI · React · Groq LLaMA 3.3 70B · MongoDB Atlas</sub>
</div>
