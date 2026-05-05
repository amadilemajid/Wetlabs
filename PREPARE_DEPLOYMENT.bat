@echo off
echo ========================================
echo   WetLabs Deployment Preparation
echo ========================================
echo.

echo Step 1: Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo [OK] Git is installed
echo.

echo Step 2: Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js is installed
echo.

echo Step 3: Creating deployment environment templates...
echo.

REM Create API production environment template
(
echo # -- Server ----------------------------------------------------
echo NODE_ENV=production
echo PORT=3001
echo.
echo # -- Database ^(Replace with your Neon URL^) ------------------
echo DATABASE_URL=postgresql://user:password@host:5432/database
echo.
echo # -- Redis ^(Replace with your Upstash URL^) -----------------
echo REDIS_URL=redis://default:password@host:port
echo.
echo # -- RabbitMQ ^(Replace with your CloudAMQP URL^) ------------
echo RABBITMQ_URL=amqp://user:password@host:port/vhost
echo.
echo # -- Auth ------------------------------------------------------
echo JWT_PRIVATE_KEY_BASE64=YOUR_JWT_PRIVATE_KEY
echo JWT_PUBLIC_KEY_BASE64=YOUR_JWT_PUBLIC_KEY
echo JWT_EXPIRES_IN=3600
echo.
echo # -- Security --------------------------------------------------
echo MSISDN_PEPPER=YOUR_PEPPER_HERE
echo AT_USSD_HMAC_SECRET=YOUR_HMAC_SECRET
echo INTERNAL_API_KEY=YOUR_INTERNAL_API_KEY
echo.
echo # -- CORS ------------------------------------------------------
echo CORS_ORIGIN=https://your-frontend-domain.vercel.app
) > apps\api\.env.production.template

echo [OK] Created apps/api/.env.production.template
echo.

REM Create Web production environment template
(
echo # Replace with your deployed API URL
echo VITE_API_BASE_URL=https://your-api-domain.onrender.com/api/v1
echo VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
echo VITE_MAP_SATELLITE_URL=https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
echo VITE_INTERNAL_API_KEY=YOUR_INTERNAL_API_KEY
) > apps\web\.env.production.template

echo [OK] Created apps/web/.env.production.template
echo.

REM Create Vercel configuration
(
echo {
echo   "version": 2,
echo   "builds": [
echo     {
echo       "src": "apps/web/package.json",
echo       "use": "@vercel/static-build",
echo       "config": {
echo         "distDir": "dist"
echo       }
echo     }
echo   ]
echo }
) > vercel.json

echo [OK] Created vercel.json
echo.

REM Create Render build script
(
echo #!/bin/bash
echo echo "Installing dependencies..."
echo npm install
echo.
echo echo "Building TypeScript..."
echo npm run build
echo.
echo echo "Build complete!"
) > apps\api\render-build.sh

echo [OK] Created apps/api/render-build.sh
echo.

echo Step 4: Creating .gitignore entries...
echo.

REM Add to .gitignore if not already there
findstr /C:".env.production" .gitignore >nul 2>&1
if errorlevel 1 (
    echo .env.production >> .gitignore
    echo [OK] Added .env.production to .gitignore
) else (
    echo [OK] .env.production already in .gitignore
)

echo.
echo ========================================
echo   Preparation Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Sign up for free services:
echo    - Vercel: https://vercel.com/signup
echo    - Render: https://render.com/register
echo    - Neon: https://neon.tech/
echo    - Upstash: https://upstash.com/
echo    - CloudAMQP: https://www.cloudamqp.com/
echo.
echo 2. Get connection strings from each service
echo.
echo 3. Fill in the environment templates:
echo    - apps/api/.env.production.template
echo    - apps/web/.env.production.template
echo.
echo 4. Rename templates to .env.production
echo.
echo 5. Push to GitHub:
echo    git init
echo    git add .
echo    git commit -m "Initial commit"
echo    git remote add origin YOUR_GITHUB_URL
echo    git push -u origin main
echo.
echo 6. Follow DEPLOYMENT_GUIDE.md for detailed instructions
echo.
echo ========================================
pause
