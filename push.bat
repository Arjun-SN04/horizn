@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

echo === Removing .env from git tracking ===
git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

echo === Staging all changes ===
git add -A

echo === Committing ===
git commit -m "fix: Vercel internal server error - guard app.listen, safe MongoStore init, health check route"

echo === Pushing ===
git push origin main

echo.
echo === Done! Now go to Vercel dashboard and Redeploy ===
pause
