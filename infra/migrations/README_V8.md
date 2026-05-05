# Wetlands Seed Data Migration

## Overview
This migration seeds the `wetlands` table with the 5 wetland areas used in the mobile app forms.

## Wetland Codes
- **KYO01**: Kyoga Basin — North
- **KYO02**: Kyoga Basin — South  
- **VIC01**: Victoria Basin
- **ALB01**: Albert Basin
- **KAT01**: Katonga Valley

## Running the Migration

### Option 1: Using Flyway (Recommended)
If you're using Flyway for migrations, it will automatically detect and run `V8__seed_wetlands.sql`:

```bash
cd infra
flyway migrate
```

### Option 2: Manual SQL Execution
Connect to your PostgreSQL database and run:

```bash
psql -U wetlabs -d wetlabs_db -f infra/migrations/V8__seed_wetlands.sql
```

### Option 3: Using Docker
If running in Docker:

```bash
docker exec -i wetlabs-postgres psql -U wetlabs -d wetlabs_db < infra/migrations/V8__seed_wetlands.sql
```

## Verification
After running the migration, verify the data:

```sql
SELECT wetland_code, wetland_name, region FROM wetlands ORDER BY wetland_code;
```

You should see 5 wetland records.

## Notes
- The migration uses `ON CONFLICT DO NOTHING` so it's safe to run multiple times
- Each wetland has a simple rectangular boundary polygon for MVP testing
- Centroids are automatically calculated by PostGIS
- All wetlands are marked as active (`is_active = TRUE`)
