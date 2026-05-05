# 🚀 WetLabs - Complete Free Deployment Guide

## 📋 **Overview**

This guide will help you deploy WetLabs using **100% FREE** services:

- ✅ **Frontend**: Vercel (Free)
- ✅ **Backend API**: Render (Free)
- ✅ **Database**: Neon PostgreSQL (Free)
- ✅ **Redis**: Upstash (Free)
- ✅ **RabbitMQ**: CloudAMQP (Free)

**Total Cost: $0/month** 🎉

---

## 🎯 **PART 1: Sign Up for Free Services**

### **1.1 Vercel (Frontend Hosting)**

1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. ✅ Free tier includes:
   - Unlimited deployments
   - Automatic HTTPS
   - Global CDN
   - 100GB bandwidth/month

### **1.2 Render (Backend Hosting)**

1. Go to: https://render.com/register
2. Sign up with GitHub
3. ✅ Free tier includes:
   - 750 hours/month (enough for 1 service)
   - Automatic HTTPS
   - Auto-deploy from Git
   - **Note**: Spins down after 15 min of inactivity

### **1.3 Neon (PostgreSQL Database)**

1. Go to: https://neon.tech/
2. Sign up with GitHub
3. Click "Create Project"
4. Choose region closest to you
5. Copy the connection string
6. ✅ Free tier includes:
   - 3GB storage
   - Unlimited queries
   - Auto-scaling

**Alternative**: Supabase (https://supabase.com) - 500MB free

### **1.4 Upstash (Redis)**

1. Go to: https://upstash.com/
2. Sign up with GitHub
3. Click "Create Database"
4. Choose "Global" type
5. Copy the Redis URL
6. ✅ Free tier includes:
   - 10,000 commands/day
   - 256MB storage

### **1.5 CloudAMQP (RabbitMQ)**

1. Go to: https://www.cloudamqp.com/
2. Sign up
3. Create new instance
4. Choose "Little Lemur" (Free plan)
5. Copy the AMQP URL
6. ✅ Free tier includes:
   - 1 million messages/month
   - 20 connections

---

## 🎯 **PART 2: Prepare Your Repository**

### **2.1 Push to GitHub**

```bash
# Initialize git (if not already done)
cd "c:\Users\AMADILE MAJID\Wetlabs"
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - WetLabs deployment ready"

# Create GitHub repository
# Go to: https://github.com/new
# Name: wetlabs
# Don't initialize with README

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/wetlabs.git
git branch -M main
git push -u origin main
```

### **2.2 Create Production Environment Files**

Create `apps/api/.env.production`:

```env
NODE_ENV=production
PORT=3001

# Replace with your Neon database URL
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/wetlabs_db

# Replace with your Upstash Redis URL
REDIS_URL=redis://default:xxx@xxx.upstash.io:6379

# Replace with your CloudAMQP URL
RABBITMQ_URL=amqp://xxx:xxx@xxx.cloudamqp.com/xxx

# Copy from your .env file
JWT_PRIVATE_KEY_BASE64=YOUR_KEY_HERE
JWT_PUBLIC_KEY_BASE64=YOUR_KEY_HERE
JWT_EXPIRES_IN=3600

MSISDN_PEPPER=YOUR_PEPPER
AT_USSD_HMAC_SECRET=YOUR_SECRET
INTERNAL_API_KEY=YOUR_KEY

# External APIs (optional for now)
AT_API_KEY=
AT_USERNAME=
SENDGRID_API_KEY=
SENTINEL_HUB_CLIENT_ID=
SENTINEL_HUB_CLIENT_SECRET=

# S3 (optional for now)
S3_BUCKET=
S3_ENDPOINT=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# IMPORTANT: Set this to your Vercel frontend URL after deployment
CORS_ORIGIN=https://wetlabs.vercel.app
```

---

## 🎯 **PART 3: Deploy Backend API to Render**

### **3.1 Create Build Script**

Create `apps/api/render-build.sh`:

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npm run build

echo "Running migrations..."
# Add migration command if needed
# npm run migrate

echo "Build complete!"
```

Make it executable:
```bash
chmod +x apps/api/render-build.sh
```

### **3.2 Deploy on Render**

1. Go to: https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `wetlabs-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `apps/api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. Click "Advanced" → Add Environment Variables:
   - Copy all variables from your `.env.production`
   - Add each one manually

6. Click "Create Web Service"

7. Wait 5-10 minutes for deployment

8. Copy your API URL: `https://wetlabs-api.onrender.com`

---

## 🎯 **PART 4: Deploy Frontend to Vercel**

### **4.1 Update Frontend Environment**

Create `apps/web/.env.production`:

```env
# Replace with your Render API URL
VITE_API_BASE_URL=https://wetlabs-api.onrender.com/api/v1
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_SATELLITE_URL=https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
VITE_INTERNAL_API_KEY=YOUR_INTERNAL_API_KEY
```

### **4.2 Create Vercel Configuration**

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ]
}
```

### **4.3 Deploy on Vercel**

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from web directory
cd apps/web
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: wetlabs
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to: https://vercel.com/new
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://wetlabs-api.onrender.com/api/v1`
   - `VITE_MAP_TILE_URL`: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
   - `VITE_MAP_SATELLITE_URL`: (your satellite URL)
   - `VITE_INTERNAL_API_KEY`: (your key)

5. Click "Deploy"

6. Your site will be live at: `https://wetlabs.vercel.app`

---

## 🎯 **PART 5: Database Setup**

### **5.1 Run Migrations on Neon**

```bash
# Connect to your Neon database
psql "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/wetlabs_db"

# Or use Neon's SQL Editor in their dashboard
```

Copy your migration SQL files and run them in order.

### **5.2 Seed Initial Data (Optional)**

```sql
-- Create initial admin user
INSERT INTO users (user_id, email, password_hash, role, full_name)
VALUES (
  gen_random_uuid(),
  'admin@wetlabs.com',
  '$2b$10$...',  -- Use bcrypt to hash password
  'SYSTEM_ADMIN',
  'System Administrator'
);
```

---

## 🎯 **PART 6: Update CORS Settings**

### **6.1 Update API CORS**

Go back to Render dashboard:
1. Select your `wetlabs-api` service
2. Go to "Environment"
3. Update `CORS_ORIGIN` to your Vercel URL:
   ```
   CORS_ORIGIN=https://wetlabs.vercel.app
   ```
4. Save changes (will trigger redeploy)

---

## 🎯 **PART 7: Test Your Deployment**

### **7.1 Test API**

```bash
# Test health endpoint
curl https://wetlabs-api.onrender.com/api/v1/health

# Should return: {"status":"ok"}
```

### **7.2 Test Frontend**

1. Open: `https://wetlabs.vercel.app`
2. Check browser console for errors
3. Try logging in
4. Test map functionality

---

## 🎯 **PART 8: Custom Domain (Optional)**

### **8.1 Add Custom Domain to Vercel**

1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add your domain (e.g., `wetlabs.yourdomain.com`)
3. Follow DNS configuration instructions
4. Vercel provides free SSL automatically

### **8.2 Add Custom Domain to Render**

1. Go to Render dashboard → Your service → Settings → Custom Domain
2. Add your domain (e.g., `api.wetlabs.yourdomain.com`)
3. Follow DNS configuration instructions

---

## 📊 **Free Tier Limitations**

### **Render (Backend)**
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ✅ Solution: Use a cron job to ping every 10 minutes (free services like cron-job.org)

### **Neon (Database)**
- ✅ 3GB storage (plenty for most apps)
- ✅ Unlimited queries
- ⚠️ Auto-suspends after 5 minutes of inactivity

### **Upstash (Redis)**
- ✅ 10,000 commands/day
- ⚠️ Resets daily

### **CloudAMQP (RabbitMQ)**
- ✅ 1 million messages/month
- ✅ 20 connections

### **Vercel (Frontend)**
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Always on (no spin-down)

---

## 🔧 **Troubleshooting**

### **Issue: API not responding**
- Check Render logs: Dashboard → Service → Logs
- Verify environment variables are set
- Check database connection string

### **Issue: CORS errors**
- Verify `CORS_ORIGIN` in API matches your Vercel URL
- Check browser console for exact error

### **Issue: Database connection failed**
- Verify Neon connection string
- Check if database is active (may need to wake it up)
- Verify SSL mode in connection string

### **Issue: Frontend not loading**
- Check Vercel deployment logs
- Verify `VITE_API_BASE_URL` is correct
- Clear browser cache

---

## 🎉 **Success Checklist**

- [ ] API deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Database on Neon
- [ ] Redis on Upstash
- [ ] RabbitMQ on CloudAMQP
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] Can access frontend URL
- [ ] Can login to application
- [ ] Map loads correctly

---

## 📝 **Your Deployment URLs**

After deployment, save these:

```
Frontend: https://wetlabs.vercel.app
API: https://wetlabs-api.onrender.com
Database: (Neon dashboard)
Redis: (Upstash dashboard)
RabbitMQ: (CloudAMQP dashboard)
```

---

## 🚀 **Next Steps**

1. Set up monitoring (Render provides basic monitoring)
2. Configure alerts for downtime
3. Set up automated backups for database
4. Add analytics (Google Analytics, Plausible, etc.)
5. Set up error tracking (Sentry has free tier)

---

## 💡 **Pro Tips**

1. **Keep API Alive**: Use cron-job.org to ping your API every 10 minutes
2. **Environment Variables**: Never commit `.env` files to Git
3. **Database Backups**: Neon provides automatic backups
4. **Monitoring**: Use Render's built-in monitoring
5. **Logs**: Check Render logs regularly for errors

---

## 📞 **Support Resources**

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- Neon Docs: https://neon.tech/docs
- Upstash Docs: https://docs.upstash.com
- CloudAMQP Docs: https://www.cloudamqp.com/docs

---

## ✅ **Deployment Complete!**

Your WetLabs application is now live and accessible to anyone! 🎉

Share your URL: `https://wetlabs.vercel.app`
