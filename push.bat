@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

git add -A
git commit -m "fix: add manual CORS headers middleware as safety net, fix auth-status always returns 200"
git push origin main

echo.
echo === Pushed! Redeploy BACKEND on Vercel (uncheck build cache) ===
pause
