# ✅ Deployment Checklist

## What's Already Done ✅
- [x] Created production environment templates
- [x] Created Vercel configuration
- [x] Created Render build script
- [x] Committed to Git
- [x] Pushed to GitHub

---

## What You Need to Do Now 📋

### STEP 1: Sign Up (10 min)
- [ ] Neon: https://neon.tech → Get PostgreSQL URL
- [ ] Upstash: https://upstash.com → Get Redis URL
- [ ] CloudAMQP: https://cloudamqp.com → Get AMQP URL

### STEP 2: Deploy Backend (10 min)
- [ ] Render: https://dashboard.render.com/register
- [ ] Create Web Service
- [ ] Connect GitHub repo: `amadilemajid/Wetlabs`
- [ ] Root Directory: `apps/api`
- [ ] Add environment variables (see MANUAL_DEPLOYMENT_STEPS.md)
- [ ] Deploy and copy API URL

### STEP 3: Deploy Frontend (10 min)
- [ ] Vercel: https://vercel.com/signup
- [ ] Import project: `amadilemajid/Wetlabs`
- [ ] Root Directory: `apps/web`
- [ ] Add environment variables (use your Render API URL)
- [ ] Deploy and copy Frontend URL

### STEP 4: Update CORS (2 min)
- [ ] Go to Render dashboard
- [ ] Update CORS_ORIGIN to your Vercel URL
- [ ] Save and wait for redeploy

### STEP 5: Test (3 min)
- [ ] Test API: `https://your-api.onrender.com/api/v1/health`
- [ ] Test Frontend: `https://your-app.vercel.app`
- [ ] Check browser console for errors

---

## 🎯 Your URLs

After deployment, fill these in:

**Frontend**: ___________________________________

**API**: ___________________________________

---

## 📚 Full Instructions

Open: `MANUAL_DEPLOYMENT_STEPS.md`

---

**Total Time**: ~30 minutes
**Total Cost**: $0/month
