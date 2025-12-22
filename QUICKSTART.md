# 🚀 Quick Start Guide - Digital Campus Project

## ⚡ First Time Setup

If this is your first time running the project:

1. **Double-click** `setup_project.bat` in the project root
2. Follow the on-screen prompts
3. The script will:
   - Check prerequisites (Python, Node.js, PostgreSQL)
   - Create the database
   - Install all dependencies
   - Run migrations
   - Optionally create admin user and load demo data

## 🎯 Running the Project

### Option 1: Run Both Servers Together (Recommended)
**Double-click** `start_project.bat`
- Opens two terminal windows (backend + frontend)
- Backend: http://127.0.0.1:8000
- Frontend: http://localhost:3000

### Option 2: Run Servers Separately

**Backend Only:**
```cmd
cd backend
start_backend.bat
```

**Frontend Only:**
```cmd
cd frontend
start_frontend.bat
```

## 📋 Prerequisites Checklist

Before running, ensure you have:

- [x] **Python 3.11+** installed
- [x] **Node.js 20+** installed  
- [x] **PostgreSQL 15+** installed and running
- [x] PostgreSQL service started
- [x] Database "DigitalCampus" created

## 🔧 Manual Setup (Alternative)

### Backend Setup
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```cmd
cd frontend
npm install
npm run dev
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://127.0.0.1:8000/api/v1/ | REST API endpoints |
| **Admin Panel** | http://127.0.0.1:8000/admin | Django admin interface |

## 📁 Configuration Files

### Backend (.env)
Located at: `backend\.env`
```env
DB_NAME=DigitalCampus
DB_USER=postgres
DB_PASSWORD=DigitalIUB
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env.local)
Located at: `frontend\.env.local`
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## 🐛 Common Issues & Solutions

### "Database does not exist"
```cmd
psql -U postgres -c "CREATE DATABASE \"DigitalCampus\";"
```

### "Port 8000 already in use"
```cmd
# Kill the process or use different port
python manage.py runserver 8001
```

### "Module not found" errors
```cmd
# Backend
cd backend
venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### PostgreSQL not running
```cmd
# Start PostgreSQL service
net start postgresql-x64-15
```

## 📊 API Endpoints

All API endpoints are prefixed with `/api/v1/`:

- **Authentication**: `/api/v1/auth/`
- **Faculty**: `/api/v1/faculty/`
- **Student**: `/api/v1/student/`
- **Admin**: `/api/v1/admin/`
- **Library**: `/api/v1/library/`
- **Finance**: `/api/v1/finance/`
- **IT**: `/api/v1/it/`
- **AI Services**: `/api/v1/ai/`
- **Search**: `/api/v1/search/`
- **Security**: `/api/v1/security/`

## 🎓 Demo Data

To load demo users and data:
```cmd
cd addDemoData
python run_demo_data.py
```

Check `addDemoData\USERPW.txt` for demo user credentials.

## 🛑 Stopping the Servers

- **Individual windows**: Press `Ctrl+C` or close the window
- **All servers**: Close all terminal windows

## 📖 More Information

- **Detailed Setup**: See `START_PROJECT.md`
- **Environment Variables**: See `frontend\ENVIRONMENT_VARIABLES.md`
- **Project Structure**: See `Documentation\` folder
- **Known Issues**: See `Errors.txt`

## 🔒 Security Note

**Important**: The current configuration is for **LOCAL DEVELOPMENT ONLY**. 
Do NOT use these settings in production.

For production deployment, refer to:
- `docker-compose.yml` for containerized deployment
- Change `DEBUG=False` in production
- Use strong secret keys and passwords
- Enable proper CORS settings

---

**Need Help?** Check the `Documentation/` folder for detailed guides and troubleshooting.
