# GridShare Startup Script (PowerShell)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   GridShare - Energy Trading Platform" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "[1/3] Checking MongoDB status..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($null -eq $mongoService) {
    Write-Host "WARNING: MongoDB is not installed!" -ForegroundColor Red
    Write-Host "Please install MongoDB from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

if ($mongoService.Status -ne 'Running') {
    Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
    try {
        Start-Service -Name MongoDB
        Write-Host "MongoDB started successfully ✓" -ForegroundColor Green
    } catch {
        Write-Host "Failed to start MongoDB!" -ForegroundColor Red
        Write-Host "Please start it manually: net start MongoDB" -ForegroundColor Yellow
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "MongoDB is running ✓" -ForegroundColor Green
}
Write-Host ""

# Check server dependencies
Write-Host "[2/3] Checking server dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "server\node_modules")) {
    Write-Host "Installing server dependencies..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}
Write-Host "Server dependencies ready ✓" -ForegroundColor Green
Write-Host ""

# Start backend server
Write-Host "[3/3] Starting backend server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend API will run on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Keep this window open!" -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan

Set-Location server
npm start
