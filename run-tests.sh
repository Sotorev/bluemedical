#!/bin/bash

echo "================================"
echo "Running All Tests"
echo "================================"
echo ""

# Backend usa Docker (requiere MySQL)
echo "1. Running Backend Tests (with Docker + MySQL)..."
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from backend-test backend-test mysql-test
backend_exit=$?
docker compose -f docker-compose.test.yml down -v

# Frontend sin Docker (solo unitarios)
echo ""
echo "2. Running Frontend Tests (npm)..."
cd frontend
npm ci --silent
npm run test:coverage --silent
frontend_exit=$?
cd ..

# Mobile App sin Docker (solo unitarios)
echo ""
echo "3. Running Mobile App Tests (npm)..."
cd mobile-app
npm ci --silent
npm run testFinal --silent
mobile_exit=$?
cd ..

echo ""
echo "================================"
echo "Test Results:"
echo "================================"
echo "Backend Tests (Docker): $([ $backend_exit -eq 0 ] && echo '✓ PASSED' || echo '✗ FAILED')"
echo "Frontend Tests (npm):   $([ $frontend_exit -eq 0 ] && echo '✓ PASSED' || echo '✗ FAILED')"
echo "Mobile Tests (npm):     $([ $mobile_exit -eq 0 ] && echo '✓ PASSED' || echo '✗ FAILED')"
echo ""

if [ $backend_exit -eq 0 ] && [ $frontend_exit -eq 0 ] && [ $mobile_exit -eq 0 ]; then
    echo "✓ All tests passed!"
    exit 0
else
    echo "✗ Some tests failed!"
    exit 1
fi

