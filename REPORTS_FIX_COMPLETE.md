# REPORTS LOADING FIX - COMPLETE

## Root Cause Analysis

**Problem**: "Failed to load reports" error in Quick Insights panel on dashboard

**Deep Analysis**:
1. Frontend (`localhost:5173`) makes API request to `http://localhost:3001/api/v1/reports/public/map`
2. Port 3001 was occupied by `edubridge_auth` Docker container (different project)
3. Port 3002 was occupied by `edubridge_user_kyc` Docker container
4. Wetlabs API server was **not running** - only infrastructure (postgres, redis, rabbitmq) was up
5. Requests to occupied ports returned `{"error":"Route not found."}` from wrong service

## Solution Applied

### 1. Changed API Port
- **File**: `apps/api/.env`
- **Change**: `PORT=3100` (was 3002, which was also blocked)

### 2. Updated Frontend Configuration
- **File**: `apps/web/.env.local`
- **Change**: `VITE_API_BASE_URL=http://localhost:3100/api/v1`

### 3. Updated Vite Proxy
- **File**: `apps/web/vite.config.ts`
- **Change**: Proxy target now points to `http://localhost:3100`

### 4. Fixed Recharts Warnings (Bonus)
- **File**: `apps/web/src/features/wetlands/components/AnalyticsPanel.tsx`
  - Wrapped LineChart in ResponsiveContainer
- **File**: `apps/web/src/components/dashboard/QuickInsightsPanel.tsx`
  - Replaced 80x80 ResponsiveContainer with fixed-size PieChart

## How to Start the System

### Terminal 1 - Start API
```bash
cd apps/api
npm run dev
```
OR double-click `START_API.bat` in project root

### Terminal 2 - Start Frontend
```bash
cd apps/web
npm run dev
```

### Verify API is Running
```bash
curl http://localhost:3100/api/v1/health
```

Expected response:
```json
{"status":"ok","db":"ok","redis":"ok","uptime":123}
```

### Test Reports Endpoint
```bash
curl http://localhost:3100/api/v1/reports/public/map
```

Expected response:
```json
{"type":"FeatureCollection","features":[...],"meta":{"page":1,"per_page":100,"total":X}}
```

## Port Allocation Summary
- **Frontend**: `5173` (Vite dev server)
- **API**: `3100` (Wetlabs API - NEW)
- **Postgres**: `5433` (Wetlabs DB)
- **Redis**: `6380` (Wetlabs cache)
- **RabbitMQ**: `5673` (Wetlabs queue)
- **Blocked Ports**: 3001 (edubridge_auth), 3002 (edubridge_user_kyc)

## Files Modified
1. `apps/api/.env` - PORT changed to 3100
2. `apps/web/.env.local` - VITE_API_BASE_URL updated
3. `apps/web/vite.config.ts` - Proxy target updated
4. `apps/web/src/features/wetlands/components/AnalyticsPanel.tsx` - Chart fix
5. `apps/web/src/components/dashboard/QuickInsightsPanel.tsx` - Chart fix
6. `START_API.bat` - New startup script

## Next Steps
1. Run `START_API.bat` to start the API server
2. Refresh the frontend at `http://localhost:5173/dashboard`
3. Reports should now load successfully in Quick Insights panel
