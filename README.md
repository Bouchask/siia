# 🎓 SIIA - Academic Excellence Hub
### *Scalable Infrastructure for Academic Information & Management*

SIIA is a comprehensive, production-grade management system designed to streamline academic operations. Built with a focus on **Separation of Concerns** and **Secure RBAC Architecture**, this platform serves as a bridge between administration, faculty, and students.

**Note:** This project was developed by a student of the SIIA Master's program to demonstrate high-level engineering standards in Information Systems and Artificial Intelligence.

---

## 🚀 Tech Stack

**Frontend:**
- **React 19** & **Vite** (Next-gen performance)
- **Framer Motion** (Fluid UI/UX animations)
- **Axios** (Centralized service layer)
- **Lucide React** (Consistent iconography)
- **TipTap / CKEditor** (Advanced Rich Text processing)

**Backend:**
- **Flask** (Pythonic REST API)
- **PostgreSQL** (Relational data persistence)
- **SQLAlchemy ORM** (Database abstraction)
- **Flask-JWT-Extended** (Secure claims-based authentication)
- **Alembic** (Version-controlled database migrations)

**Infrastructure:**
- **Render** (Cloud hosting & DB provisioning)
- **Infrastructure as Code** (via `render.yaml`)
- **Google Drive API** (Integrated cloud file management)

---

## ✨ Key Architectural Features

### 🏗️ Centralized Service Architecture
Unlike standard React apps, SIIA utilizes a **Decoupled Service Layer**. Every API interaction is extracted from the UI components into dedicated service modules (`/client/src/services/`). This ensures:
- **Clean Code:** UI components focus exclusively on state and rendering.
- **Maintainability:** Endpoint changes occur in one file, reflecting project-wide.
- **Scalability:** Easy to implement caching or interceptors globally.

### 🔐 Role-Based Access Control (RBAC)
Security is implemented through a robust claims-based JWT system. Users are assigned roles (**Student, Professor, Admin**) that dynamically control:
- **UI Visibility:** Navigation and buttons adapt to user permissions.
- **API Security:** Backend decorators (`@requires_role`) verify permissions at the request level.

### ☁️ Google Drive Integration
SIIA uses the **Google Drive API** as a cloud-native storage engine for academic materials and timetables. The system dynamically fetches and synchronizes files from the institution's Drive, reducing local server overhead.

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python 3.12+
- PostgreSQL

### 1. Backend Setup
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `server/.env` file:
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/siia_db
SECRET_KEY=your_dev_secret
JWT_SECRET_KEY=your_jwt_secret
GOOGLE_APPLICATION_CREDENTIALS=your-google-creds.json
FRONTEND_URL=http://localhost:5173
```

Initialize the database:
```bash
flask db upgrade
python seed.py  # Optional: seed initial admin data
python run.py
```

### 2. Frontend Setup
```bash
cd client
npm install
```

Create a `client/.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```

---

## 🚢 Production & Deployment

This project is optimized for **Render.com** using the included `render.yaml` (Infrastructure as Code).

### Deployment Workflow:
1. **Infrastructure:** Render automatically provisions a PostgreSQL database and two web services (Static for React, Python for Flask).
2. **Migrations:** The backend deployment automatically runs `flask db upgrade` to keep the production schema in sync.
3. **Secrets:** All sensitive credentials (like Google JSON) are managed via Render's **Secret Files** system, ensuring no keys are ever committed to version control.

---

## 👨‍💻 Authors
**Yahya BOUCHAK**  
*Information Systems & AI (SIIA) Master's Student*  
*Full Stack Developer & AI Enthusiast*

**Ilyasse ABIDI**  
*Bachelor SIIA Student (Information System & IA)*  
*Software Engineering & AI Enthusiast*

---
*Developed with a focus on engineering standards, security, and clean architecture.*
