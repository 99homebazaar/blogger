#!/bin/bash

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Starting Blogger..."

# Start backend
cd "$ROOT/server" && npm run dev &
BACKEND_PID=$!

# Start frontend
cd "$ROOT" && npm run dev &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
