# ⚡ Quick Deployment Checklist

## 🎯 **30-Minute Deployment Plan**

Follow these steps in order:

---

## ✅ **Phase 1: Sign Up (10 minutes)**

- [ ] Sign up for Vercel: https://vercel.com/signup
- [ ] Sign up for Render: https://render.com/register
- [ ] Sign up for Neon: https://neon.tech/
- [ ] Sign up for Upstash: https://upstash.com/
- [ ] Sign up for CloudAMQP: https://www.cloudamqp.com/

**Tip**: Use GitHub to sign up for all services (faster)

---

## ✅ **Phase 2: Get Connection Strings (5 minutes)**

### Neon (Database)
1. Create new project
2. Copy connection string
3. Format: `postgresql://user:pass@host/db`

### Upstash (Redis)
1. Create new database
2. Copy Redis URL
3. Format: `redis://default:pass@host:port`

### CloudAMQP (RabbitMQ)
1. Create "Little Lemur" instance
2. Copy AMQP URL
3. Format: `amqp://user:pass@host/vhost`

**Save all URLs in a text file!**

---

## ✅ **Phase 3: Push to GitHub (5 minutes)**

```bash
cd "c:\Users\AMADILE MAJID\Wetlabs"

# Initialize git
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub: https://github.com/new
# Name: wetlabs

# Push
git remote add origin https://github.com/YOUR_USERNAME/wetlabs.git
git branch -M main
git push -u origin main
```

---

## ✅ **Phase 4: Deploy Backend (5 minutes)**

### On Render:
1. New Web Service
2. Connect GitHub repo
3. Settings:
   - Root Directory: `apps/api`
   - Build: `npm install && npm run build`
   - Start: `npm start`
   - Plan: Free

4. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<your-neon-url>
   REDIS_URL=<your-upstash-url>
   RABBITMQ_URL=<your-cloudamqp-url>
   JWT_PRIVATE_KEY_BASE64=<copy-from-local-.env>
   JWT_PUBLIC_KEY_BASE64=<copy-from-local-.env>
   JWT_EXPIRES_IN=3600
   MSISDN_PEPPER=<copy-from-local-.env>
   AT_USSD_HMAC_SECRET=<copy-from-local-.env>
   INTERNAL_API_KEY=<copy-from-local-.env>
   CORS_ORIGIN=*
   ```

5. Deploy!

6. Copy API URL: `https://wetlabs-api.onrender.com`

---

## ✅ **Phase 5: Deploy Frontend (5 minutes)**

### On Vercel:
1. Import GitHub repo
2. Settings:
   - Root Directory: `apps/web`
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

3. Add Environment Variables:
   ```
   VITE_API_BASE_URL=https://wetlabs-api.onrender.com/api/v1
   VITE_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
   VITE_MAP_SATELLITE_URL=https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
   VITE_INTERNAL_API_KEY=<copy-from-local-.env>
   ```

4. Deploy!

5. Copy Frontend URL: `https://wetlabs.vercel.app`

---

## ✅ **Phase 6: Update CORS (2 minutes)**

1. Go back to Render
2. Update environment variable:
   ```
   CORS_ORIGIN=https://wetlabs.vercel.app
   ```
3. Save (will redeploy)

---

## ✅ **Phase 7: Setup Database (3 minutes)**

1. Go to Neon dashboard
2. Open SQL Editor
3. Run your migration SQL files
4. Create initial admin user (optional)

---

## ✅ **Phase 8: Test (5 minutes)**

### Test API:
```bash
curl https://wetlabs-api.onrender.com/api/v1/health
```

### Test Frontend:
1. Open: `https://wetlabs.vercel.app`
2. Check console for errors
3. Try to login
4. Check if map loads

---

## 🎉 **Done!**

Your app is now live at:
- **Frontend**: https://wetlabs.vercel.app
- **API**: https://wetlabs-api.onrender.com

---

## 📝 **Important Notes**

⚠️ **Render Free Tier**: API spins down after 15 min of inactivity
- First request after spin-down takes 30-60 seconds
- Solution: Use cron-job.org to ping every 10 minutes

⚠️ **Environment Variables**: Never commit `.env` files to Git

✅ **Free Forever**: All services have generous free tiers

---

## 🔧 **If Something Goes Wrong**

### API not responding:
- Check Render logs
- Verify environment variables
- Wait 60 seconds (might be spinning up)

### Frontend errors:
- Check Vercel deployment logs
- Verify API URL is correct
- Clear browser cache

### Database errors:
- Check Neon connection string
- Verify database is active
- Check if migrations ran

---

## 📞 **Quick Links**

- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- Neon Dashboard: https://console.neon.tech
- Upstash Dashboard: https://console.upstash.com
- CloudAMQP Dashboard: https://customer.cloudamqp.com

---

## 🚀 **Next Steps**

- [ ] Share your URL with others
- [ ] Set up custom domain (optional)
- [ ] Add monitoring
- [ ] Set up automated backups
- [ ] Configure error tracking

---

**Total Time**: ~30 minutes
**Total Cost**: $0/month 🎉
