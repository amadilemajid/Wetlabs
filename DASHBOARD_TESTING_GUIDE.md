# WetLabs Dashboard - Quick Setup & Testing Guide

## Installation

All components are already integrated into the DashboardPage. No additional installation needed.

## Component Locations

```
apps/web/src/components/dashboard/
├── SearchBar.tsx          ✓ Installed
├── QuickExport.tsx        ✓ Installed
├── AddData.tsx            ✓ Installed
├── SetAOI.tsx             ✓ Installed
└── DashboardHeader.tsx    ✓ Installed

apps/web/src/pages/
└── DashboardPage.tsx      ✓ Updated with new components
```

## Running the Dashboard

```bash
cd apps/web
npm install
npm run dev
```

The dashboard will be available at `http://localhost:5173`

## Testing Each Feature

### 1. Search Bar Testing
**Location:** Top center of header (desktop) or expandable (mobile)

**Test Cases:**
- [ ] Type "Lake" - should show Lake Victoria, Lake Basin Watershed
- [ ] Type "High" - should show High Severity
- [ ] Type "Nairobi" - should show Nairobi Region
- [ ] Click category badge - should filter by that category
- [ ] Click X button - should clear search
- [ ] Click outside - should close dropdown

**Expected Behavior:**
- Results appear instantly as you type
- Category badges show filter type
- Clicking result applies filter to map
- Mobile: Search expands when tapped

### 2. Quick Export Testing
**Location:** Left sidebar (desktop) or Insights tab (mobile)

**Test Cases:**
- [ ] Click "Quick Export" button
- [ ] Modal dialog appears with 3 options
- [ ] Click "Export as PNG" - should download image
- [ ] Click "Export as PDF" - should download document
- [ ] Click "Export as CSV" - should download data
- [ ] Click "Cancel" - should close modal

**Expected Behavior:**
- Modal appears centered on screen
- Each export format has description
- Toast notification shows on export
- Files download with timestamp

### 3. Add Data Testing
**Location:** Left sidebar (desktop) or Insights tab (mobile)

**Test Cases:**
- [ ] Click "Overlay" button
- [ ] Modal dialog appears
- [ ] Drag GeoJSON file to upload area
- [ ] Click to browse and select file
- [ ] File validation shows error for invalid files
- [ ] Success message appears for valid files
- [ ] Click "Cancel" - should close modal

**Expected Behavior:**
- Drag-and-drop area highlights on hover
- File type validation works
- Error messages are clear
- Toast notification on success
- Map updates with new layer

### 4. Set AOI Testing
**Location:** Left sidebar (desktop) or Insights tab (mobile)

**Test Cases:**
- [ ] Click "AOI" button
- [ ] Modal shows two options: Point Marker and Draw Polygon
- [ ] Click "Add Point Marker"
  - [ ] Modal closes
  - [ ] Toast shows "Click on map to add marker"
  - [ ] Clicking map adds marker
- [ ] Click "AOI" button again
- [ ] Click "Draw Polygon"
  - [ ] Modal closes
  - [ ] Toast shows polygon drawing instructions
  - [ ] Multiple clicks create polygon
  - [ ] Double-click finishes polygon
- [ ] Click "Clear AOI" - should remove all AOI elements

**Expected Behavior:**
- Modal provides clear instructions
- Map interaction works as described
- Toast notifications guide user
- AOI elements visible on map
- Clear button removes all AOI data

### 5. Mobile Responsiveness Testing

**Tablet View (768px - 1024px):**
- [ ] All three panels visible
- [ ] Search bar full width
- [ ] Touch targets are adequate
- [ ] No horizontal scrolling

**Mobile View (< 768px):**
- [ ] Bottom tab navigation visible
- [ ] Only one panel visible at a time
- [ ] Search bar expandable
- [ ] All buttons touch-friendly (44px+)
- [ ] No horizontal scrolling
- [ ] Landscape mode works

**Test Devices:**
- [ ] iPhone 12/13/14
- [ ] iPad
- [ ] Android phone
- [ ] Android tablet

### 6. Integration Testing

**Filter Integration:**
- [ ] Search for "High Severity" - map updates to show only high severity markers
- [ ] Search for "Lake Victoria" - map centers on that wetland
- [ ] Severity legend in Data Panel reflects search filters

**Export Integration:**
- [ ] Export includes current map view
- [ ] Export includes active filters
- [ ] Export includes visible layers

**AOI Integration:**
- [ ] AOI appears on map
- [ ] AOI persists when switching tabs
- [ ] AOI can be cleared from Data Panel

## Performance Checklist

- [ ] Search results appear within 100ms
- [ ] Modal dialogs open smoothly
- [ ] No lag when switching tabs on mobile
- [ ] Map updates smoothly with new data
- [ ] Export completes within 5 seconds
- [ ] No memory leaks on component unmount

## Accessibility Testing

- [ ] All buttons have proper labels
- [ ] Keyboard navigation works
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader announces modals
- [ ] Focus indicators visible
- [ ] Touch targets are 44px minimum

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS 12+)
- [ ] Chrome Mobile (Android 80+)

## Troubleshooting

### Search not working
- Check filter store is properly initialized
- Verify mock data in SearchBar.tsx
- Check browser console for errors

### Export failing
- Ensure map element exists (class: leaflet-container)
- Check file permissions for downloads
- Verify html2canvas is installed for PNG export

### AOI not appearing on map
- Check map is fully loaded
- Verify Leaflet Draw plugin is installed
- Check browser console for errors

### Mobile layout broken
- Clear browser cache
- Check Tailwind CSS is properly configured
- Verify responsive classes are applied

## Performance Optimization Tips

1. **Lazy Load Components**
   ```tsx
   const SearchBar = lazy(() => import('@components/dashboard/SearchBar'));
   ```

2. **Memoize Components**
   ```tsx
   export const SearchBar = memo(SearchBarComponent);
   ```

3. **Optimize Re-renders**
   - Use useCallback for event handlers
   - Use useMemo for expensive computations

4. **Code Splitting**
   - Modal components load on demand
   - Export functionality loads when needed

## Deployment Checklist

- [ ] All components tested on target devices
- [ ] Performance metrics acceptable
- [ ] Accessibility requirements met
- [ ] Error handling implemented
- [ ] Loading states visible
- [ ] Toast notifications working
- [ ] Mobile viewport meta tag present
- [ ] PWA manifest updated

## Support & Documentation

For detailed component documentation, see:
- `DASHBOARD_IMPLEMENTATION.md` - Full feature guide
- Component JSDoc comments
- Tailwind CSS documentation
- Lucide React icons

## Next Steps

1. Deploy to staging environment
2. Conduct user acceptance testing
3. Gather feedback from stakeholders
4. Implement refinements
5. Deploy to production

## Contact

For issues or questions, refer to the project documentation or contact the development team.
