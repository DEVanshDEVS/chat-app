#!/bin/bash

# Chat Application Startup Script
echo "🚀 Starting Chat Application..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if required ports are available
echo "🔍 Checking ports..."
if ! check_port 3001; then
    echo "❌ Backend port 3001 is in use. Please stop the existing process or use a different port."
    exit 1
fi

# Start backend server
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
echo "✅ Backend server started (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev -- --host &
FRONTEND_PID=$!
echo "✅ Frontend server started (PID: $FRONTEND_PID)"

# Wait for frontend to start
sleep 5

echo ""
echo "🎉 Chat Application is now running!"
echo "📱 Frontend: http://localhost:5173 (or next available port)"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "💡 Tips:"
echo "   - Open multiple browser tabs to test with multiple users"
echo "   - Check the terminal for server logs"
echo "   - Press Ctrl+C to stop both servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
echo "Press Ctrl+C to stop the servers..."
wait

