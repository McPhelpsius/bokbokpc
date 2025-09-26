#!/bin/bash

# Start development servers for BokBok Fantasy Football
echo "🏈 Starting BokBok Fantasy Football Development Servers"
echo "================================================"

# Check if dependencies are installed
echo "📦 Checking dependencies..."

# Check frontend dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Check backend dependencies
if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server && npm install && cd ..
fi

# Check environment files
if [ ! -f ".env" ]; then
    echo "❌ Missing .env file! Please create one with your Yahoo OAuth credentials."
    echo "See SETUP.md for details."
    exit 1
fi

if [ ! -f ".env.local" ]; then
    echo "❌ Missing .env.local file! Creating one now..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
    echo "✅ Created .env.local"
fi

echo ""
echo "🚀 Starting servers..."
echo "  - Backend API: http://localhost:3001"
echo "  - Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "================================================"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $(jobs -p) 2>/dev/null
    wait
    echo "✅ All servers stopped"
    exit 0
}

# Set up trap for cleanup
trap cleanup INT TERM

# Start backend server in background
echo "🔧 Starting backend server..."
cd server
npm start &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend server in background
echo "🎨 Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
