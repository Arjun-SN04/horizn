@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

echo.
echo === Removing .env files from git tracking (keeping local copies) ===
git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

echo.
echo === Staging all changes ===
git add -A

echo.
echo === Committing ===
git commit -m "fix: Vercel deployment ready - CORS, session cookies, app.listen guard, module.exports, env-based API URL"

echo.
echo === Pushing to GitHub ===
git push origin main

echo.
echo ============================================
echo   Done! Now deploy on Vercel (see steps)
echo ============================================
pause
