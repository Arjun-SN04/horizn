@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

git add -A
git commit -m "fix: frontend build - relative src path in index.html, node engine version, vercelignore"
git push origin main

echo.
echo === Pushed! Now go Vercel and Redeploy the frontend project ===
pause
