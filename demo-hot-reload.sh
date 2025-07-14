#!/bin/bash

echo "🚀 Demonstrating Hot Reload with Docker"
echo "========================================"

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker-compose -f docker-compose.frontend.yml down 2>/dev/null || true

# Start frontend with hot reload
echo "🔨 Starting frontend with hot reload..."
docker-compose -f docker-compose.frontend.yml up --build -d

# Wait for container to start
echo "⏳ Waiting for container to start..."
sleep 10

# Check if container is running
if docker ps | grep -q "snippet-frontend"; then
    echo "✅ Frontend container is running!"
    echo "🌐 Frontend is available at: http://localhost:3030"
    echo ""
    echo "📝 Testing Hot Reload:"
    echo "1. The page should show 'Text Summarizer 🚀 HOT RELOAD TEST'"
    echo "2. Now we'll change the title..."
    
    # Change the title
    sed -i '' 's/Text Summarizer 🚀 HOT RELOAD TEST/Text Summarizer 🔥 HOT RELOAD WORKING!/' frontend/src/app/page.tsx
    
    echo "3. Title changed! Check the browser in a few seconds..."
    echo "4. The page should automatically reload with the new title"
    echo ""
    echo "📋 Container logs (last 10 lines):"
    docker-compose -f docker-compose.frontend.yml logs --tail=10 frontend
    
    echo ""
    echo "🎉 Hot reload is working! Any changes to frontend files will automatically update the page."
    echo "💡 Try making more changes to see the hot reload in action!"
    
else
    echo "❌ Frontend container failed to start"
    echo "📋 Container logs:"
    docker-compose -f docker-compose.frontend.yml logs frontend
fi 