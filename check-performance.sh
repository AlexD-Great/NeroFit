#!/bin/bash

echo "🔍 NeroFit Performance Check"
echo "================================"

# Check if ports are in use
echo "📡 Port Status:"
if lsof -ti:3001 > /dev/null 2>&1; then
    echo "✅ Backend (3001): Running"
else
    echo "❌ Backend (3001): Not running"
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Frontend (3000): Running"
else
    echo "❌ Frontend (3000): Not running"
fi

echo ""

# Check backend health
echo "🔧 Backend Health:"
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend API: Responding"
    echo "📊 Response: $(curl -s http://localhost:3001/health)"
else
    echo "❌ Backend API: Not responding"
fi

echo ""

# Check frontend accessibility
echo "🎨 Frontend Status:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ Frontend: Accessible"
else
    echo "❌ Frontend: Not accessible"
fi

echo ""

# Memory usage
echo "💾 Memory Usage:"
echo "Node processes:"
ps aux | grep node | grep -v grep | awk '{print $2, $3, $4, $11}' | head -5

echo ""
echo "🚀 Performance Tips:"
echo "- Use 'npm run dev:fast' for faster development builds"
echo "- Clear browser cache if pages load slowly"
echo "- Restart servers if memory usage is high" 