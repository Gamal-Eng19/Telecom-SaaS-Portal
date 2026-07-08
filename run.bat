@echo off
echo ==========================================
echo Starting Telecom SaaS - Backend & Frontend
echo ==========================================

:: تشغيل الباك إند
start "Backend API" cmd /k "cd Backend && dotnet run"

:: تشغيل الفرونت إند
start "Frontend (Views)" cmd /k "cd views && npm run dev"

exit