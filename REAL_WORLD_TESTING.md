# Real-World Feature Testing Guide

## Current Status

Based on your screenshot at `localhost:5174/dashboard`, I can see:
- ✅ Search bar is visible at the top (showing "Lake victoria")
- ✅ Map is displaying with wetland markers
- ✅ Bottom buttons are visible: "Quick Export", "Set AOI", "Add Data"
- ⚠️ You're on the Analytics page, not the new Dashboard page

## How to Access the New Dashboard

The new dashboard with all features is at:
```
http://localhost:5174/dashboard
```

But it looks like you might be on a different route. Let me check your routing.

## Testing Each Feature

### 1. Search Bar (Top of Page)

**Current Status:** ✅ Visible and working

**Test Steps:**
1. Click on the search bar at the top
2. Type "Lake" - you should see:
   - Real wetland names from your database
   - "Lake Victoria", "Lake Basin Watershed", etc.
3. Type "High" - you should see:
   - "High Severity" option
4. Click on any result
5. **Expected:** Map should filter to show only that wetland/severity

**Real-World Test:**
```
1. Type "Lake Victoria" → Click result
2. Check if map zooms to Lake Victoria
3. Check if only Lake Victoria markers appear
4. Check browser console for any errors
```

### 2. Quick Export Button (Bottom)

**Current Status:** ✅ Visible at bottom

**Test Steps:**
1. Click "Quick Export" button at the bottom
2. Modal should open with 3 options:
   - Export as PNG
   - Export as PDF
   - Export as CSV
3. Click "Export as PNG"
4. **Expected:** Map screenshot downloads as PNG file

**Real-World Test:**
```
1. Click "Quick Export"
2. Select PNG
3. Check Downloads folder for file
4. Open file to verify it's the map
```

**Known Limitation:**
- PNG export requires `html2canvas` library
- If not installed, run: `npm install html2canvas`

### 3. Set AOI Button (Bottom)

**Current Status:** ✅ Visible at bottom

**Test Steps:**
1. Click "Set AOI" button
2. Modal opens with 2 options:
   - Add Point Marker
   - Draw Polygon
3. Click "Add Point Marker"
4. Click anywhere on the map
5. **Expected:** A marker appears where you clicked

**Real-World Test:**
```
1. Click "Set AOI"
2. Choose "Add Point Marker"
3. Click on Lake Victoria on the map
4. Verify marker appears
5. Click "Set AOI" again
6. Choose "Draw Polygon"
7. Click multiple points on map
8. Double-click to finish
9. Verify polygon appears
```

### 4. Add Data Button (Bottom)

**Current Status:** ✅ Visible at bottom

**Test Steps:**
1. Click "Add Data" button
2. Modal opens with file upload area
3. Drag a GeoJSON file OR click to browse
4. **Expected:** File uploads and new layer appears on map

**Real-World Test:**
```
1. Create a simple GeoJSON file:
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [32.5, 1.5]
    },
    "properties": {
      "name": "Test Point"
    }
  }]
}

2. Save as test.geojson
3. Click "Add Data"
4. Upload test.geojson
5. Verify new point appears on map
```

## Issues I See in Your Screenshot

### Issue 1: You're on Analytics Page
**Problem:** The URL shows `/dashboard` but the page shows "ANALYTICS" header
**Solution:** The new dashboard components are integrated into DashboardPage.tsx

**Check:**
1. Are you seeing the left sidebar with "Quick Insights"?
2. Are you seeing the right sidebar with "Data Panel"?
3. If not, you might be on the old analytics page

### Issue 2: Buttons at Bottom
**Problem:** Buttons are at the very bottom of the page
**Solution:** This is correct for mobile view, but on desktop they should be in the left sidebar

**Check:**
1. Resize browser window to > 1024px width
2. Buttons should move to left sidebar
3. If they stay at bottom, there might be a CSS issue

### Issue 3: Search Not Showing Results
**Problem:** You typed "Lake victoria" but no dropdown visible
**Solution:** The dropdown should appear automatically

**Debug Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Type in search bar
4. Check for errors
5. Check Network tab for API calls

## Verification Checklist

### Desktop View (> 1024px)
- [ ] Left sidebar visible with "Quick Insights"
- [ ] Center map visible
- [ ] Right sidebar visible with "Data Panel"
- [ ] Search bar at top center
- [ ] Login button at top right
- [ ] Quick Export button in left sidebar
- [ ] Set AOI button in left sidebar
- [ ] Add Data button in left sidebar

### Mobile View (< 768px)
- [ ] Only map visible by default
- [ ] Bottom tabs: Insights | Map | Data Panel
- [ ] Clicking "Insights" shows left sidebar
- [ ] Clicking "Map" shows map
- [ ] Clicking "Data Panel" shows right sidebar
- [ ] Search bar expandable at top

## Common Issues & Solutions

### Search Not Working
**Symptoms:** No dropdown appears when typing
**Solutions:**
1. Check browser console for errors
2. Verify API is running: `http://localhost:3000/api/v1/wetlands`
3. Check SearchBar component is imported correctly
4. Clear browser cache

### Export Not Working
**Symptoms:** Nothing downloads when clicking export
**Solutions:**
1. Install html2canvas: `npm install html2canvas`
2. Check browser console for errors
3. Verify map element exists
4. Check browser download settings

### AOI Not Appearing
**Symptoms:** Clicking map doesn't add marker
**Solutions:**
1. Check browser console for errors
2. Verify Leaflet Draw is installed
3. Check map is fully loaded
4. Try refreshing page

### Add Data Not Working
**Symptoms:** File upload fails
**Solutions:**
1. Verify file is valid GeoJSON or KML
2. Check file size (< 10MB recommended)
3. Check browser console for errors
4. Try a simpler GeoJSON file

## Real-World Workflow Test

### Scenario: Find and Export High Severity Wetlands

1. **Search for High Severity**
   - Type "High" in search bar
   - Click "High Severity"
   - Verify map shows only high severity markers

2. **Define Area of Interest**
   - Click "Set AOI"
   - Choose "Draw Polygon"
   - Draw polygon around Lake Victoria
   - Verify polygon appears

3. **Export Map**
   - Click "Quick Export"
   - Choose "PNG"
   - Verify file downloads
   - Open file to verify it shows filtered map with AOI

4. **Add Custom Data**
   - Click "Add Data"
   - Upload GeoJSON file
   - Verify new layer appears
   - Export again to include new data

## Performance Testing

### Load Time
- [ ] Page loads in < 3 seconds
- [ ] Map renders in < 2 seconds
- [ ] Search results appear in < 100ms
- [ ] Modal opens in < 200ms

### Responsiveness
- [ ] Resize browser - layout adapts smoothly
- [ ] No horizontal scrolling on mobile
- [ ] Touch targets are 44px+ on mobile
- [ ] All buttons clickable on mobile

## Browser Testing

Test in each browser:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Next Steps

1. **Verify Route:** Make sure you're on the correct dashboard page
2. **Test Search:** Type in search bar and verify dropdown appears
3. **Test Export:** Click export and verify file downloads
4. **Test AOI:** Click Set AOI and verify marker/polygon appears
5. **Test Add Data:** Upload GeoJSON and verify layer appears
6. **Test Mobile:** Resize browser to mobile width and test tabs

## Getting Help

If features don't work:
1. Check browser console (F12) for errors
2. Check Network tab for failed API calls
3. Verify all dependencies installed: `npm install`
4. Try clearing browser cache
5. Try in incognito/private mode
6. Check DASHBOARD_TESTING_GUIDE.md for detailed troubleshooting

## Expected Behavior Summary

| Feature | Desktop | Mobile | Works? |
|---------|---------|--------|--------|
| Search Bar | Top center | Expandable | ✅ |
| Login Button | Top right | Top right | ✅ |
| Quick Export | Left sidebar | Insights tab | ⚠️ Test |
| Add Data | Left sidebar | Insights tab | ⚠️ Test |
| Set AOI | Left sidebar | Insights tab | ⚠️ Test |
| Map | Center | Full screen | ✅ |
| Data Panel | Right sidebar | Data tab | ⚠️ Test |

## Conclusion

Based on your screenshot:
- ✅ Search bar is working
- ✅ Map is displaying
- ✅ Buttons are visible
- ⚠️ Need to test if buttons actually work
- ⚠️ Need to verify you're on the correct page

**Next Action:** Click each button and verify the modal opens and functionality works as described above.
