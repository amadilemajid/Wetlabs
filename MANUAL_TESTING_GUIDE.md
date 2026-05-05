# 🧪 WetLabs Dashboard - Manual UI Testing Guide

## ✅ Pre-Testing Checklist
1. Ensure API server is running on port 3002: `cd apps/api && npm run dev`
2. Ensure Web app is running: `cd apps/web && npm run dev`
3. Open browser to: `http://localhost:5173` (or your Vite dev port)
4. Open browser DevTools (F12) to check for console errors

---

## 📋 STEP-BY-STEP TESTING INSTRUCTIONS

### 🎨 **TEST 1: Overall Design & Background**
**What to Check:**
- Subtle gradient background across entire page

**Steps:**
1. Load the dashboard page
2. Observe the background color

**Expected Result:**
✅ Background should have a subtle gradient from slate-50 → white → slate-50
✅ Not a flat white or gray color

---

### 🏢 **TEST 2: Header (Top Bar)**

#### 2.1 Logo & Branding
**Steps:**
1. Look at the top-left corner of the header

**Expected Result:**
✅ Green gradient square icon with water droplet (Droplets icon)
✅ "WetLabs" text in bold, large font
✅ "Environmental Intelligence" subtitle in small gray text below
✅ Logo background: gradient from #05734e to emerald-600

#### 2.2 Login Button
**Steps:**
1. Look at the top-right corner
2. Hover over the "Login" button

**Expected Result:**
✅ Green button with "Login" text and User icon
✅ Background color: #05734e
✅ On hover: darker green (#046340) with larger shadow
✅ Smooth transition animation

#### 2.3 Search Bar Removed
**Steps:**
1. Look at the center of the header

**Expected Result:**
✅ NO search bar in the header
✅ Clean, minimal header with only logo and login button

---

### 📊 **TEST 3: Quick Insights Panel (Left Sidebar)**

#### 3.1 Panel Header
**Steps:**
1. Look at the left sidebar header

**Expected Result:**
✅ "Quick Insights" title with BarChart2 icon
✅ Icon color: #05734e (green)
✅ Glassmorphism effect (slightly transparent with blur)
✅ Gradient background on panel (from-slate-50 to-white)

#### 3.2 Severity Overview Charts
**Steps:**
1. Scroll to view the pie charts in left panel

**Expected Result:**
✅ Large circular pie chart showing severity distribution
✅ Three colors: Red (High), Amber (Moderate), Green (Low)
✅ Percentages displayed on chart
✅ Two smaller circular progress charts below for High and Moderate alerts

#### 3.3 Quick Export Button
**Steps:**
1. Scroll to bottom of left panel
2. Look for "Quick Export" button
3. Hover over it

**Expected Result:**
✅ Full-width green button (#05734e)
✅ Download icon on the left
✅ "Quick Export" text
✅ Rounded corners (rounded-xl)
✅ On hover: darker green with larger shadow
✅ Smooth animation

#### 3.4 Set AOI & Add Data Buttons
**Steps:**
1. Look below the Quick Export button
2. Hover over each button

**Expected Result:**
✅ Two buttons side-by-side in a grid
✅ "Set AOI" button with Maximize2 icon
✅ "Add Data" button with Layers icon
✅ White background with green border (#05734e)
✅ On hover: slight background change and shadow increase

---

### 🗺️ **TEST 4: Map Controls (Center Panel)**

#### 4.1 Map Display
**Steps:**
1. Look at the center of the screen

**Expected Result:**
✅ Full-height interactive map
✅ Map takes up most of the screen width

#### 4.2 Floating Map Controls
**Steps:**
1. Look at the BOTTOM-RIGHT corner of the map
2. Hover over each control button

**Expected Result:**
✅ White rounded card with glassmorphism (backdrop-blur-md)
✅ Four control buttons vertically stacked:
   - 📍 Locate icon (Find My Location)
   - Divider line
   - ➕ ZoomIn icon
   - ➖ ZoomOut icon
   - Divider line
   - 🔲 Maximize2 icon (Reset View)
✅ On hover: icon turns green (#05734e) and background becomes emerald-50
✅ Smooth transitions (duration-200)
✅ Soft shadow on the control card

---

### 🗂️ **TEST 5: Data Panel (Right Sidebar)**

#### 5.1 Panel Header
**Steps:**
1. Look at the right sidebar header

**Expected Result:**
✅ Gradient header from #05734e to emerald-600
✅ "Data Panel" text in white with Layers icon
✅ Sticky header (stays at top when scrolling)

#### 5.2 Search & Filter Section
**Steps:**
1. Look at the top of the right panel content
2. Find the search bar

**Expected Result:**
✅ "SEARCH & FILTER" section header (uppercase, small, gray)
✅ Search bar is NOW in the Data Panel (not in header)
✅ Search input field visible

---

### 🗺️ **TEST 6: Basemap Selector**

**Steps:**
1. Scroll in right panel to "BASEMAP" section
2. Observe the three thumbnail images
3. Click on "Satellite" thumbnail
4. Click on "Terrain" thumbnail
5. Click on "Streets" thumbnail
6. Hover over each thumbnail

**Expected Result:**
✅ Three larger thumbnails (h-20) in a row
✅ Labels: "Satellite", "Terrain", "Streets"
✅ Active thumbnail has:
   - Green border (#05734e)
   - Ring effect (ring-2 ring-[#05734e]/20)
   - Green label text
✅ On hover: border color changes to green/50
✅ Smooth transitions
✅ Map changes when clicking different basemaps

---

### 🔘 **TEST 7: Data Layers (Toggle Switches)**

**Steps:**
1. Scroll to "DATA LAYERS" section
2. Click on "Wetland Sites" toggle
3. Click on "Water Bodies" toggle
4. Click on "Risk Zones" toggle
5. Observe the toggle animation

**Expected Result:**
✅ Three toggle switches (NOT checkboxes)
✅ iOS-style toggle switches
✅ When OFF: gray background (slate-300)
✅ When ON: green background (#05734e)
✅ White circle slides smoothly left/right
✅ Smooth animation (transition-transform duration-200)
✅ Labels: "Wetland Sites", "Water Bodies", "Risk Zones"

---

### 🎨 **TEST 8: Severity Legend (Horizontal)**

**Steps:**
1. Scroll to "SEVERITY LEGEND" section
2. Observe the layout
3. Click on "Low" chip
4. Click on "Moderate" chip
5. Click on "High" chip
6. Hover over each chip

**Expected Result:**
✅ THREE chips displayed HORIZONTALLY (side-by-side)
✅ Each chip has:
   - Circular gradient color indicator
   - Label below (Low, Moderate, High)
✅ Colors:
   - Low: Green gradient (emerald-400 to emerald-600)
   - Moderate: Amber gradient (amber-400 to amber-600)
   - High: Red gradient (red-500 to red-700)
✅ When clicked:
   - Background changes to colored tint (emerald-50, amber-50, red-50)
   - Ring effect appears (ring-2)
✅ On hover: background changes to slate-100
✅ Smooth transitions

---

### 🏭 **TEST 9: Reported Cases (Custom Icons)**

**Steps:**
1. Scroll to "REPORTED CASES" section
2. Observe the icon design
3. Click on "Pollution"
4. Click on "Vegetation"
5. Click on "Water Level"
6. Click on "Encroachment"
7. Hover over each card

**Expected Result:**
✅ Four cards in 2x2 grid
✅ Each card has:
   - Gradient icon background
   - White icon
   - Label text
✅ Icons:
   - 🏭 Pollution: Database icon (slate gradient)
   - 🌿 Vegetation: Leaf icon (emerald gradient)
   - 💧 Water Level: Waves icon (blue gradient)
   - 🏗️ Encroachment: Construction icon (amber gradient)
✅ When clicked:
   - Background changes to colored tint
   - Ring effect appears (ring-2)
✅ On hover: background changes to slate-100
✅ Smooth transitions

---

### 🎯 **TEST 10: Set Area of Interest Button**

**Steps:**
1. Scroll to the bottom of the right panel
2. Find the "Set Area of Interest" button
3. Hover over it

**Expected Result:**
✅ Full-width button at bottom of Data Panel
✅ White background with green border (#05734e)
✅ Maximize2 icon on the left
✅ "Set Area of Interest" text
✅ Rounded corners (rounded-xl)
✅ On hover: background changes to slate-50 and shadow increases
✅ Smooth transition

---

### 📱 **TEST 11: Mobile Responsiveness**

**Steps:**
1. Open browser DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. Observe the layout
5. Click on bottom navigation tabs

**Expected Result:**
✅ Bottom navigation bar appears with 3 tabs:
   - Insights
   - Map View
   - Data Panel
✅ Only one panel visible at a time
✅ Clicking tabs switches between panels
✅ Active tab has green color and background

---

### 🎨 **TEST 12: Hover Effects & Animations**

**Steps:**
1. Hover over various elements:
   - Login button
   - Quick Export button
   - Set AOI / Add Data buttons
   - Map controls
   - Basemap thumbnails
   - Toggle switches
   - Severity chips
   - Reported cases cards
   - Set Area of Interest button

**Expected Result:**
✅ ALL interactive elements have hover effects
✅ Smooth transitions (duration-200)
✅ Color changes to green (#05734e) or related shades
✅ Shadow increases on hover
✅ Background color changes slightly
✅ No jerky or instant changes

---

### 🎨 **TEST 13: Color Consistency**

**Steps:**
1. Scan the entire page
2. Note all green colors used

**Expected Result:**
✅ Primary green color (#05734e) used consistently:
   - Logo background
   - Login button
   - Quick Export button
   - Button borders
   - Active states
   - Toggle switches (ON state)
   - Basemap active borders
   - Icon colors
   - Hover states

---

### 🔍 **TEST 14: Visual Polish**

**Steps:**
1. Observe overall visual quality
2. Check for:
   - Shadows
   - Rounded corners
   - Spacing
   - Alignment
   - Typography

**Expected Result:**
✅ Consistent rounded corners throughout (rounded-lg, rounded-xl)
✅ Soft shadows on cards and buttons
✅ Proper spacing between elements
✅ Clean typography hierarchy
✅ Professional, polished appearance
✅ No visual glitches or misalignments

---

## 🐛 **Common Issues to Check**

### Issue 1: Colors Not Showing
**Check:**
- Browser cache cleared?
- Tailwind CSS compiled correctly?
- No console errors?

### Issue 2: Hover Effects Not Working
**Check:**
- CSS transitions applied?
- No JavaScript errors blocking interactions?

### Issue 3: Layout Broken
**Check:**
- Browser window size (should be desktop size for full layout)
- Flexbox/Grid working correctly?

### Issue 4: Icons Not Showing
**Check:**
- lucide-react package installed?
- Icons imported correctly?

---

## ✅ **Final Verification Checklist**

After completing all tests, verify:

- [ ] Header has new logo and login button
- [ ] Search bar is in Data Panel, NOT in header
- [ ] Map controls are in BOTTOM-RIGHT corner
- [ ] Toggle switches work (not checkboxes)
- [ ] Severity legend is HORIZONTAL (3 columns)
- [ ] Reported cases have gradient icon backgrounds
- [ ] All buttons use #05734e green color
- [ ] Hover effects work on all interactive elements
- [ ] Smooth transitions everywhere (duration-200)
- [ ] Glassmorphism on map controls
- [ ] Gradient backgrounds on panels
- [ ] Ring effects on active states
- [ ] Mobile bottom navigation works

---

## 📸 **Screenshot Checklist**

Take screenshots of:
1. Full dashboard view
2. Header close-up
3. Quick Insights panel
4. Map controls (bottom-right)
5. Data Panel header
6. Basemap selector
7. Toggle switches
8. Severity legend (horizontal)
9. Reported cases icons
10. Mobile view

---

## 🎯 **Success Criteria**

The UI improvements are successful if:
✅ All 14 tests pass
✅ No console errors
✅ Smooth animations throughout
✅ Professional, modern appearance
✅ Consistent color scheme (#05734e)
✅ All interactive elements respond to hover
✅ Mobile layout works correctly

---

## 📞 **Support**

If any test fails:
1. Check browser console for errors
2. Clear browser cache and hard refresh (Ctrl+Shift+R)
3. Verify all dependencies installed: `npm install`
4. Restart dev server
5. Check that Tailwind CSS is compiling correctly
