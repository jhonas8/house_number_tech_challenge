#!/bin/bash

echo "🚀 Testing Frontend Hot Reload with Docker"

# Stop any running containers
echo "📦 Stopping existing containers..."
docker-compose down

# Build and run only frontend
echo "🔨 Building and starting frontend with hot reload..."
docker-compose up frontend --build -d

# Wait a moment for the container to start
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker ps | grep -q "snippet-frontend"; then
    echo "✅ Frontend container is running!"
    echo "🌐 Frontend should be available at: http://localhost:3030"
    echo "📝 Make changes to frontend files and they should hot reload automatically"
    echo ""
    echo "📋 Container logs:"
    docker-compose logs frontend
else
    echo "❌ Frontend container failed to start"
    echo "📋 Container logs:"
    docker-compose logs frontend
fi 