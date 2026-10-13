@echo off
title Tawfiq Industries - Backend Server
echo ========================================================
echo   TAWFIQ INDUSTRIES - Laravel Backend API Server
echo ========================================================
echo.
cd /d "%~dp0"

if exist "backend" (
    cd backend
)

if exist "C:\xampp\php\php.exe" (
    echo [OK] Using PHP from: C:\xampp\php\php.exe
    echo [OK] Backend API starting at http://127.0.0.1:8000
    echo.
    "C:\xampp\php\php.exe" artisan serve --port=8000
) else (
    echo Running with system php...
    php artisan serve --port=8000
)

pause
