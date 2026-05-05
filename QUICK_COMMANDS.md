# 🚀 QUICK COMMANDS - Copy & Paste

## Run These Commands in Order

```bash
# Stop server (Ctrl+C in terminal)

# Navigate to web folder
cd apps/web

# Delete Vite cache
rmdir /s /q node_modules\.vite

# Restart server
npm run dev
```

## Then in Browser

```
1. Close all tabs
2. Press Ctrl+Shift+N (Incognito)
3. Go to: localhost:5174/dashboard
4. Login if needed
5. Check search bar placeholder text
```

## Expected Result

Search bar should say:
```
"Filter by wetland, region, or observation..."
```

NOT:
```
"Search Wetlands, Watersheds, Regions, Districts, Severity..."
```

## If Still Wrong

```bash
# More aggressive cache clear
cd apps/web
rmdir /s /q node_modules\.vite
rmdir /s /q dist
npm run dev
```

## Verification

Open Console (F12) and type "Lake" in search:
```
Should see:
[SearchBar] Fetched wetlands: X
[SearchBar] Query: Lake Results: 1
```

---

**TL;DR:** Delete `node_modules\.vite` folder and restart server
