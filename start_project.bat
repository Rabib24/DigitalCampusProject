@echo off
echo ==========================================
echo Digital Campus - Starting Both Servers
echo ==========================================
echo.
echo This will start both backend and frontend servers.
echo Both servers will run in separate windows.
echo.
echo Backend: http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Close this window or press Ctrl+C to stop both servers.
echo.
pause

cd /d "%~dp0"

REM Start backend in a new window
start "Digital Campus - Backend" cmd /k "cd backend && start_backend.bat"

REM Wait a moment for backend to initialize
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "Digital Campus - Frontend" cmd /k "cd frontend && start_frontend.bat"

echo.
echo ==========================================
echo Both servers are starting...
echo ==========================================
echo.
echo Backend window: Digital Campus - Backend
echo Frontend window: Digital Campus - Frontend
echo.
echo Wait for both servers to fully start (about 10-30 seconds)
echo Then open your browser to: http://localhost:3000
echo.
echo To stop the servers, close their respective windows.
echo.
pause
