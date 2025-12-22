@echo off
echo ==========================================
echo Digital Campus - Complete Setup
echo ==========================================
echo.
echo This script will set up the entire project for first-time use.
echo.
pause

cd /d "%~dp0"

REM ========================================
REM STEP 1: Check Prerequisites
REM ========================================
echo.
echo [1/6] Checking prerequisites...
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✓ Python found

node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js is not installed or not in PATH
    echo Please install Node.js 20+ from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Check for PostgreSQL - try common installation paths
set "PSQL_PATH="
if exist "C:\Program Files\PostgreSQL\17\bin\psql.exe" set "PSQL_PATH=C:\Program Files\PostgreSQL\17\bin\psql.exe"

psql --version >nul 2>&1
if errorlevel 1 (
    if "%PSQL_PATH%"=="" (
        echo ⚠ PostgreSQL command-line tools not found in PATH
        echo Please ensure PostgreSQL is installed and running
        echo You can continue, but database creation may need to be done manually
        echo.
        set /p CONTINUE="Continue anyway? (y/n): "
        if /i not "%CONTINUE%"=="y" exit /b 1
    ) else (
        echo ✓ PostgreSQL found at: %PSQL_PATH%
    )
) else (
    echo ✓ PostgreSQL found in PATH
    set "PSQL_PATH=psql"
)

REM ========================================
REM STEP 2: Database Setup
REM ========================================
echo.
echo [2/6] Setting up database...
echo.
echo The database setup requires PostgreSQL to be running.
echo.
echo Please ensure:
echo   1. PostgreSQL service is running
echo   2. You have created the database manually if needed
echo.
echo To create the database manually:
echo   - Open pgAdmin
echo   - Right-click on "Databases" -^> Create -^> Database
echo   - Name: DigitalCampus
echo   - Owner: postgres
echo.
echo OR use SQL Shell (psql):
echo   CREATE DATABASE "DigitalCampus";
echo.
set /p DB_READY="Is PostgreSQL running and database ready? (y/n): "
if /i not "%DB_READY%"=="y" (
    echo.
    echo Please set up the database and run this script again.
    pause
    exit /b 1
)
echo ✓ Database confirmed ready

REM ========================================
REM STEP 3: Backend Setup
REM ========================================
echo.
echo [3/6] Setting up backend...
echo.

cd backend

if not exist "venv\" (
    echo Creating Python virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
echo This may take a few minutes...
pip install -q -r requirements.txt

if errorlevel 1 (
    echo ✗ Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

if errorlevel 1 (
    echo ✗ Migration failed
    pause
    exit /b 1
)
echo ✓ Migrations completed

REM ========================================
REM STEP 4: Create Superuser (Optional)
REM ========================================
echo.
echo [4/6] Create admin superuser (optional)
echo.
set /p CREATE_SUPER="Do you want to create a superuser account? (y/n): "
if /i "%CREATE_SUPER%"=="y" (
    python manage.py createsuperuser
)

REM ========================================
REM STEP 5: Frontend Setup
REM ========================================
echo.
echo [5/6] Setting up frontend...
echo.

cd ..\frontend

echo Installing Node.js dependencies...
echo This may take a few minutes...
call npm install

if errorlevel 1 (
    echo ✗ Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM ========================================
REM STEP 6: Load Demo Data (Optional)
REM ========================================
echo.
echo [6/6] Load demo data (optional)
echo.
set /p LOAD_DEMO="Do you want to load demo data? (y/n): "
if /i "%LOAD_DEMO%"=="y" (
    cd ..\addDemoData
    python run_demo_data.py
    cd ..
)

REM ========================================
REM SETUP COMPLETE
REM ========================================
echo.
echo ==========================================
echo Setup Complete! 🎉
echo ==========================================
echo.
echo Environment files created:
echo   - backend\.env (database and Django config)
echo   - frontend\.env.local (API URL config)
echo.
echo To start the project:
echo   1. Run: start_project.bat
echo   OR
echo   2. Backend: cd backend ^&^& start_backend.bat
echo      Frontend: cd frontend ^&^& start_frontend.bat
echo.
echo Access points:
echo   - Frontend: http://localhost:3000
echo   - Backend Admin: http://127.0.0.1:8000/admin
echo   - Backend API: http://127.0.0.1:8000/api
echo.
echo For more information, see START_PROJECT.md
echo.
pause
