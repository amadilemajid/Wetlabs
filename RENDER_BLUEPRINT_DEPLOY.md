# 🚀 Render Blueprint Deployment (Easiest Method)

## Why This Method?
Render will **automatically detect** your `render.yaml` file and configure everything for you!

---

## Step-by-Step Instructions

### 1. Get Your Database URLs First (10 minutes)

You already have these from before:

**Neon (PostgreSQL)**:
```
postgresql://neondb_owner:npg_BnNri5P3dvYp@ep-autumn-resonance-amrye4e9-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Upstash (Redis)**:
```
redis://default:gQAAAAAAAUkzAAIgcDI0YmQzNGQ5NTViYWI0MzZiYmRhOWFmODAwZjdjYWQ2MA@fancy-mantis-84275.upstash.io:6379
```

**CloudAMQP (RabbitMQ)**:
```
amqps://bkxercel:Jf0TRlIG752IYj_KSnl2JGWvDvxELswo@gerbil.rmq.cloudamqp.com/bkxercel
```

---

### 2. Deploy Using Blueprint (5 minutes)

#### Option A: Direct Blueprint Link (EASIEST!)

**Click this link**:
```
https://dashboard.render.com/select-repo?type=blueprint
```

This will:
1. Ask you to sign in with GitHub
2. Show a list of your repositories
3. Find and select `amadilemajid/Wetlabs`
4. Click "Connect"

#### Option B: From Dashboard

If the link doesn't work:

1. Go to: https://dashboard.render.com
2. Sign in with GitHub
3. Look for "Blueprints" in the left sidebar
4. Click "New Blueprint Instance"
5. Select your repository: `amadilemajid/Wetlabs`

---

### 3. Configure Environment Variables

Render will show you a form with all the variables from `render.yaml`.

**You only need to fill in 3 variables:**

1. **DATABASE_URL**
   ```
   postgresql://neondb_owner:npg_BnNri5P3dvYp@ep-autumn-resonance-amrye4e9-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```

2. **REDIS_URL**
   ```
   redis://default:gQAAAAAAAUkzAAIgcDI0YmQzNGQ5NTViYWI0MzZiYmRhOWFmODAwZjdjYWQ2MA@fancy-mantis-84275.upstash.io:6379
   ```

3. **RABBITMQ_URL**
   ```
   amqps://bkxercel:Jf0TRlIG752IYj_KSnl2JGWvDvxELswo@gerbil.rmq.cloudamqp.com/bkxercel
   ```

All other variables are already set in `render.yaml`!

---

### 4. Click "Apply" and Wait

1. Click "Apply" button
2. Render will create your service
3. Wait 5-10 minutes for deployment
4. Watch the logs for any errors

---

### 5. Get Your API URL

Once deployed, you'll see:
```
https://wetlabs-api.onrender.com
```

**Copy this URL** - you'll need it for Vercel!

---

## Alternative: Manual Web Service Creation

If Blueprint doesn't work, here's the manual method:

### Step 1: Connect Repository
1. Go to: https://dashboard.render.com
2. Click your profile icon (top right)
3. Click "Account Settings"
4. Click "GitHub" under "Connected Accounts"
5. Click "Configure" and give Render access to `Wetlabs` repository

### Step 2: Create Web Service Manually
1. Go back to dashboard: https://dashboard.render.com
2. Click "New" (top right) - it might say "New +" or just "New"
3. Select "Web Service" from dropdown
4. You should now see `amadilemajid/Wetlabs` in the list
5. Click "Connect"

### Step 3: Fill in Details
- **Name**: `wetlabs-api`
- **Region**: Oregon (or closest to you)
- **Branch**: `main`
- **Root Directory**: Leave empty
- **Runtime**: Node
- **Build Command**: `cd apps/api && npm install && npm run build`
- **Start Command**: `cd apps/api && npm start`
- **Plan**: Free

### Step 4: Add Environment Variables
Click "Advanced" and add all these:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://neondb_owner:npg_BnNri5P3dvYp@ep-autumn-resonance-amrye4e9-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
REDIS_URL=redis://default:gQAAAAAAAUkzAAIgcDI0YmQzNGQ5NTViYWI0MzZiYmRhOWFmODAwZjdjYWQ2MA@fancy-mantis-84275.upstash.io:6379
RABBITMQ_URL=amqps://bkxercel:Jf0TRlIG752IYj_KSnl2JGWvDvxELswo@gerbil.rmq.cloudamqp.com/bkxercel
JWT_PRIVATE_KEY_BASE64=LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2QUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktZd2dnU2lBZ0VBQW9JQkFRQzBjQ1FtbGVJekhPWUoKV0tudEsrZjU2VFpjUWNVdDFUcEFtcGFjVzFmMEUzQzd0akdpRjJIQlB3RFhQK0lwOERpNWduYzUxc2Q2UlM5NQpaVmthRFFMRkRoZ3hkY2xNMkFqQ2dmdnNkbjJrdWZrZmFwNzJuYnBRcnFLcVphckhab0orK2xyZlRnZlp3a2hOCnFBMUdTbjNwV3U5NFVFZU9ucGNhSjl5cCtOSVNjWTQ4UE5hL3IxNEwza0luaVBlaWV2OVRYWlRucjNkMkRFbU0KcUpwRy9aNUJKNDBTUGNLTU1xblpGT05MalJBOVJ4bWdsMm4vR1llR3V5KzEySDBhcDFvcUlOOTUwMk4zTjVzdApEbDJwclNVMEJ1UHQ3U0JtQWpYc1BrTXFjQm9ianF0Z3VMcFBqOVBodzFmSEY4S0JHbjY5NlBzMXE5MnNxZU5uCmlNMERQdVNsQWdNQkFBRUNnZ0VBUU9YS290UXE0TzVtY0hzaTF3cUJLM290VXA1WFFLWmVCc2x6SFRhZldrcTUKczlJU1pQWGE4NG5wRUFKS29vSGpyUmxYTDRib0JUcW9HaFlSSjVVQlo0V3J2dkpaM2hrZmdYSUYvYVVhaUtwWgpCMnN1Vkk0amFveDlOaU5OK3QwTVY0Wk5NOTdaWlFHRFJ1Y0lLejEwcnY5RmZUVUduNjI3dEMwZEtVYzBxMnZ2Cm5KdGRsNWJkUHFmUjQ4S0hSYzVEdFZHd1AxMkE5M3BiMnRJbFZrQWJ0MFA3WUR3RVY1c3ljWDF4cUYvS1Jkd0oKckI3dDVTVnJHaHRzSDExK3hKZlZkUFFFTlB6UFZKRCs5QzRWc2c2NzY0NjZ1T0VkQjJjSXBVc3lxaEUyc1VnVwpzbWxTU1UzRndOMXBCejFXaDdONTlMRnhZMktGeStzR3NDdERBd3pNT3dLQmdRRHlnRGg2NGxNalk4WHU4WHkwCnNxSnozT1ZqMWVQc0c5OVROQVJtbG1Cc085K2U5Y1hrazVNNndwS2lRa0JyL3BETTRHREVHbkc5RWRtVFRIUDIKRWd1MlhOM0gyaDJEY3lBam9Xdjh5V3lJR1lRR1FJUTZ2ZTZXRlluTGFyWkU3bnV0WTFhZ2kxVmxHYkorc0duZQpEOHNMMFpXemVkWDdrKzQwcXFETnJzN2NOd0tCZ1FDK2UzMDZ2Q2p6NWxkNUxjZEpIazAwRnF0a28rNm5LVE9uCmV2SE1pdkIydWRvbVlLTENsRmpBdHNZcDRqRG03c1Q5QnU1VkxUVENKZUF6dVRkMFkvZE1EOEdZTVBodVBmRkEKK3VKWDFxUTg2MDNZMVJjMGNjU0d1eDJJallOc2dlR2dLbEF0dGVuVEw1NmVIcFpUMFQ5Rk9GTENEWVRSWWdHRAowSmR4U3Jnd0F3S0JnSFJtdTdXd29idWhEc2VOUHhEMWxpa0xaVWl3eU1EeStCWFdLQzZlREJhbi9zVXNzQnJ5CkEzLzNHYSt0SVlNMUpJaFRROStkMmU2cGZNakpyL2Z6M1k5aHNFdFlGVWFkb2xXNEREL0E1OG5FaGEwQ2x2WWoKYVR5OWhmRVFmZ0ZFZ0RWUU02cklkdXNhbEtWZlJOSUV2ckFqb0RvUVIzaUZINWhFTnYvRDR5T3RBb0dBVDZIRQptcmRxejN3dWVZUi8yYnVIUHcxekhhSEM5Yk10MndoMDZiUDBEMDVuT3NBUGl4VUZmWnRyZ0xzRkFxWXpTQ3lMCm1xUkplQmpwZi9ZZ2p0SHo0cUo3cHFwaVVZUW54YWljMDJmeVJWMkJyL0oxdndFSXplS1AyRFNCQ3UzSmEzSUYKRHZjTUI3UFN0ZnZIa01iYmtvNlhXblRZWDhoL0phSWdqY1pVOWcwQ2dZQUZtTUJOd2hTdUJqbkdBWFFUd3RPYwpjakt4Tm5rbFpoL0dWQ0kxcFJJb05nS3RVZjAvS3Z0cE03MjlhSmt6cE5GQmtmdEUyUWFuNHJ4NGFpcEFJQ3ZwCnZldDRaekhGcVlOSUZRbnRsdG01aWxOa0loTTR2MTNmV0NNSWhDQTFBZ1M1NjIvMXpUVlRkaGp5WTk0SkFXaXkKb3EwSVBQVkpQVXVHUDVKek1zNXUyQT09Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K
JWT_PUBLIC_KEY_BASE64=LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF0SEFrSnBYaU14em1DVmlwN1N2bgorZWsyWEVIRkxkVTZRSnFXbkZ0WDlCTnd1N1l4b2hkaHdUOEExei9pS2ZBNHVZSjNPZGJIZWtVdmVXVlpHZzBDCnhRNFlNWFhKVE5nSXdvSDc3SFo5cExuNUgycWU5cDI2VUs2aXFtV3F4MmFDZnZwYTMwNEgyY0pJVGFnTlJrcDkKNlZydmVGQkhqcDZYR2lmY3FmalNFbkdPUER6V3Y2OWVDOTVDSjRqM29uci9VMTJVNTY5M2RneEpqS2lhUnYyZQpRU2VORWozQ2pES3AyUlRqUzQwUVBVY1pvSmRwL3htSGhyc3Z0ZGg5R3FkYUtpRGZlZE5qZHplYkxRNWRxYTBsCk5BYmo3ZTBnWmdJMTdENURLbkFhRzQ2cllMaTZUNC9UNGNOWHh4ZkNnUnArdmVqN05hdmRyS25qWjRqTkF6N2sKcFFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==
JWT_EXPIRES_IN=3600
MSISDN_PEPPER=64bc8111a21523b26e8fb544d17196acffaba0619be7a998bb96b1e492f0df68
AT_USSD_HMAC_SECRET=dummy_AT_hmac_secret
INTERNAL_API_KEY=eceb056c7444a01effe2a4094557dedcdac57099a18c4f085cbfd4665d1e0177
CORS_ORIGIN=*
AT_API_KEY=
AT_USERNAME=sandbox
SENDGRID_API_KEY=
SENTINEL_HUB_CLIENT_ID=
SENTINEL_HUB_CLIENT_SECRET=
S3_BUCKET=wetlabs-photos
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

### Step 5: Deploy
Click "Create Web Service" and wait!

---

## Next: Deploy Frontend to Vercel

Once your API is live, follow the Vercel steps from the original guide.

---

## Troubleshooting

**Can't find "New" button?**
- Look for "Dashboard" in the top navigation
- The button might be labeled differently: "Create", "Add New", or just a "+" icon

**Repository not showing?**
- Go to Account Settings → GitHub → Configure
- Make sure Render has access to your repository

**Blueprint not working?**
- Use the manual method above
- It's the same result, just more steps

---

## Need Help?

If you're still stuck, take a screenshot of your Render dashboard and I can guide you through the exact buttons to click!
