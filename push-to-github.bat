@echo off
title Push KV Flash to GitHub (KV-Flash-)
cd /d "%~dp0"

echo ========================================================
echo        🚀 Pushing KV Flash to GitHub Repository
echo   https://github.com/saurabhkakde18/KV-Flash-.git
echo ========================================================
echo.

:: Check for Git
set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "C:\Users\Sanvijay\AppData\Local\MinGit\cmd\git.exe" (
        set "GIT_CMD=C:\Users\Sanvijay\AppData\Local\MinGit\cmd\git.exe"
    ) else if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    )
)

echo [*] Initializing Git repository...
"%GIT_CMD%" init

echo [*] Setting remote origin...
"%GIT_CMD%" remote remove origin >nul 2>nul
"%GIT_CMD%" remote add origin https://github.com/saurabhkakde18/KV-Flash-.git

echo [*] Staging all files...
"%GIT_CMD%" add .

echo [*] Creating commit...
"%GIT_CMD%" commit -m "Initial commit: KV Flash Vehicle Finance Reference, Calculator, Officer Auth & Mobile App"

echo [*] Setting main branch...
"%GIT_CMD%" branch -M main

echo [*] Pushing to GitHub (main branch)...
"%GIT_CMD%" push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [*] Retrying with force push if remote contains files...
    "%GIT_CMD%" push -u origin main --force
)

echo.
echo ========================================================
echo  ✅ PUSH PROCESS COMPLETE!
echo  Check repository at: https://github.com/saurabhkakde18/KV-Flash-
echo ========================================================
echo.
pause
