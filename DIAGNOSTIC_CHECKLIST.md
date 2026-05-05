# 🔍 DIAGNOSTIC CHECKLIST

## Before You Start

Run this command to verify the file is correct:
```bash
type "apps\web\src\components\dashboard\SearchBar.tsx" | findstr "Filter by wetland"
```

**Expected output:**
```
placeholder="Filter by wetland, region, or observation..."
```

If you see this ✅ File is correct, proceed to cache clearing.

---

## Step-by-Step Verification

### ☐ Step 1: Stop Server
```bash
# In terminal where npm run dev is running
Ctrl+C
```
**Verify:** Terminal shows server stopped

### ☐ Step 2: Navigate to Web Folder
```bash
cd apps/web
```
**Verify:** Terminal prompt shows you're in apps/web

### ☐ Step 3: Delete Vite Cache
```bash
rmdir /s /q node_modules\.vite
```
**Verify:** Command completes without errors

### ☐ Step 4: Restart Server
```bash
npm run dev
```
**Verify:** Terminal shows:
```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5174/
```

### ☐ Step 5: Close Browser
- Close ALL browser windows
- Wait 5 seconds

### ☐ Step 6: Open Incognito
```
Press Ctrl+Shift+N (Chrome)
or Ctrl+Shift+P (Firefox)
```
**Verify:** New incognito window opens

### ☐ Step 7: Navigate to Dashboard
```
Type in address bar: localhost:5174/dashboard
Press Enter
```
**Verify:** Dashboard loads

### ☐ Step 8: Check Placeholder
Look at the search bar at the top.

**Should say:**
```
"Filter by wetland, region, or observation..."
```

**Should NOT say:**
```
"Search Wetlands, Watersheds, Regions, Districts, Severity..."
```

### ☐ Step 9: Open Console
```
Press F12
Click "Console" tab
```

### ☐ Step 10: Check Console Logs
**Should see:**
```
[SearchBar] Fetched wetlands: X
[SearchBar] Wetland options: [...]
```

If you see these ✅ SearchBar is loaded!

### ☐ Step 11: Test Search
```
Type "Lake" in search bar
```

**Console should show:**
```
[SearchBar] Query: Lake Results: 1
```

### ☐ Step 12: Test Dropdown
After typing "Lake", look for a dark dropdown box below the search bar.

**Should see:**
- Dark background (not white)
- "Lake Victoria Basin" text
- "Wetland" badge

### ☐ Step 13: Press Enter
```
Press Enter key
```

**Console should show:**
```
[SearchBar] Selected: {...}
[SearchBar] Selected wetland: lake_victoria_basin
```

### ☐ Step 14: Check Analytics
Look at the right panel (Analytics).

**Should show:**
- Wetland code: lake_victoria_basin
- NDVI and NDWI values
- Charts

---

## Troubleshooting

### If Step 3 Fails (Can't Delete Cache)
```bash
# Try this instead
cd apps/web
rd /s node_modules\.vite
# Press Y when asked to confirm
```

### If Step 8 Still Shows Old Text
```bash
# More aggressive approach
cd apps/web
rmdir /s /q node_modules\.vite
rmdir /s /q dist
del /q package-lock.json
npm install
npm run dev
```

### If Console Shows No Logs
The SearchBar component isn't loading. Check:
1. Is the import path correct?
2. Are there any errors in console?
3. Did Vite rebuild the files?

### If Dropdown Doesn't Appear
The dropdown might be rendering but invisible. Try:
1. Press F12 → Elements tab
2. Search for "Lake Victoria Basin"
3. If found, check its CSS styles

---

## Success Criteria

✅ All 14 steps completed
✅ Placeholder says "Filter by wetland..."
✅ Console shows [SearchBar] logs
✅ Dropdown appears when typing
✅ Enter key selects result
✅ Analytics panel updates

## If All Steps Pass

🎉 **SUCCESS!** Everything is working!

Now test the other features:
- Click "Quick Export" button
- Click "Set AOI" button
- Click "Add Data" button
- Click wetland boundaries on map

All modals should appear centered on screen.

---

## Report Back

After completing all steps, tell me:
1. Which step failed (if any)?
2. What does the placeholder text say?
3. What does console show?
4. Screenshot if needed

This will help me diagnose any remaining issues.
