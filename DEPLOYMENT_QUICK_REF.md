# 📋 WetLabs Deployment - Quick Reference Card

## 🎯 **5 Free Services You Need**

| # | Service | Sign Up | What to Copy |
|---|---------|---------|--------------|
| 1 | **Vercel** | https://vercel.com/signup | (No URL needed) |
| 2 | **Render** | https://render.com/register | (No URL needed) |
| 3 | **Neon** | https://neon.tech | PostgreSQL connection string |
| 4 | **Upstash** | https://upstash.com | Redis URL |
| 5 | **CloudAMQP** | https://cloudamqp.com | AMQP URL |

---

## ⚡ **30-Minute Deployment Steps**

### **1. Prepare (5 min)**
```bash
# Run preparation script
PREPARE_DEPLOYMENT.bat

# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/wetlabs.git
git push -u origin main
```

### **2. Deploy Backend (10 min)**
**On Render:**
- New Web Service → Connect GitHub
- Root: `apps/api`
- Build: `npm install && npm run build`
- Start: `npm start`
- Add environment variables (see below)
- Deploy!

**Copy API URL**: `https://wetlabs-api.onrender.com`

### **3. Deploy Frontend (10 min)**
**On Vercel:**
- Import GitHub repo
- Root: `apps/web`
- Framework: Vite
- Add environment variables (see below)
- Deploy!

**Copy Frontend URL**: `https://wetlabs.vercel.app`

### **4. Update CORS (2 min)**
**On Render:**
- Update `CORS_ORIGIN` to your Vercel URL
- Save (will redeploy)

### **5. Test (3 min)**
```bash
# Test API
curl https://wetlabs-api.onrender.com/api/v1/health

# Test Frontend
Open: https://wetlabs.vercel.app
```

---

## 🔑 **Environment Variables**

### **Render (Backend API)**
```
NODE_ENV=production
PORT=3001
DATABASE_URL=<neon-connection-string>
REDIS_URL=<upstash-redis-url>
RABBITMQ_URL=<cloudamqp-amqp-url>
JWT_PRIVATE_KEY_BASE64=<copy-from-local-.env>
JWT_PUBLIC_KEY_BASE64=<copy-from-local-.env>
JWT_EXPIRES_IN=3600
MSISDN_PEPPER=<copy-from-local-.env>
AT_USSD_HMAC_SECRET=<copy-from-local-.env>
INTERNAL_API_KEY=<copy-from-local-.env>
CORS_ORIGIN=https://wetlabs.vercel.app
```

### **Vercel (Frontend)**
```
VITE_API_BASE_URL=https://wetlabs-api.onrender.com/api/v1
VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
VITE_MAP_SATELLITE_URL=https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
VITE_INTERNAL_API_KEY=<copy-from-local-.env>
```

---

## 🔧 **Quick Troubleshooting**

| Problem | Solution |
|---------|----------|
| API not responding | Wait 60 seconds (spinning up) |
| CORS error | Update CORS_ORIGIN in Render |
| Database error | Check Neon connection string |
| Frontend blank | Check Vercel logs, verify API URL |

---

## 📞 **Quick Links**

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Neon Dashboard**: https://console.neon.tech
- **Upstash Dashboard**: https://console.upstash.com
- **CloudAMQP Dashboard**: https://customer.cloudamqp.com

---

## ⚠️ **Important Notes**

- ⚠️ Render free tier spins down after 15 min (first request takes 30-60s)
- ✅ Use cron-job.org to ping API every 10 minutes (keeps it awake)
- ✅ Never commit `.env` files to Git
- ✅ All services have generous free tiers

---

## 🎉 **After Deployment**

Your URLs:
- **Frontend**: `https://wetlabs.vercel.app`
- **API**: `https://wetlabs-api.onrender.com`

Share with anyone! 🌍

---

## 📚 **Full Documentation**

- `DEPLOYMENT_GUIDE.md` - Complete step-by-step guide
- `QUICK_DEPLOYMENT.md` - 30-minute quick start
- `DEPLOYMENT_SUMMARY.md` - Overview and tips

---

**Total Time**: 30 minutes
**Total Cost**: $0/month
**Accessibility**: Worldwide 🌍
