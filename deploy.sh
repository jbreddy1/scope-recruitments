#!/bin/bash

# SCOPE Club Recruitment Website - Deployment Script
# This script helps prepare and deploy the application

echo "🚀 SCOPE Club Recruitment Website - Deployment Script"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

echo "✅ Dependencies installed successfully!"

# Check if config.env exists
if [ ! -f "backend/config.env" ]; then
    echo "⚠️  Warning: config.env not found!"
    echo "📝 Please create backend/config.env with your MongoDB connection string"
    echo "💡 You can copy from backend/config.env.example"
    exit 1
fi

echo "✅ Environment configuration found!"

# Test the application locally
echo "🧪 Testing application locally..."
cd backend
npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Test if server is running
if curl -s http://localhost:5000 > /dev/null; then
    echo "✅ Local server test successful!"
else
    echo "❌ Local server test failed!"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Stop the test server
kill $SERVER_PID 2>/dev/null

echo ""
echo "🎉 Application is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "2. Choose your deployment platform:"
echo "   - Render (Recommended): https://render.com"
echo "   - Railway: https://railway.app"
echo "   - Heroku: https://heroku.com"
echo "   - Vercel: https://vercel.com"
echo ""
echo "3. Follow the detailed instructions in DEPLOYMENT_GUIDE.md"
echo ""
echo "🔗 Your application will be available at the platform's URL once deployed!" 