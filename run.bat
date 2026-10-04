@echo off
title StudyPulse - Student Task Planner App
cls
echo ====================================================================
echo               StudyPulse - Student Task Planner App
echo ====================================================================
echo.
echo [1/3] Checking MongoDB service...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL% equ 0 (
    echo       MongoDB service is currently RUNNING.
) else (
    echo       Starting MongoDB service...
    net start MongoDB >nul 2>&1
)

echo.
echo [2/3] Preparing to open browser at http://localhost:5173 ...
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"

echo.
echo [3/3] Launching Backend API & Frontend Client simultaneously...
echo --------------------------------------------------------------------
echo Press CTRL+C at any time in this window to stop both servers.
echo --------------------------------------------------------------------
echo.

npm run dev
pause
