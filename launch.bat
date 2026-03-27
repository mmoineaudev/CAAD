@echo off
REM CAAD - Antenna CAD Launcher
REM Windows batch launcher for FDTD electromagnetic simulation application

echo ============================================================
echo   CAAD - Antenna CAD Application
echo   Finite-Difference Time-Domain (FDTD) Simulator
echo ============================================================
echo.

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if Electron is installed
if not exist "node_modules\.bin\electron.cmd" (
    echo Error: Electron not found. Run 'npm install' first.
    pause
    exit /b 1
)

REM Launch the application
echo Starting CAAD...
echo ============================================================
echo.

node "node_modules\electron\cli.js" .
