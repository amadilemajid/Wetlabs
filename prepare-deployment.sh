#!/bin/bash
# Deployment Preparation Script

echo "🚀 Preparing WetLabs for Deployment..."

# 1. Create production environment files
echo "📝 Creating production environment templates..."

# API Production Environment
cat > apps/api/.env.production.template << 'EOF'
# -- Server ----------------------------------------------------
NODE_ENV=production
PORT=3001

# -- Database (Replace with your Neon/Supabase URL) -----------
DATABASE_URL=postgresql://user:password@host:5432/database

# -- Redis (Replace with your Upstash URL) --------------------
REDIS_URL=redis://default:password@host:port

# -- RabbitMQ (Replace with your CloudAMQP URL) ---------------
RABBITMQ_URL=amqp://user:password@host:port/vhost

# -- Auth ------------------------------------------------------
JWT_PRIVATE_KEY_BASE64=YOUR_JWT_PRIVATE_KEY
JWT_PUBLIC_KEY_BASE64=YOUR_JWT_PUBLIC_KEY
JWT_EXPIRES_IN=3600

# -- Security --------------------------------------------------
MSISDN_PEPPER=YOUR_PEPPER_HERE
AT_USSD_HMAC_SECRET=YOUR_HMAC_SECRET
INTERNAL_API_KEY=YOUR_INTERNAL_API_KEY

# -- External APIs ---------------------------------------------
AT_API_KEY=YOUR_AT_API_KEY
AT_USERNAME=YOUR_AT_USERNAME
SENDGRID_API_KEY=YOUR_SENDGRID_KEY
SENTINEL_HUB_CLIENT_ID=YOUR_SENTINEL_ID
SENTINEL_HUB_CLIENT_SECRET=YOUR_SENTINEL_SECRET

# -- Object Storage --------------------------------------------
S3_BUCKET=wetlabs-photos
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=YOUR_S3_KEY
S3_SECRET_KEY=YOUR_S3_SECRET

# -- CORS ------------------------------------------------------
CORS_ORIGIN=https://your-frontend-domain.vercel.app
EOF

# Web Production Environment
cat > apps/web/.env.production.template << 'EOF'
# Replace with your deployed API URL
VITE_API_BASE_URL=https://your-api-domain.onrender.com/api/v1
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_SATELLITE_URL=https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
VITE_SENTRY_DSN=
VITE_INTERNAL_API_KEY=YOUR_INTERNAL_API_KEY
EOF

echo "✅ Environment templates created!"
echo "📝 Next: Sign up for free services and fill in the values"
