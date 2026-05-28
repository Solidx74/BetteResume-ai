# BetteResume — FastAPI Backend

## Stack
- FastAPI + Uvicorn (async)
- Motor (async MongoDB driver)
- python-jose (JWT)
- passlib[bcrypt] (password hashing)
- Groq SDK → LLaMA 3.3 70B
- PyMuPDF (PDF parsing)
- python-docx (DOCX parsing)
- Pydantic v2 + pydantic-settings

## Project structure
```
server/
├── main.py              # App factory, CORS, lifespan
├── config.py            # Settings from .env
├── db.py                # Motor connection + indexes
├── requirements.txt
├── routers/
│   ├── auth.py          # POST /api/auth/register|login, GET /api/auth/me
│   ├── resume.py        # POST /upload, GET /history, POST /generate-latex, GET /latex/:id
│   └── analyze.py       # POST /api/analyze/resume, GET /api/analyze/:id
├── services/
│   ├── groq_service.py  # extract_resume_data(), analyze_skill_gap(), generate_latex()
│   └── file_parser.py   # parse_pdf(), parse_docx()
├── models/
│   ├── user.py          # UserCreate, UserLogin, UserOut, TokenResponse
│   └── resume.py        # ResumeOut, AnalyzeRequest, LatexRequest
└── middleware/
    └── auth.py          # get_current_user() JWT dependency
```

## API endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | ❌ | Register new user |
| POST | /api/auth/login | ❌ | Login, get JWT |
| GET | /api/auth/me | ✅ | Get current user |
| POST | /api/resume/upload | ✅ | Upload PDF/DOCX, parse text |
| GET | /api/resume/history | ✅ | List user's resumes + analyses |
| POST | /api/resume/generate-latex | ✅ | Generate LaTeX from analysis |
| GET | /api/resume/latex/:id | ✅ | Get saved LaTeX |
| POST | /api/analyze/resume | ✅ | Run full AI analysis |
| GET | /api/analyze/:id | ✅ | Get analysis result |
| GET | /api/health | ❌ | Health check |

## Setup

```bash
cd server
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env — add MONGODB_URI and GROQ_API_KEY
uvicorn main:app --reload --port 8000
```

API docs available at http://localhost:8000/docs

## Get API keys (both free)
- **Groq**: https://console.groq.com → API Keys → Create key
- **MongoDB Atlas**: https://cloud.mongodb.com → Free M0 cluster → Get connection string
