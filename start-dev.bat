@echo off
setlocal enabledelayedexpansion
title KV Flash Dev Server Launcher
cd /d "%~dp0"

echo =======================================================
echo          ⚡ KV Flash Dev Server Diagnostics ⚡
echo =======================================================
echo.

:: 1. Check if Node.js is in current PATH
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js not found in current PATH. Searching common install paths...
    
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
        echo [+] Found Node.js in C:\Program Files\nodejs
    ) else if exist "C:\Program Files (x86)\nodejs\node.exe" (
        set "PATH=C:\Program Files (x86)\nodejs;%PATH%"
        echo [+] Found Node.js in C:\Program Files (x86)\nodejs
    ) else if exist "%LOCALAPPDATA%\Programs\node\node.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\node;%PATH%"
        echo [+] Found Node.js in %LOCALAPPDATA%\Programs\node
    ) else if exist "%APPDATA%\nvm" (
        set "PATH=%APPDATA%\nvm;%PATH%"
    )
)

:: 2. Verify Node.js again
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo =======================================================
    echo  ❌ ERROR: Node.js is not installed on this computer!
    echo =======================================================
    echo.
    echo Next.js requires Node.js to run locally.
    echo.
    echo 1. Download and install Node.js (LTS version):
    echo    https://nodejs.org/
    echo.
    echo 2. After installing, run this file again!
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js is available:
node -v
echo [✓] NPM is available:
npm -v
echo.

:: 3. Check node_modules
if not exist "node_modules\" (
    echo [*] Installing dependencies (this happens only once)...
    call npm install
    if %errorlevel% neq 0 (
        echo [!] npm install encountered an error.
        pause
        exit /b 1
    )
)

:: 4. Start Next dev server
echo.
echo =======================================================
echo  🚀 Starting Next.js Dev Server at http://localhost:3000
echo =======================================================
echo.
echo Opening browser in 3 seconds...
start "" "http://localhost:3000"

call npm run dev

echo.
echo Server stopped.
pause
