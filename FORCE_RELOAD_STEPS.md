# FORCE RELOAD - Step by Step

## The Problem
Your screenshot shows the OLD placeholder text, which means the SearchBar component is NOT loading.

## Solution - Follow EXACTLY

### Step 1: Stop Dev Server
```
In your terminal:
Press Ctrl+C
Wait for it to stop completely
```

### Step 2: Delete Vite Cache
```
In terminal, run:
cd apps/web
rmdir /s /q node_modules\.vite
```

### Step 3: Restart Dev Server
```
npm run dev
```

### Step 4: Close Browser Completely
```
Close ALL browser windows
Wait 5 seconds
```

### Step 5: Open Incognito Window
```
Open browser
Press Ctrl+Shift+N (Chrome) or Ctrl+Shift+P (Firefox)
Go to: localhost:5174/dashboard
```

### Step 6: Check Placeholder Text
Look at the search bar. It should say:
```
"Filter by wetland, region, or observation..."
```

NOT:
```
"Search Wetlands, Watersheds, Regions, Districts, Severity..."
```

## If It Still Shows Old Text

Run this command and share the output:
```bash
type "apps\web\src\components\dashboard\SearchBar.tsx" | findstr "placeholder"
```

This will show what placeholder text is in the file.
