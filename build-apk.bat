@echo off
title Build KV Flash Android APK
cd /d "%~dp0"

echo ========================================================
echo        🚀 KV FLASH - ANDROID APK BUILDER
echo ========================================================
echo.

:: 1. Check if Flutter or Android SDK is available
where flutter >nul 2>nul
if %errorlevel% equ 0 (
    echo [*] Flutter SDK detected! Building APK via Flutter...
    cd mobile_app
    call flutter pub get
    call flutter build apk --release
    if exist "build\app\outputs\flutter-apk\app-release.apk" (
        echo.
        echo ========================================================
        echo  🎉 APK BUILD SUCCESSFUL!
        echo  Output Location:
        echo  %cd%\build\app\outputs\flutter-apk\app-release.apk
        echo ========================================================
        copy "build\app\outputs\flutter-apk\app-release.apk" "..\KV-Flash-release.apk" >nul
        echo  [+] Copied to project root as: KV-Flash-release.apk
    )
    pause
    exit /b 0
)

echo [!] Flutter CLI not found in PATH.
echo.
echo ========================================================
echo  📱 DIRECT PHONE INSTALL (NO PC COMPILATION NEEDED):
echo ========================================================
echo  1. Ensure phone is on same Wi-Fi as PC.
echo  2. Open Chrome on Android phone:
echo     http://192.168.0.240:3000/login
echo  3. Tap 'Install App' or 'Add to Home Screen'
echo  4. Log in with ID: KV0001 ^& Password: 0007
echo ========================================================
echo.
pause
