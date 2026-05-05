# WetLabs Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
cd apps/web
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
```
http://localhost:5173
```

### Step 4: Test Features
- ✓ Search bar at top
- ✓ Login button at top right
- ✓ Export button in left sidebar
- ✓ Add Data button in left sidebar
- ✓ Set AOI button in left sidebar
- ✓ Mobile tabs at bottom (on mobile)

---

## 📱 Testing on Different Devices

### Desktop (1920x1080)
```bash
# Open browser at full width
# All three panels visible
# Full functionality
```

### Tablet (768x1024)
```bash
# Use browser DevTools
# Press F12 → Toggle device toolbar
# Select iPad or tablet preset
# Two-column layout visible
```

### Mobile (375x812)
```bash
# Use browser DevTools
# Press F12 → Toggle device toolbar
# Select iPhone or mobile preset
# Tab-based navigation at bottom
```

---

## 🔍 Feature Quick Test

### Search Bar
1. Click search input at top
2. Type "Lake" → See Lake Victoria, Lake Basin
3. Type "High" → See High Severity
4. Click result → Map updates

### Quick Export
1. Click "Quick Export" button (left sidebar)
2. Choose PNG, PDF, or CSV
3. File downloads automatically

### Add Data
1. Click "Overlay" button (left sidebar)
2. Drag GeoJSON file or click to browse
3. File uploads and appears on map

### Set AOI
1. Click "AOI" button (left sidebar)
2. Choose "Add Point Marker" or "Draw Polygon"
3. Click on map to place marker or draw polygon
4. AOI appears on map

### Mobile Tabs
1. Resize browser to mobile width
2. Click "Insights" tab → See charts and export
3. Click "Map View" tab → See full map
4. Click "Data Panel" tab → See layers and filters

---

## 📁 File Structure

```
apps/web/src/
├── components/
│   └── dashboard/
│       ├── SearchBar.tsx          ← Search functionality
│       ├── QuickExport.tsx        ← Export maps/data
│       ├── AddData.tsx            ← Upload spatial data
│       ├── SetAOI.tsx             ← Area of Interest
│       └── DashboardHeader.tsx    ← Responsive header
│
├── pages/
│   └── DashboardPage.tsx          ← Main dashboard (UPDATED)
│
├── stores/
│   ├── filter.store.ts            ← Filter state
│   └── ui.store.ts                ← UI state
│
└── hooks/
    └── useToast.ts                ← Toast notifications
```

---

## 🎨 Customization

### Change Colors
Edit `DashboardPage.tsx`:
```tsx
// Change primary color from teal to blue
className="bg-blue-800 hover:bg-blue-900"
```

### Add More Search Options
Edit `SearchBar.tsx`:
```tsx
const MOCK_OPTIONS: SearchOption[] = [
  // Add new options here
  { id: '13', label: 'New Option', category: 'wetland', value: 'new_option' },
];
```

### Add Export Formats
Edit `QuickExport.tsx`:
```tsx
const handleExport = async (format: 'png' | 'pdf' | 'csv' | 'geojson') => {
  // Add new format handling
}
```

---

## 🐛 Troubleshooting

### Search not working
```
1. Check filter store is initialized
2. Verify mock data in SearchBar.tsx
3. Check browser console for errors
```

### Export button not visible
```
1. Check you're on desktop or Insights tab on mobile
2. Verify QuickExport component is imported
3. Check CSS classes are applied
```

### Map not showing
```
1. Verify WetlandMap component is loaded
2. Check API endpoint is running
3. Check browser console for errors
```

### Mobile tabs not showing
```
1. Resize browser to < 768px width
2. Check DevTools device toolbar is enabled
3. Refresh page
```

---

## 📊 Component Dependencies

```
SearchBar.tsx
├── useFilterStore (filter state)
└── lucide-react (icons)

QuickExport.tsx
├── useToast (notifications)
└── lucide-react (icons)

AddData.tsx
├── useToast (notifications)
└── lucide-react (icons)

SetAOI.tsx
├── useToast (notifications)
└── lucide-react (icons)

DashboardPage.tsx
├── SearchBar
├── QuickExport
├── AddData
├── SetAOI
├── WetlandMap
├── useAuthStore
├── useUiStore
├── useFilterStore
└── lucide-react (icons)
```

---

## 🔗 Integration Points

### Filter Store
```tsx
import { useFilterStore } from '@stores/filter.store';

const { setSeverity, setWetlandCode } = useFilterStore();
```

### UI Store
```tsx
import { useUiStore } from '@stores/ui.store';

const { isSatelliteLayer, toggleSatellite } = useUiStore();
```

### Toast Notifications
```tsx
import { useToast } from '@hooks/useToast';

const { showToast } = useToast();
showToast('Success message', 'success');
```

---

## 📱 Responsive Breakpoints

```
Mobile:    < 768px   (Single column, tabs)
Tablet:    768-1024px (Two columns)
Desktop:   > 1024px   (Three columns)
```

---

## ✅ Pre-Deployment Checklist

- [ ] All components render without errors
- [ ] Search functionality works
- [ ] Export downloads files
- [ ] Add Data uploads files
- [ ] Set AOI places markers/polygons
- [ ] Mobile tabs switch correctly
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Accessibility features work
- [ ] All browsers tested

---

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Server
```bash
# Copy dist/ folder to server
# Configure web server to serve index.html
# Set API endpoints for production
```

---

## 📚 Documentation

- **DASHBOARD_IMPLEMENTATION.md** - Full feature guide
- **DASHBOARD_TESTING_GUIDE.md** - Testing procedures
- **IMPLEMENTATION_NOTES.md** - Technical details
- **VISUAL_GUIDE.md** - Layout diagrams
- **FEATURE_SUMMARY.md** - Feature overview

---

## 🆘 Getting Help

### Check Documentation
1. Read DASHBOARD_IMPLEMENTATION.md
2. Check DASHBOARD_TESTING_GUIDE.md
3. Review component JSDoc comments

### Debug Issues
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Check Application tab for storage

### Common Issues

**Search not filtering:**
- Check filter store is working
- Verify mock data exists
- Check browser console

**Export not downloading:**
- Check map element exists
- Verify file permissions
- Check browser download settings

**Mobile layout broken:**
- Clear browser cache
- Check viewport meta tag
- Verify Tailwind CSS loaded

---

## 🎯 Next Steps

1. ✓ Run development server
2. ✓ Test all features
3. ✓ Review documentation
4. → Customize for your needs
5. → Deploy to production

---

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review documentation files
3. Check component comments
4. Contact development team

---

## 🎉 You're Ready!

The WetLabs dashboard is now running with all features implemented:

✅ Search Bar - Filter by Wetlands, Watersheds, Regions, Districts, Severity
✅ Login Button - User authentication
✅ Quick Export - Export maps and data
✅ Add Data - Upload spatial datasets
✅ Set AOI - Define areas of interest
✅ Mobile Optimization - Fully responsive design

Start exploring and testing the dashboard now!

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run linter
npm run lint

# Format code
npm run format
```

---

## Browser DevTools Tips

### Toggle Mobile View
- Windows/Linux: Ctrl + Shift + M
- Mac: Cmd + Shift + M

### Open DevTools
- Windows/Linux: F12
- Mac: Cmd + Option + I

### Inspect Element
- Windows/Linux: Ctrl + Shift + C
- Mac: Cmd + Shift + C

### Clear Cache
- Windows/Linux: Ctrl + Shift + Delete
- Mac: Cmd + Shift + Delete

---

Happy coding! 🚀
