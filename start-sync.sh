#!/bin/bash

# Auto-Sync Startup Script
echo "🚀 Starting Two-Way GitHub Sync System..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start sync server in background
echo "🔄 Starting sync server..."
node sync-server.js &
SYNC_PID=$!

echo "✅ Sync system started!"
echo "🌐 Server: http://localhost:3001"
echo "🔄 Auto-sync: Every 5 minutes"
echo "📝 PID: $SYNC_PID"

# Save PID for later cleanup
echo $SYNC_PID > sync.pid

echo "To stop: kill \$(cat sync.pid)"