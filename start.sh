#!/usr/bin/env bash
# Starts backend + frontend in the background and writes logs to ./logs
# Usage:
#   ./start.sh          start both (frees ports first)
#   ./start.sh stop     stop both
#   ./start.sh logs     follow both log files (Ctrl+C to exit, servers keep running)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="$ROOT_DIR/logs"

BACKEND_PORT="${BACKEND_PORT:-3000}"
FRONTEND_PORT="${FRONTEND_PORT:-5173}"

mkdir -p "$LOG_DIR"

free_port() {
  local port=$1
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "Port $port in use (PID: $(echo $pids | tr '\n' ' ')) - killing..."
    kill $pids 2>/dev/null
    sleep 1
    pids=$(lsof -ti tcp:"$port" 2>/dev/null)
    [ -n "$pids" ] && kill -9 $pids 2>/dev/null
  fi
}

stop_pidfile() {
  local file="$LOG_DIR/$1.pid"
  if [ -f "$file" ]; then
    # Kill the whole process group (npm -> nodemon/vite -> node)
    kill -- -"$(cat "$file")" 2>/dev/null
    rm -f "$file"
  fi
}

stop_all() {
  stop_pidfile backend
  stop_pidfile frontend
  free_port "$BACKEND_PORT"
  free_port "$FRONTEND_PORT"
  echo "Stopped backend and frontend."
}

case "$1" in
  stop) stop_all; exit 0 ;;
  logs) tail -f "$LOG_DIR/backend.log" "$LOG_DIR/frontend.log"; exit 0 ;;
esac

stop_pidfile backend
stop_pidfile frontend
free_port "$BACKEND_PORT"
free_port "$FRONTEND_PORT"

stamp() { echo "===== Started $(date '+%Y-%m-%d %H:%M:%S') ====="; }

# Backend (setsid detaches it from this terminal)
stamp >> "$LOG_DIR/backend.log"
cd "$ROOT_DIR/backend" && PORT="$BACKEND_PORT" setsid nohup npm run dev \
  >> "$LOG_DIR/backend.log" 2>&1 < /dev/null &
echo $! > "$LOG_DIR/backend.pid"

# Frontend
stamp >> "$LOG_DIR/frontend.log"
cd "$ROOT_DIR/frontend" && setsid nohup npm run dev -- --port "$FRONTEND_PORT" --strictPort \
  >> "$LOG_DIR/frontend.log" 2>&1 < /dev/null &
echo $! > "$LOG_DIR/frontend.pid"

echo "Backend  -> http://localhost:$BACKEND_PORT  (log: logs/backend.log)"
echo "Frontend -> http://localhost:$FRONTEND_PORT  (log: logs/frontend.log)"
echo "Follow logs: ./start.sh logs   |   Stop: ./start.sh stop"
