#!/bin/bash

# NeroFit Development Startup Script
echo "🚀 Starting NeroFit Development Environment..."

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Set development environment variables
export NEXT_TELEMETRY_DISABLED=1
export DISABLE_ESLINT_PLUGIN=true
export FAST_REFRESH=true
export NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Kill any existing processes on ports 3000 and 3001
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait a moment for ports to be freed
sleep 2

# Start backend server
echo "🔧 Starting backend server on port 3001..."
cd "$SCRIPT_DIR/backend" && PORT=3001 node src/server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend server with optimizations
echo "⚡ Starting frontend server on port 3000..."
cd "$SCRIPT_DIR/frontend" && npm run dev:fast &
FRONTEND_PID=$!

echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    echo "✅ All servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait 