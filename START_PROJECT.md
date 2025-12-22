# Digital Campus Project - Local Startup Guide

This guide will help you run the Digital Campus project locally on your Windows machine.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 20+** - [Download Node.js](https://nodejs.org/)
3. **PostgreSQL 15+** - [Download PostgreSQL](https://www.postgresql.org/download/)
4. **Git** - [Download Git](https://git-scm.com/downloads)

## Step 1: Database Setup

### 1.1 Start PostgreSQL Service
Ensure PostgreSQL is running on your system. You can start it via:
- **Services** (Windows): Search for "Services" → Find "postgresql-x64-15" → Start
- **Command Line**: `net start postgresql-x64-15`

### 1.2 Create Database
Open **pgAdmin** or use **psql** command line:

```sql
-- Connect to PostgreSQL (default user: postgres)
-- Create the database
CREATE DATABASE "DigitalCampus";

-- Set password for postgres user (if needed)
ALTER USER postgres WITH PASSWORD 'DigitalIUB';
```

Or using command line:
```cmd
psql -U postgres -c "CREATE DATABASE \"DigitalCampus\";"
```

## Step 2: Backend Setup (Django)

### 2.1 Navigate to Backend Directory
```cmd
cd g:\DigitalCampusProject-main\DigitalCampusProject\backend
```

### 2.2 Create Python Virtual Environment (Recommended)
```cmd
python -m venv venv
venv\Scripts\activate
```

### 2.3 Install Python Dependencies
```cmd
pip install -r requirements.txt
```

This will install:
- Django 5.0.6+
- Django REST Framework
- PostgreSQL adapter (psycopg2)
- All other required packages

### 2.4 Verify Environment Variables
The `.env` file has been created at `backend\.env` with the following configuration:
```
DB_NAME=DigitalCampus
DB_USER=postgres
DB_PASSWORD=DigitalIUB
DB_HOST=localhost
DB_PORT=5432
DEBUG=True
```

**Note**: If your PostgreSQL password is different, update it in `backend\.env`

### 2.5 Run Database Migrations
```cmd
python manage.py makemigrations
python manage.py migrate
```

### 2.6 Create Superuser (Optional)
```cmd
python manage.py createsuperuser
```
Follow the prompts to create an admin account.

### 2.7 Load Demo Data (Optional)
If you want to populate the database with demo data:
```cmd
cd ..\addDemoData
python run_demo_data.py
```

### 2.8 Start Django Development Server
```cmd
cd ..\backend
python manage.py runserver
```

The backend should now be running at: **http://127.0.0.1:8000**

You can test it by visiting: http://127.0.0.1:8000/admin

## Step 3: Frontend Setup (Next.js)

### 3.1 Open a New Terminal Window
Keep the backend server running and open a new terminal/command prompt.

### 3.2 Navigate to Frontend Directory
```cmd
cd g:\DigitalCampusProject-main\DigitalCampusProject\frontend
```

### 3.3 Install Node Dependencies
```cmd
npm install
```

This will install:
- Next.js 16.0.3
- React 19.2.0
- Tailwind CSS
- Radix UI components
- All other required packages

### 3.4 Verify Environment Variables
The `.env.local` file has been created at `frontend\.env.local` with:
```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

This tells the frontend to connect to your local backend.

### 3.5 Start Next.js Development Server
```cmd
npm run dev
```

The frontend should now be running at: **http://localhost:3000**

## Step 4: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend Admin**: http://127.0.0.1:8000/admin
- **Backend API**: http://127.0.0.1:8000/api

## Optional Services

### Redis (Optional - for caching)
The application can work without Redis, but for full functionality:

1. **Install Redis** for Windows: [Download Redis](https://github.com/microsoftarchive/redis/releases)
2. **Start Redis**:
   ```cmd
   redis-server
   ```
   Default port: 6379

The Django settings are configured to fall back to local memory cache if Redis is not available.

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready -U postgres`
- Check database exists: `psql -U postgres -l`
- Verify credentials in `backend\.env` match your PostgreSQL setup

### Port Already in Use
- **Backend (8000)**: Change port with `python manage.py runserver 8001`
- **Frontend (3000)**: Next.js will automatically try 3001 if 3000 is busy

### Module Not Found Errors
- **Backend**: Ensure virtual environment is activated and `pip install -r requirements.txt` completed
- **Frontend**: Delete `node_modules` and run `npm install` again

### Migration Errors
If you encounter migration conflicts:
```cmd
python manage.py migrate --run-syncdb
```

## Quick Start Scripts

### Windows Batch Script (start_backend.bat)
Create this file in the `backend` directory:
```cmd
@echo off
call venv\Scripts\activate
python manage.py runserver
```

### Windows Batch Script (start_frontend.bat)
Create this file in the `frontend` directory:
```cmd
@echo off
npm run dev
```

## Project Structure
```
DigitalCampusProject/
├── backend/              # Django backend
│   ├── .env             # Backend environment variables
│   ├── manage.py        # Django management script
│   └── requirements.txt # Python dependencies
├── frontend/            # Next.js frontend
│   ├── .env.local       # Frontend environment variables
│   └── package.json     # Node dependencies
└── addDemoData/         # Demo data generation scripts
```

## Default Test Users (After Loading Demo Data)

Check `addDemoData/USERPW.txt` for demo user credentials.

## Next Steps

1. **Explore the Admin Panel**: http://127.0.0.1:8000/admin
2. **Check API Documentation**: http://127.0.0.1:8000/api (if configured)
3. **Test Frontend Features**: http://localhost:3000

## Support

For issues or questions:
- Check the `Documentation/` folder for detailed guides
- Review `Errors.txt` for known issues
- Check `todo.txt` for pending features

---

**Note**: This is a development setup. For production deployment, refer to the Docker configuration in `docker-compose.yml`.
