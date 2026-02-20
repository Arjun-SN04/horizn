@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

git add -A
git commit -m "fix: CORS - rebuild allowed origins per request, add OPTIONS preflight handler"
git push origin main

echo.
echo === Pushed! Now REDEPLOY the BACKEND on Vercel ===
pause
