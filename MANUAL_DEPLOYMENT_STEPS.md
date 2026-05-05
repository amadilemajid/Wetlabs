# ✅ PART 2 COMPLETE! Now Follow These Manual Steps

## 🎉 What I've Done Automatically:

✅ Created production environment templates
✅ Created Vercel configuration (vercel.json)
✅ Created Render build script
✅ Committed all files to Git
✅ Pushed to GitHub: https://github.com/amadilemajid/Wetlabs

---

## 📋 MANUAL STEPS YOU NEED TO DO NOW:

---

## **STEP 1: Sign Up for Free Services (10 minutes)**

### 1.1 Neon (Database)
1. Go to: https://neon.tech/
2. Click "Sign up" → Use GitHub
3. Click "Create Project"
4. Name: `wetlabs-db`
5. Region: Choose closest to you
6. Click "Create Project"
7. **COPY** the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/wetlabs_db
   ```
8. **SAVE IT** - you'll need it soon!

### 1.2 Upstash (Redis)
1. Go to: https://console.upstash.com/
2. Sign up with GitHub
3. Click "Create Database"
4. Name: `wetlabs-redis`
5. Type: Regional
6. Region: Choose closest to you
7. Click "Create"
8. **COPY** the Redis URL (looks like):
   ```
   redis://default:xxx@xxx.upstash.io:6379
   ```
9. **SAVE IT!**

### 1.3 CloudAMQP (RabbitMQ)
1. Go to: https://customer.cloudamqp.com/signup
2. Sign up (use email)
3. Click "Create New Instance"
4. Name: `wetlabs-queue`
5. Plan: **Little Lemur (Free)**
6. Region: Choose closest to you
7. Click "Create Instance"
8. Click on your instance name
9. **COPY** the AMQP URL (looks like):
   ```
   amqp://xxx:xxx@xxx.cloudamqp.com/xxx
   ```
10. **SAVE IT!**

---

## **STEP 2: Deploy Backend API to Render (10 minutes)**

### 2.1 Sign Up for Render
1. Go to: https://dashboard.render.com/register
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 2.2 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your repository: `amadilemajid/Wetlabs`
3. Click "Connect"

### 2.3 Configure Service
Fill in these settings:

- **Name**: `wetlabs-api`
- **Region**: Choose closest to you (e.g., Oregon, Frankfurt)
- **Branch**: `main`
- **Root Directory**: `apps/api`
- **Runtime**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### 2.4 Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these ONE BY ONE (copy from the list below):

```
NODE_ENV=production
```

```
PORT=3001
```

```
DATABASE_URL=<PASTE YOUR NEON URL HERE>
```

```
REDIS_URL=<PASTE YOUR UPSTASH URL HERE>
```

```
RABBITMQ_URL=<PASTE YOUR CLOUDAMQP URL HERE>
```

```
JWT_PRIVATE_KEY_BASE64=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2QUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktZd2dnU2lBZ0VBQW9JQkFRQzBjQ1FtbGVJekhPWUoKV0tudEsrZjU2VFpjUWNVdDFUcEFtcGFjVzFmMEUzQzd0akdpRjJIQlB3RFhQK0lwOERpNWduYzUxc2Q2UlM5NQpaVmthRFFMRkRoZ3hkY2xNMkFqQ2dmdnNkbjJrdWZrZmFwNzJuYnBRcnFLcVphckhab0orK2xyZlRnZlp3a2hOCnFBMUdTbjNwV3U5NFVFZU9ucGNhSjl5cCtOSVNjWTQ4UE5hL3IxNEwza0luaVBlaWV2OVRYWlRucjNkMkRFbU0KcUpwRy9aNUJKNDBTUGNLTU1xblpGT05MalJBOVJ4bWdsMm4vR1llR3V5KzEySDBhcDFvcUlOOTUwMk4zTjVzdApEbDJwclNVMEJ1UHQ3U0JtQWpYc1BrTXFjQm9ianF0Z3VMcFBqOVBodzFmSEY4S0JHbjY5NlBzMXE5MnNxZU5uCmlNMERQdVNsQWdNQkFBRUNnZ0VBUU9YS290UXE0TzVtY0hzaTF3cUJLM290VXA1WFFLWmVCc2x6SFRhZldrcTUKczlJU1pQWGE4NG5wRUFKS29vSGpyUmxYTDRib0JUcW9HaFlSSjVVQlo0V3J2dkpaM2hrZmdYSUYvYVVhaUtwWgpCMnN1Vkk0amFveDlOaU5OK3QwTVY0Wk5NOTdaWlFHRFJ1Y0lLejEwcnY5RmZUVUduNjI3dEMwZEtVYzBxMnZ2Cm5KdGRsNWJkUHFmUjQ4S0hSYzVEdFZHd1AxMkE5M3BiMnRJbFZrQWJ0MFA3WUR3RVY1c3ljWDF4cUYvS1Jkd0oKckI3dDVTVnJHaHRzSDExK3hKZlZkUFFFTlB6UFZKRCs5QzRWc2c2NzY0NjZ1T0VkQjJjSXBVc3lxaEUyc1VnVwpzbWxTU1UzRndOMXBCejFXaDdONTlMRnhZMktGeStzR3NDdERBd3pNT3dLQmdRRHlnRGg2NGxNalk4WHU4WHkwCnNxSnozT1ZqMWVQc0c5OVROQVJtbG1Cc085K2U5Y1hrazVNNndwS2lRa0JyL3BETTRHREVHbkc5RWRtVFRIUDIKRWd1MlhOM0gyaDJEY3lBam9Xdjh5V3lJR1lRR1FJUTZ2ZTZXRlluTGFyWkU3bnV0WTFhZ2kxVmxHYkorc0duZQpEOHNMMFpXemVkWDdrKzQwcXFETnJzN2NOd0tCZ1FDK2UzMDZ2Q2p6NWxkNUxjZEpIazAwRnF0a28rNm5LVE9uCmV2SE1pdkIydWRvbVlLTENsRmpBdHNZcDRqRG03c1Q5QnU1VkxUVENKZUF6dVRkMFkvZE1EOEdZTVBodVBmRkEKK3VKWDFxUTg2MDNZMVJjMGNjU0d1eDJJallOc2dlR2dLbEF0dGVuVEw1NmVIcFpUMFQ5Rk9GTENEWVRSWWdHRAowSmR4U3Jnd0F3S0JnSFJtdTdXd29idWhEc2VOUHhEMWxpa0xaVWl3eU1EeStCWFdLQzZlREJhbi9zVXNzQnJ5CkEzLzNHYSt0SVlNMUpJaFRROStkMmU2cGZNakpyL2Z6M1k5aHNFdFlGVWFkb2xXNEREL0E1OG5FaGEwQ2x2WWoKYVR5OWhmRVFmZ0ZFZ0RWUU02cklkdXNhbEtWZlJOSUV2ckFqb0RvUVIzaUZINWhFTnYvRDR5T3RBb0dBVDZIRQptcmRxejN3dWVZUi8yYnVIUHcxekhhSEM5Yk10MndoMDZiUDBEMDVuT3NBUGl4VUZmWnRyZ0xzRkFxWXpTQ3lMCm1xUkplQmpwZi9ZZ2p0SHo0cUo3cHFwaVVZUW54YWljMDJmeVJWMkJyL0oxdndFSXplS1AyRFNCQ3UzSmEzSUYKRHZjTUI3UFN0ZnZIa01iYmtvNlhXblRZWDhoL0phSWdqY1pVOWcwQ2dZQUZtTUJOd2hTdUJqbkdBWFFUd3RPYwpjakt4Tm5rbFpoL0dWQ0kxcFJJb05nS3RVZjAvS3Z0cE03MjlhSmt6cE5GQmtmdEUyUWFuNHJ4NGFpcEFJQ3ZwCnZldDRaekhGcVlOSUZRbnRsdG01aWxOa0loTTR2MTNmV0NNSWhDQTFBZ1M1NjIvMXpUVlRkaGp5WTk0SkFXaXkKb3EwSVBQVkpQVXVHUDVKek1zNXUyQT09Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K
```

```
JWT_PUBLIC_KEY_BASE64=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF0SEFrSnBYaU14em1DVmlwN1N2bgorZWsyWEVIRkxkVTZRSnFXbkZ0WDlCTnd1N1l4b2hkaHdUOEExei9pS2ZBNHVZSjNPZGJIZWtVdmVXVlpHZzBDCnhRNFlNWFhKVE5nSXdvSDc3SFo5cExuNUgycWU5cDI2VUs2aXFtV3F4MmFDZnZwYTMwNEgyY0pJVGFnTlJrcDkKNlZydmVGQkhqcDZYR2lmY3FmalNFbkdPUER6V3Y2OWVDOTVDSjRqM29uci9VMTJVNTY5M2RneEpqS2lhUnYyZQpRU2VORWozQ2pES3AyUlRqUzQwUVBVY1pvSmRwL3htSGhyc3Z0ZGg5R3FkYUtpRGZlZE5qZHplYkxRNWRxYTBsCk5BYmo3ZTBnWmdJMTdENURLbkFhRzQ2cllMaTZUNC9UNGNOWHh4ZkNnUnArdmVqN05hdmRyS25qWjRqTkF6N2sKcFFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==
```

```
JWT_EXPIRES_IN=3600
```

```
MSISDN_PEPPER=64bc8111a21523b26e8fb544d17196acffaba0619be7a998bb96b1e492f0df68
```

```
AT_USSD_HMAC_SECRET=dummy_AT_hmac_secret
```

```
INTERNAL_API_KEY=eceb056c7444a01effe2a4094557dedcdac57099a18c4f085cbfd4665d1e0177
```

```
CORS_ORIGIN=*
```

### 2.5 Deploy!
1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. **COPY YOUR API URL** (looks like): `https://wetlabs-api.onrender.com`
4. **SAVE IT!**

---

## **STEP 3: Deploy Frontend to Vercel (10 minutes)**

### 3.1 Sign Up for Vercel
1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. Authorize Vercel

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Find `amadilemajid/Wetlabs`
3. Click "Import"

### 3.3 Configure Project
Fill in these settings:

- **Framework Preset**: Vite
- **Root Directory**: `apps/web` (click "Edit" to change)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.4 Add Environment Variables
Click "Environment Variables" section

Add these ONE BY ONE:

**Variable Name**: `VITE_API_BASE_URL`
**Value**: `<PASTE YOUR RENDER API URL HERE>/api/v1`
(Example: `https://wetlabs-api.onrender.com/api/v1`)

**Variable Name**: `VITE_MAP_TILE_URL`
**Value**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

**Variable Name**: `VITE_MAP_SATELLITE_URL`
**Value**: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`

**Variable Name**: `VITE_INTERNAL_API_KEY`
**Value**: `eceb056c7444a01effe2a4094557dedcdac57099a18c4f085cbfd4665d1e0177`

### 3.5 Deploy!
1. Click "Deploy"
2. Wait 3-5 minutes
3. **COPY YOUR FRONTEND URL** (looks like): `https://wetlabs.vercel.app`
4. **SAVE IT!**

---

## **STEP 4: Update CORS (2 minutes)**

### 4.1 Update Render Environment
1. Go back to Render dashboard
2. Click on your `wetlabs-api` service
3. Click "Environment" in left sidebar
4. Find `CORS_ORIGIN` variable
5. Click "Edit"
6. Change value from `*` to your Vercel URL:
   ```
   https://wetlabs.vercel.app
   ```
7. Click "Save Changes"
8. Wait for automatic redeploy (~2 minutes)

---

## **STEP 5: Setup Database (5 minutes)**

### 5.1 Access Neon SQL Editor
1. Go to: https://console.neon.tech
2. Click on your `wetlabs-db` project
3. Click "SQL Editor" in left sidebar

### 5.2 Run Migrations
You need to run your database migration SQL files.

**Option A**: If you have migration files:
1. Open your migration files from `infra/migrations/` folder
2. Copy the SQL content
3. Paste into Neon SQL Editor
4. Click "Run"

**Option B**: If you don't have migrations ready:
For now, your database is connected. You can add tables later.

---

## **STEP 6: Test Your Deployment (3 minutes)**

### 6.1 Test API
Open a new browser tab and go to:
```
https://wetlabs-api.onrender.com/api/v1/health
```

**Expected**: Should see `{"status":"ok"}` or similar

⚠️ **Note**: First request may take 30-60 seconds (Render is waking up)

### 6.2 Test Frontend
Open your Vercel URL:
```
https://wetlabs.vercel.app
```

**Expected**: Should see the WetLabs dashboard

### 6.3 Check Browser Console
1. Press F12 to open DevTools
2. Check Console tab
3. Look for any errors

---

## 🎉 **DEPLOYMENT COMPLETE!**

Your app is now live at:
- **Frontend**: https://wetlabs.vercel.app
- **API**: https://wetlabs-api.onrender.com

Share these URLs with anyone! 🌍

---

## 📝 **Important Notes**

### ⚠️ Render Free Tier
- API spins down after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- **Solution**: Use cron-job.org to ping every 10 minutes

### 🔒 Security
- Never share your environment variables
- Keep your `.env` files private
- Don't commit secrets to Git

### 💾 Backups
- Neon provides automatic backups
- Download backups regularly

---

## 🔧 **Troubleshooting**

### Problem: API returns 404
**Solution**: Wait 60 seconds and try again (might be spinning up)

### Problem: CORS error in browser
**Solution**: Verify CORS_ORIGIN in Render matches your Vercel URL exactly

### Problem: Frontend shows blank page
**Solution**: 
1. Check Vercel deployment logs
2. Verify VITE_API_BASE_URL is correct
3. Check browser console for errors

### Problem: Database connection error
**Solution**: 
1. Verify Neon connection string is correct
2. Check if database is active in Neon dashboard

---

## 📞 **Need Help?**

Check these dashboards:
- Vercel: https://vercel.com/dashboard
- Render: https://dashboard.render.com
- Neon: https://console.neon.tech
- Upstash: https://console.upstash.com
- CloudAMQP: https://customer.cloudamqp.com

---

## 🚀 **Next Steps**

After successful deployment:
1. ✅ Test all features
2. ✅ Share URL with stakeholders
3. ✅ Set up monitoring
4. ✅ Add custom domain (optional)
5. ✅ Set up automated backups

---

**Total Time**: ~30 minutes
**Total Cost**: $0/month

🎉 **Happy Deploying!**
