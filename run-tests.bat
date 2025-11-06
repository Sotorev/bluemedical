@echo off
echo ================================
echo Running All Tests
echo ================================
echo.

REM Backend usa Docker (requiere MySQL)
echo 1. Running Backend Tests (with Docker + MySQL)...
docker compose -f docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from backend-test backend-test mysql-test
set backend_exit=%errorlevel%
docker compose -f docker-compose.test.yml down -v

REM Frontend sin Docker (solo unitarios)
echo.
echo 2. Running Frontend Tests (npm)...
cd frontend
call npm ci --silent
call npm run test:coverage --silent
set frontend_exit=%errorlevel%
cd ..

REM Mobile App sin Docker (solo unitarios)
echo.
echo 3. Running Mobile App Tests (npm)...
cd mobile-app
call npm ci --silent
call npm run testFinal --silent
set mobile_exit=%errorlevel%
cd ..

echo.
echo ================================
echo Test Results:
echo ================================
if %backend_exit% equ 0 (
    echo Backend Tests ^(Docker^): PASSED
) else (
    echo Backend Tests ^(Docker^): FAILED
)

if %frontend_exit% equ 0 (
    echo Frontend Tests ^(npm^):   PASSED
) else (
    echo Frontend Tests ^(npm^):   FAILED
)

if %mobile_exit% equ 0 (
    echo Mobile Tests ^(npm^):     PASSED
) else (
    echo Mobile Tests ^(npm^):     FAILED
)
echo.

if %backend_exit% equ 0 if %frontend_exit% equ 0 if %mobile_exit% equ 0 (
    echo All tests passed!
    exit /b 0
) else (
    echo Some tests failed!
    exit /b 1
)

