@echo off
echo ==========================================
echo Digital Campus - Backend Server
echo ==========================================
echo.

REM Check if virtual environment exists
if not exist "venv\Scripts\activate.bat" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
    echo.
    echo Installing dependencies...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate.bat
)

echo.
echo Checking database connection...
python -c "import psycopg2; conn = psycopg2.connect(dbname='DigitalCampus', user='postgres', password='DigitalIUB', host='localhost'); print('✓ Database connection successful'); conn.close()" 2>nul

if errorlevel 1 (
    echo.
    echo ⚠ WARNING: Cannot connect to PostgreSQL database!
    echo.
    echo Please ensure:
    echo   1. PostgreSQL service is running
    echo      - Open Services (Win+R, type: services.msc)
    echo      - Find "postgresql-x64-15" (or similar)
    echo      - Click "Start" if not running
    echo.
    echo   2. Database 'DigitalCampus' exists
    echo      - Open pgAdmin
    echo      - Right-click Databases -^> Create -^> Database
    echo      - Name: DigitalCampus
    echo.
    echo   3. Password in .env matches your PostgreSQL password
    echo      - Edit backend\.env if needed
    echo      - Default password: DigitalIUB
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "%CONTINUE%"=="y" (
        pause
        exit /b 1
    )
) else (
    echo ✓ Database connection successful
)

echo.
echo Starting Django development server...
echo Backend will be available at: http://127.0.0.1:8000
echo Admin panel at: http://127.0.0.1:8000/admin
echo.
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver
