@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

git add -A
git commit -m "fix: swap ExpressError args (statusCode first), replace throw with next() in validators"
git push origin main

echo.
echo === Pushed! Wait for Vercel to auto-deploy (~1 min) ===
echo Then visit: https://horizn-2p4lfq3u7-arjun-sn04s-projects.vercel.app/
echo Should show: status ok + frontend URL
pause
