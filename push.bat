@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

git add -A
git commit -m "fix: CORS headers set before everything else, OPTIONS handled instantly, health check shows FRONTEND_URL"
git push origin main

echo.
echo === PUSHED! ===
echo.
echo Now go to: https://github.com/Arjun-SN04/horizn
echo Check that backend/app.js shows the new code
echo.
echo Then Vercel will auto-deploy. After it finishes visit:
echo https://horizn-2p4lfq3u7-arjun-sn04s-projects.vercel.app/
echo It should show: "frontend":"https://horizn-og89.vercel.app"
echo.
pause
