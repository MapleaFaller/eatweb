@echo off
rem ============================================================
rem  start-server.bat  (ASCII launcher)
rem  Delegate the real work to start-server.ps1 so that
rem  UTF-8 Chinese messages are decoded correctly.
rem ============================================================
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
if errorlevel 1 (
    echo.
    echo Failed to start the local server. See messages above.
    pause
)
