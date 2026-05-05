#!/bin/bash
# seed-wetlands.sh - Helper script to seed wetlands data

set -e

echo "🌿 WETLABS - Seeding Wetlands Data"
echo "=================================="
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5433 -U wetlabs > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on localhost:5433"
    echo "   Please start the database first:"
    echo "   cd infra/docker && docker-compose up -d postgres"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Run the migration
echo "📝 Running V8__seed_wetlands.sql migration..."
PGPASSWORD=wetlabs_secret psql -h localhost -p 5433 -U wetlabs -d wetlabs_db -f "$(dirname "$0")/migrations/V8__seed_wetlands.sql"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration completed successfully!"
    echo ""
    echo "📊 Verifying wetlands data..."
    PGPASSWORD=wetlabs_secret psql -h localhost -p 5433 -U wetlabs -d wetlabs_db -c "SELECT wetland_code, wetland_name, region FROM wetlands ORDER BY wetland_code;"
    echo ""
    echo "🎉 Done! Your wetlands table now has 5 records."
    echo ""
    echo "Next steps:"
    echo "  1. Restart your web app: cd apps/web && npm run dev"
    echo "  2. Test Submit Report: http://localhost:5173/report"
    echo "  3. Test Prototype: http://localhost:5173/prototype"
else
    echo ""
    echo "❌ Migration failed. Check the error messages above."
    exit 1
fi
