#!/bin/bash

# Start NeroFit Development Environment
echo "🚀 Starting NeroFit Development Environment..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
echo "📡 Starting backend server on port 3001..."
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server on port 3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 3

echo "✅ Development environment ready!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "📊 Backend Health: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait 