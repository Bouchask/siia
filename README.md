# 🎓 SIIA - Academic Excellence Hub
### *Scalable Infrastructure for Academic Information & Management*

SIIA is a production-grade academic management system designed to streamline communication and resource sharing at **FP Khouribga (USMS)**. Built with a focus on **Separation of Concerns**, **Secure RBAC Architecture**, and **High-Performance Data Patterns**, this platform serves as a unified digital workspace for administration, faculty, and students.

---

## 🚀 Tech Stack

**Frontend:**
- **React 19** & **Vite** (Next-gen development performance)
- **Framer Motion** (Advanced scroll-triggered animations & fluid UI transitions)
- **Axios** (Centralized service layer with JWT interceptors)
- **Lucide React** (Premium engineering iconography)
- **TipTap / Custom Block Editor** (Notion-style rich text processing for academic news)

**Backend:**
- **Flask** (Pythonic REST API with modular Blueprints)
- **PostgreSQL (Aiven.io)** (Secure relational data persistence with forced SSL)
- **SQLAlchemy ORM** (Database abstraction & complex relationship management)
- **Flask-JWT-Extended** (Secure claims-based authentication with role-based decorators)
- **Alembic** (Version-controlled database migrations)

**Infrastructure:**
- **Vercel** (Production hosting for both Frontend and Serverless Backend Functions)
- **Google Drive API v3** (Integrated as a cloud-native storage engine via Service Accounts)
- **Aiven Cloud** (High-availability managed PostgreSQL)

---

## ✨ Advanced Architectural Features

### 🏗️ Centralized Service Architecture
SIIA utilizes a **Decoupled Service Layer** (`/client/src/services/`). API logic is fully separated from UI components, ensuring:
- **Clean Components:** React files focus exclusively on state and rendering logic.
- **Global Resilience:** Connection fixes (like SSL enforcement or proxying) are applied once and reflected everywhere.

### 💾 High-Efficiency Data Pattern (JSON Compression)
To maximize the utility of the database while maintaining flexibility, course materials are stored as **Compressed JSON Strings**.
- **Short-Key Mapping:** The system automatically converts long descriptive keys to single-letter tokens (`l`, `d`, `p`) before saving to the database.
- **Capacity:** This allows storing **5x more academic resources** (Lectures, TDs, TPs) per module compared to standard storage patterns.

### 🖼️ Secure Media Proxying
To overcome browser security restrictions (**OpaqueResponseBlocking**) and Google Drive's default embedding limits, SIIA features a custom **Backend Proxy Layer**. Images and PDFs are fetched via the server-side Google Service Account and streamed to the client with correct MIME types.

### 🏎️ Advanced SIIA Loader
The platform features a custom-branded **High-Tech SIIA Loader** with a futuristic "scanning" effect and pulsing typography, ensuring a consistent premium feel during all asynchronous data fetching operations.

---

## 📁 Project Structure

```text
siia/
├── client/                 # React 19 Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (SIIALoader, AnnouncementCard, etc.)
│   │   ├── pages/          # View Controllers (Home, AboutSIIA, Timetables, Admin)
│   │   ├── services/       # Decoupled API Service Layer
│   │   ├── utils/          # Logic Helpers (DriveLinkConverter, etc.)
│   │   └── data/           # Static Content & Localizations
│   └── vercel.json         # Vercel Deployment Configuration
├── server/                 # Flask Backend API
│   ├── app/
│   │   ├── api/            # Route Blueprints (Auth, Academic, Settings, Drive)
│   │   ├── models/         # SQLAlchemy Database Schemas
│   │   ├── services/       # Core Business Logic (Google Drive Service)
│   │   └── utils/          # Decorators & Security Helpers
│   ├── migrations/         # Alembic DB Migration Scripts
│   ├── run.py              # Entry Point (Production & Vercel)
│   └── config.py           # Production Configuration (SSL & Aiven Logic)
└── README.md
```

---

## 🛠️ Local Development

### 1. Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Required `.env` Variables:**
- `DATABASE_URL`: PostgreSQL connection string (include `?sslmode=require` for Aiven).
- `GOOGLE_CREDENTIALS_JSON`: The raw JSON content of your Google Service Account.
- `SECRET_KEY` & `JWT_SECRET_KEY`: Random secure strings.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```

---

## 🚢 Vercel Deployment
This project is optimized for Vercel. 
- The **Frontend** is deployed as a static build.
- The **Backend** is served via Vercel's Python Runtime as Serverless Functions.
- All secrets (DB, Google JSON) must be configured in the **Vercel Project Settings**.

---

## 👨‍💻 Authors
**Yahya Bouchak**  
*Information Systems & AI (SIIA) Master's Student*  
*Full Stack Developer & AI Enthusiast*

**Ilyass Abidi**  
*Bachelor SIIA Student (Information System & IA)*  
*Software Engineering & AI Enthusiast*

---
*Developed with a focus on engineering standards, security, and clean architecture for the SIIA Excellence Track.*
