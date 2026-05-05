#!/bin/bash
set -e

echo "🚀 Starting Render build process..."

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building TypeScript..."
npm run build

echo "✅ Build complete!"
echo "📁 Build output in: dist/"

ls -la dist/ || echo "Warning: dist directory not found"

echo "🎉 Ready to start!"
