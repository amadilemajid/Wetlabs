@echo off
echo ========================================
echo CLEARING ALL CACHES - NUCLEAR OPTION
echo ========================================
echo.

cd /d "c:\Users\AMADILE MAJID\Wetlabs\apps\web"

echo [1/5] Stopping Vite dev server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Deleting Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo     - Vite cache deleted
) else (
    echo     - No Vite cache found
)

echo [3/5] Deleting dist folder...
if exist "dist" (
    rmdir /s /q "dist"
    echo     - Dist folder deleted
) else (
    echo     - No dist folder found
)

echo [4/5] Clearing npm cache...
call npm cache clean --force
echo     - NPM cache cleared

echo [5/5] Starting fresh dev server...
echo.
echo ========================================
echo CACHE CLEARED! Starting dev server...
echo ========================================
echo.
echo IMPORTANT: After server starts:
echo 1. Open Chrome in INCOGNITO mode (Ctrl+Shift+N)
echo 2. Go to http://localhost:5173/dashboard
echo 3. Test the SearchBar
echo.

call npm run dev
