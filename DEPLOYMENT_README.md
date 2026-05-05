# 🚀 WetLabs - Automated Deployment Ready

## ✅ What's Already Configured

I've automatically set up everything that can be automated:

### 1. **Git Repository** ✅
- Repository: https://github.com/amadilemajid/Wetlabs
- All code committed and pushed
- Ready for deployment

### 2. **Deployment Configuration Files** ✅
- `render.yaml` - Render deployment config (auto-deploy enabled)
- `vercel.json` - Vercel deployment config
- `.github/workflows/deploy.yml` - GitHub Actions for CI/CD
- `.gitignore` - Proper environment variable protection

### 3. **Environment Templates** ✅
- `apps/api/.env.production.template` - API environment variables
- `apps/web/.env.production.template` - Frontend environment variables
- All your existing keys pre-filled (JWT, INTERNAL_API_KEY, etc.)

### 4. **Build Scripts** ✅
- `apps/api/render-build.sh` - Automated API build
- Package.json scripts for deployment

---

## 🎯 What You Need to Do (Only Human Tasks)

### **STEP 1: Get Free Service URLs (10 minutes)**

You need to sign up and get connection strings from these services:

#### A. Neon (Database)
1. Go to: https://neon.tech
2. Sign up with GitHub
3. Create project → Copy connection string
4. Save it (looks like): `postgresql://user:pass@host/db`

#### B. Upstash (Redis)
1. Go to: https://console.upstash.com
2. Sign up with GitHub
3. Create database → Copy Redis URL
4. Save it (looks like): `redis://default:pass@host:port`

#### C. CloudAMQP (RabbitMQ)
1. Go to: https://customer.cloudamqp.com
2. Sign up
3. Create "Little Lemur" instance → Copy AMQP URL
4. Save it (looks like): `amqp://user:pass@host/vhost`

---

### **STEP 2: Deploy Backend to Render (5 minutes)**

1. Go to: https://dashboard.render.com/register
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select repository: `amadilemajid/Wetlabs`
5. Render will **automatically detect** `render.yaml` configuration! 🎉
6. You only need to add these 3 environment variables:
   - `DATABASE_URL` = (your Neon URL)
   - `REDIS_URL` = (your Upstash URL)
   - `RABBITMQ_URL` = (your CloudAMQP URL)
7. Click "Create Web Service"
8. **Copy your API URL**: `https://wetlabs-api.onrender.com`

---

### **STEP 3: Deploy Frontend to Vercel (5 minutes)**

1. Go to: https://vercel.com/signup
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Select: `amadilemajid/Wetlabs`
5. Vercel will **automatically detect** `vercel.json` configuration! 🎉
6. Add ONE environment variable:
   - `VITE_API_BASE_URL` = `https://wetlabs-api.onrender.com/api/v1`
7. Click "Deploy"
8. **Copy your Frontend URL**: `https://wetlabs.vercel.app`

---

### **STEP 4: Update CORS (2 minutes)**

1. Go back to Render dashboard
2. Click your `wetlabs-api` service
3. Go to "Environment"
4. Update `CORS_ORIGIN` from `*` to your Vercel URL
5. Save (auto-redeploys)

---

## 🎉 Done! Test Your Deployment

### Test API:
```bash
curl https://wetlabs-api.onrender.com/api/v1/health
```

### Test Frontend:
Open: `https://wetlabs.vercel.app`

---

## 🔄 Automatic Deployments

After initial setup, deployments are **100% automatic**:

1. Push code to GitHub
2. Render automatically deploys API
3. Vercel automatically deploys Frontend
4. No manual steps needed!

```bash
git add .
git commit -m "Update feature"
git push origin main
# ✨ Automatic deployment triggered!
```

---

## 📊 Deployment Status

Check deployment status:
- **Render**: https://dashboard.render.com
- **Vercel**: https://vercel.com/dashboard
- **GitHub Actions**: https://github.com/amadilemajid/Wetlabs/actions

---

## 🆘 Quick Troubleshooting

### API not responding?
- Wait 60 seconds (Render free tier spins down)
- Check Render logs in dashboard

### CORS error?
- Verify CORS_ORIGIN matches your Vercel URL exactly

### Frontend blank?
- Check Vercel deployment logs
- Verify VITE_API_BASE_URL is correct

---

## 💡 Pro Tips

1. **Keep API Alive**: Use cron-job.org to ping every 10 minutes
2. **Monitor**: Set up UptimeRobot (free) for monitoring
3. **Backups**: Neon provides automatic database backups
4. **Logs**: Check Render logs regularly

---

## 📞 Support Links

- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Neon Dashboard: https://console.neon.tech
- Upstash Dashboard: https://console.upstash.com
- CloudAMQP Dashboard: https://customer.cloudamqp.com

---

## ✅ Deployment Checklist

- [ ] Get Neon database URL
- [ ] Get Upstash Redis URL
- [ ] Get CloudAMQP AMQP URL
- [ ] Deploy to Render (add 3 env vars)
- [ ] Deploy to Vercel (add 1 env var)
- [ ] Update CORS in Render
- [ ] Test API endpoint
- [ ] Test Frontend URL
- [ ] Share with users! 🎉

---

**Total Time**: ~20 minutes
**Total Cost**: $0/month forever
**Maintenance**: Automatic deployments on every push

🚀 **You're ready to deploy!**
