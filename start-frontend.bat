@echo off
echo ============================================
echo   GridShare - Frontend Application
echo ============================================
echo.

REM Check if dependencies are installed
echo Checking frontend dependencies...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)
echo Dependencies ready ✓
echo.

echo Starting frontend development server...
echo.
echo Frontend will run on http://localhost:5173
echo Keep this window open!
echo.
echo ============================================
call npm run dev
