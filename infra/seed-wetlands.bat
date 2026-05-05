@echo off
REM seed-wetlands.bat - Helper script to seed wetlands data (Windows)

echo.
echo 🌿 WETLABS - Seeding Wetlands Data
echo ==================================
echo.

REM Check if PostgreSQL is accessible
pg_isready -h localhost -p 5433 -U wetlabs >nul 2>&1
if errorlevel 1 (
    echo ❌ PostgreSQL is not running on localhost:5433
    echo    Please start the database first:
    echo    cd infra\docker ^&^& docker-compose up -d postgres
    exit /b 1
)

echo ✅ PostgreSQL is running
echo.

REM Run the migration
echo 📝 Running V8__seed_wetlands.sql migration...
set PGPASSWORD=wetlabs_secret
psql -h localhost -p 5433 -U wetlabs -d wetlabs_db -f "%~dp0migrations\V8__seed_wetlands.sql"

if errorlevel 1 (
    echo.
    echo ❌ Migration failed. Check the error messages above.
    exit /b 1
)

echo.
echo ✅ Migration completed successfully!
echo.
echo 📊 Verifying wetlands data...
psql -h localhost -p 5433 -U wetlabs -d wetlabs_db -c "SELECT wetland_code, wetland_name, region FROM wetlands ORDER BY wetland_code;"

echo.
echo 🎉 Done! Your wetlands table now has 5 records.
echo.
echo Next steps:
echo   1. Restart your web app: cd apps\web ^&^& npm run dev
echo   2. Test Submit Report: http://localhost:5173/report
echo   3. Test Prototype: http://localhost:5173/prototype
echo.

pause
