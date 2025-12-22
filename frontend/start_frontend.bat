@echo off
echo ==========================================
echo Digital Campus - Frontend Server
echo ==========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Node modules not found. Installing dependencies...
    echo This may take a few minutes...
    echo.
    call npm install
)

echo.
echo Starting Next.js development server...
echo Frontend will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
