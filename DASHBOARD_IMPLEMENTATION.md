# WetLabs Dashboard - Mobile-Optimized Implementation Guide

## Overview
The WetLabs dashboard has been enhanced with a mobile-first responsive design and comprehensive feature set for wetland monitoring and analysis.

## New Components

### 1. SearchBar Component
**Location:** `src/components/dashboard/SearchBar.tsx`

**Features:**
- Search and filter by:
  - Wetland areas (Lake Victoria, Mara Wetland, etc.)
  - Watersheds (Rift Valley, Lake Basin)
  - Regions (Nairobi, Kisumu)
  - Districts (Westlands, Kasarani)
  - Case Severity (High, Medium, Low)
- Real-time filtering with category badges
- Click-outside detection to close dropdown
- Clear button for quick reset
- Mobile-optimized with full-width input

**Usage:**
```tsx
import { SearchBar } from '@components/dashboard/SearchBar';

<SearchBar />
```

### 2. QuickExport Component
**Location:** `src/components/dashboard/QuickExport.tsx`

**Features:**
- Export map layouts and data charts in multiple formats:
  - **PNG**: High-quality image format for sharing
  - **PDF**: Document format with charts and metadata
  - **CSV**: Data table format for spreadsheet analysis
- Modal dialog interface
- Loading state management
- Toast notifications for user feedback

**Usage:**
```tsx
import { QuickExport } from '@components/dashboard/QuickExport';

<QuickExport />
```

### 3. AddData Component
**Location:** `src/components/dashboard/AddData.tsx`

**Features:**
- Upload and overlay spatial datasets
- Supported formats:
  - GeoJSON (.geojson, .json)
  - KML (.kml)
- Drag-and-drop file upload interface
- File validation with error handling
- Visual feedback for upload status
- Integrates with map layer system

**Usage:**
```tsx
import { AddData } from '@components/dashboard/AddData';

<AddData />
```

### 4. SetAOI Component
**Location:** `src/components/dashboard/SetAOI.tsx`

**Features:**
- Define Area of Interest on the map
- Two modes:
  - **Point Marker**: Click to place a single marker
  - **Polygon**: Click multiple points to draw a polygon area
- Clear AOI functionality
- Event-based communication with map
- Toast notifications for mode changes

**Usage:**
```tsx
import { SetAOI } from '@components/dashboard/SetAOI';

<SetAOI />
```

### 5. DashboardHeader Component
**Location:** `src/components/dashboard/DashboardHeader.tsx`

**Features:**
- Responsive header with mobile optimization
- Integrated SearchBar
- Login button with user info
- Mobile search toggle
- Menu toggle for sidebar
- Sticky positioning

**Usage:**
```tsx
import { DashboardHeader } from '@components/dashboard/DashboardHeader';

<DashboardHeader onMenuToggle={() => {}} />
```

## Mobile Optimization

### Responsive Breakpoints
- **Mobile (< 768px)**: Single-column layout with tab navigation
- **Tablet (768px - 1024px)**: Two-column layout
- **Desktop (> 1024px)**: Three-column layout with all panels visible

### Mobile Features
1. **Bottom Tab Navigation**
   - Insights tab (Quick Insights panel)
   - Map View tab (Interactive map)
   - Data Panel tab (Layers and filters)

2. **Collapsible Search**
   - Search bar expands on mobile when needed
   - Compact icon view on small screens
   - Full-width input on larger screens

3. **Touch-Friendly UI**
   - Larger touch targets (44px minimum)
   - Optimized spacing for mobile
   - Swipe-friendly navigation

4. **Performance Optimizations**
   - Lazy loading of components
   - Optimized re-renders
   - Efficient state management

## Dashboard Layout

### Desktop Layout (3-Column)
```
┌─────────────────────────────────────────────────────┐
│  Logo  │  Search Bar  │  Login Button               │
├──────────────┬──────────────────────┬───────────────┤
│              │                      │               │
│   Insights   │      Map View        │  Data Panel   │
│   - Charts   │   - Interactive      │  - Basemap    │
│   - Alerts   │   - Markers          │  - Layers     │
│   - Export   │   - Zoom Controls    │  - Severity   │
│   - AOI      │                      │  - Cases      │
│   - Overlay  │                      │  - AOI        │
│              │                      │               │
└──────────────┴──────────────────────┴───────────────┘
```

### Mobile Layout (Tab-Based)
```
┌─────────────────────────────────┐
│  Logo  │  Search  │  Login      │
├─────────────────────────────────┤
│                                 │
│   Active Tab Content            │
│   (Insights / Map / Data)        │
│                                 │
├─────────────────────────────────┤
│ Insights │ Map View │ Data Panel│
└─────────────────────────────────┘
```

## Integration with Existing Systems

### Filter Store Integration
```tsx
const { setSeverity, setWetlandCode } = useFilterStore();

// SearchBar automatically updates filters
setSeverity(['HIGH', 'MEDIUM']);
setWetlandCode('lake_victoria');
```

### UI Store Integration
```tsx
const { 
  isSatelliteLayer, isDemLayer,
  toggleSatellite, toggleDem
} = useUiStore();

// Data Panel controls layer visibility
```

### Toast Notifications
```tsx
const { showToast } = useToast();

showToast('Export successful', 'success');
showToast('Error loading data', 'error');
showToast('AOI mode activated', 'info');
```

## File Structure
```
src/components/dashboard/
├── SearchBar.tsx          # Search and filter component
├── QuickExport.tsx        # Export functionality
├── AddData.tsx            # Spatial data upload
├── SetAOI.tsx             # Area of Interest tool
└── DashboardHeader.tsx    # Responsive header

src/pages/
└── DashboardPage.tsx      # Main dashboard page (updated)
```

## Key Features Summary

| Feature | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Search Bar | Full width | Full width | Expandable |
| Quick Export | Visible | Visible | In Insights tab |
| Add Data | Visible | Visible | In Insights tab |
| Set AOI | Visible | Visible | In Insights tab |
| Map View | Full size | Full size | Full screen |
| Data Panel | Always visible | Always visible | Tab-based |
| Insights | Always visible | Always visible | Tab-based |

## Usage Example

```tsx
import DashboardPage from '@pages/DashboardPage';

export default function App() {
  return <DashboardPage />;
}
```

## Styling

All components use Tailwind CSS with:
- Consistent color scheme (teal-800 primary, slate grays)
- Responsive spacing and sizing
- Smooth transitions and hover states
- Accessibility-friendly contrast ratios

## Future Enhancements

1. **Advanced Search**
   - Date range filtering
   - Custom filter combinations
   - Saved search presets

2. **Export Options**
   - GeoJSON export
   - Custom report generation
   - Scheduled exports

3. **AOI Features**
   - Buffer zone creation
   - AOI templates
   - Historical AOI tracking

4. **Mobile App**
   - Native mobile application
   - Offline capabilities
   - Push notifications

## Testing

All components are tested for:
- Responsive behavior across devices
- Touch interactions on mobile
- Keyboard navigation
- Screen reader compatibility
- Performance metrics

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android 80+
