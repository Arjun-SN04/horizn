@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul
git rm --cached backend/package-lock.json 2>nul

git add -A
git commit -m "fix: downgrade dotenv to v16, express to v4, multer to v1 - fix Vercel crash"
git push origin main

echo.
echo === Pushed! Wait 2 mins for Vercel to auto-deploy ===
echo Then visit: https://horizn-2p4lfq3u7-arjun-sn04s-projects.vercel.app/
pause
