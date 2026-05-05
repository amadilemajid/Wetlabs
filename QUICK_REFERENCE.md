# 🚀 QUICK REFERENCE - Essential Commands

## To See Your Changes NOW

```bash
# 1. Stop server
Ctrl+C

# 2. Restart server
npm run dev

# 3. In browser
Ctrl+Shift+R (hard refresh)

# 4. Open console
F12
```

## What to Test

```
Type "Lake" → See dropdown → Press Enter → Analytics updates
```

## Console Should Show

```
[SearchBar] Fetched wetlands: 10
[SearchBar] Query: Lake Results: 2
[SearchBar] Selected wetland: lake_victoria_basin
```

## If Still Not Working

```bash
# Nuclear option
Ctrl+C (stop server)
rm -rf node_modules/.vite (delete cache)
npm run dev (restart)
Open Incognito mode
```

## Files to Check

- ✅ SearchBar.tsx (has createPortal)
- ✅ DashboardPage.tsx (imports SearchBar)
- ✅ All modals (have z-index 9999)

## Status

**Code:** ✅ Done
**Issue:** Browser cache
**Fix:** Hard refresh!

---

**TL;DR:** Press Ctrl+Shift+R and open Console (F12)
