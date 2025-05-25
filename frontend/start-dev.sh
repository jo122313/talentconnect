#!/bin/bash

# Start development servers for both frontend and backend

echo "Starting Talent Connect Gateway Development Servers..."

# Start backend server
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "Starting frontend server..."
cd ../
npm run dev &
FRONTEND_PID=$!

echo "Backend running on http://localhost:5000"
echo "Frontend running on http://localhost:3000"
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait
