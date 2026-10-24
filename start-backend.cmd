@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-backend-background.ps1"
if errorlevel 1 (
  echo.
  echo Backend startup failed. Check the message above and data\backend-error.log.
  pause
)
endlocal
