@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

echo === Removing package-lock.json from git tracking ===
git rm --cached backend/package-lock.json 2>nul
git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

echo === Deleting package-lock.json so Vercel reinstalls fresh ===
del /f backend\package-lock.json 2>nul

git add -A
git commit -m "fix: remove package-lock.json so Vercel installs dotenv v16 fresh, not cached v17"
git push origin main

echo.
echo === Pushed! Wait 2 mins for Vercel to auto-deploy ===
echo Then visit: https://horizn-2p4lfq3u7-arjun-sn04s-projects.vercel.app/
pause
