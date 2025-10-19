@echo off
echo ============================================
echo   GridShare - Energy Trading Platform
echo ============================================
echo.

REM Check if MongoDB is running
echo [1/3] Checking MongoDB status...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo WARNING: MongoDB is not running!
    echo Please start MongoDB service or install it from:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo Trying to start MongoDB service...
    net start MongoDB 2>nul
    if %errorlevel% neq 0 (
        echo FAILED: Could not start MongoDB.
        echo Please install MongoDB and try again.
        pause
        exit /b 1
    )
)
echo MongoDB is running ✓
echo.

REM Check if server dependencies are installed
echo [2/3] Checking server dependencies...
if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    call npm install
    cd ..
)
echo Server dependencies ready ✓
echo.

REM Start the backend server
echo [3/3] Starting backend server...
echo.
echo Backend API will run on http://localhost:5000
echo Keep this window open!
echo.
echo ============================================
cd server
call npm start
