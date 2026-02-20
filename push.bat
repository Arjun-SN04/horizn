@echo off
cd /d "C:\Users\arjun\Downloads\majorproject\majorproject"

git rm --cached backend/.env 2>nul
git rm --cached frontend/.env 2>nul

git add -A
git commit -m "fix: downgrade express to v4 + multer to v1 to fix Vercel crash, fix upload middleware order"
git push origin main

echo.
echo === Pushed! Vercel will auto-deploy. Wait 1-2 mins then visit: ===
echo https://horizn-2p4lfq3u7-arjun-sn04s-projects.vercel.app/
echo Should show: status ok + frontend URL
pause
