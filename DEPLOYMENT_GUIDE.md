# Deployment Guide - Vercel (Frontend) + Backend Options

This guide covers deploying your CTM system frontend to Vercel and backend to a hosting platform.

---

## Table of Contents

1. [Frontend Deployment on Vercel](#frontend-deployment-on-vercel)
2. [Backend Deployment Options](#backend-deployment-options)
   - [Option A: Render (Recommended)](#option-a-render-recommended)
   - [Option B: Railway](#option-b-railway)
   - [Option C: Vercel Serverless (Advanced)](#option-c-vercel-serverless-advanced)
3. [Post-Deployment Configuration](#post-deployment-configuration)
4. [Troubleshooting](#troubleshooting)

---

## Frontend Deployment on Vercel

### Prerequisites
- GitHub account
- Repository pushed to GitHub
- Vercel account (free): https://vercel.com/signup

### Step 1: Prepare Frontend for Deployment

1. **Update hardcoded API URLs:**
   
   Your frontend currently has hardcoded URLs. I've created `src/config/api.js` for you.
   
   Now you need to update all files that use hardcoded URLs. Example:
   
   **Before:**
   ```javascript
   const response = await axios.get("http://localhost:5000/api/courses");
   ```
   
   **After:**
   ```javascript
   import API_BASE_URL from '../config/api';
   const response = await axios.get(`${API_BASE_URL}/courses`);
   ```
   
   Files that need updating:
   - `src/pages/Courses.jsx`
   - `src/pages/Home.jsx`
   - `src/pages/CourseDetails.jsx`
   - `src/pages/Login.jsx`
   - `src/pages/Register.jsx`
   - `src/pages/Enrollments.jsx`
   - `src/pages/Profile.jsx`
   - `src/pages/EditProfile.jsx`
   - `src/pages/ChangePassword.jsx`
   - `src/pages/ManageCourse.jsx`
   - `src/pages/LessonViewer.jsx`

2. **Environment Variable (OPTIONAL - Can set directly in Vercel):**
   
   You can create `.env.production` in root directory (optional):
   ```env
   VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
   ```
   
   **OR** set it directly in Vercel Dashboard (recommended - see Step 4).

### Step 2: Deploy to Vercel via Dashboard

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click "Add New..." → "Project"

2. **Import Git Repository:**
   - Connect your GitHub account if not already connected
   - Select your repository
   - Click "Import"

3. **Configure Project Settings:**
   
   **Root Directory:** (Leave empty if frontend is in root, or specify folder if separate)
   
   **Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables:**
   - Add environment variable:
     - Key: `VITE_API_BASE_URL`
     - Value: `https://your-backend-url.onrender.com/api` (Update after backend deployment)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Step 3: Deploy via Vercel CLI (Alternative)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to project root:**
   ```bash
   cd /path/to/WEBPROJECT
   ```

4. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Link to existing project? (No for first deployment)
   - Project name: `your-project-name`
   - Directory: `./` (current directory)
   - Override settings? (No)

5. **Set environment variables:**
   ```bash
   vercel env add VITE_API_BASE_URL production
   ```
   Enter your backend URL when prompted.

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## Backend Deployment Options

### Option A: Render (Recommended)

**Why Render?** Free tier, easy setup, perfect for Express.js applications.

#### Step 1: Prepare Backend

1. **Update CORS in `backend/server.js`:**
   
   Replace the CORS configuration:
   ```javascript
   // Replace this line:
   app.use(cors());
   
   // With:
   app.use(cors({
     origin: [
       'http://localhost:5173',
       'https://your-frontend.vercel.app'  // Add after frontend deployment
     ],
     credentials: true
   }));
   ```

2. **Create `render.yaml` in `backend/` directory:**
   ```yaml
   services:
     - type: web
       name: ctm-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 10000
         - key: MONGO_URI
           sync: false
         - key: JWT_SECRET
           sync: false
   ```

3. **Create `vercel.json` in `backend/` (for Vercel deployment if needed):**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

#### Step 2: Deploy to Render

1. **Create Render Account:**
   - Go to: https://render.com
   - Sign up (free tier available)

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service:**
   - **Name:** `ctm-backend` (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** `main` or `master`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for better performance)

4. **Environment Variables:**
   Add the following environment variables in Render dashboard:
   ```
   NODE_ENV = production
   PORT = 10000
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/ctm?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-min-32-chars
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your backend will be live at: `https://ctm-backend.onrender.com`

6. **Update MongoDB Atlas Whitelist:**
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (allows all IPs) OR Render's IP ranges
   - Save changes

7. **Update Frontend Environment Variable:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Update `VITE_API_BASE_URL` to: `https://ctm-backend.onrender.com/api`
   - Redeploy frontend

---

### Option B: Railway

**Why Railway?** Easy deployment, good free tier, automatic HTTPS.

#### Step 1: Prepare Backend

Same as Render - ensure CORS is configured properly.

#### Step 2: Deploy to Railway

1. **Create Railway Account:**
   - Go to: https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service:**
   - Railway will auto-detect Node.js
   - Set **Root Directory** to: `backend`
   - Set **Start Command** to: `npm start`

4. **Environment Variables:**
   Add in Railway dashboard:
   ```
   NODE_ENV = production
   PORT = (auto-set by Railway)
   MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/ctm?retryWrites=true&w=majority
   JWT_SECRET = your-super-secret-jwt-key-min-32-chars
   ```

5. **Deploy:**
   - Railway will auto-deploy
   - Get your URL: `https://your-project.up.railway.app`
   - Update frontend `VITE_API_BASE_URL` accordingly

---

### Option C: Vercel Serverless (Advanced)

**Note:** This requires restructuring your Express app into serverless functions. Not recommended unless you want to use Vercel for both.

If you want to proceed:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

3. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

4. **Modify `server.js` for serverless:**
   ```javascript
   // Add at the end of server.js
   export default app;  // For Vercel serverless
   
   // Keep the listen() for local development
   if (process.env.NODE_ENV !== 'production') {
     const PORT = process.env.PORT || 5000;
     app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
     });
   }
   ```

5. **Deploy:**
   ```bash
   vercel
   ```

6. **Set environment variables:**
   ```bash
   vercel env add MONGO_URI
   vercel env add JWT_SECRET
   ```

7. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## Post-Deployment Configuration

### 1. Update CORS on Backend

After both are deployed, update backend CORS to include your frontend URL:

**In `backend/server.js`:**
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'
  ],
  credentials: true
}));
```

Redeploy backend after changes.

### 2. Update Frontend Environment Variable

1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Update `VITE_API_BASE_URL` to your backend URL
4. Redeploy frontend

### 3. Update MongoDB Atlas Network Access

- Go to MongoDB Atlas Dashboard
- Network Access → Add IP Address
- Add: `0.0.0.0/0` (allows all) OR specific Render/Railway IPs
- Save

### 4. Test Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Test Frontend:**
   - Visit your Vercel URL
   - Try logging in/registering
   - Check browser console for errors

---

## Troubleshooting

### Common Issues

#### 1. **CORS Errors**

**Symptom:** `Access-Control-Allow-Origin` errors in browser console

**Solution:**
- Update backend CORS to include your frontend URL
- Ensure `credentials: true` is set
- Redeploy backend

#### 2. **Environment Variables Not Working (Frontend)**

**Symptom:** Frontend still using localhost API URL

**Solution:**
- Vite requires `VITE_` prefix for environment variables
- After adding env vars in Vercel, **redeploy** frontend
- Check: Vercel → Settings → Environment Variables → Redeploy

#### 3. **Backend Won't Start**

**Symptom:** Backend deployment fails

**Solution:**
- Check build logs in Render/Railway dashboard
- Verify all environment variables are set
- Check MongoDB connection string format
- Ensure PORT is set correctly (Render uses 10000, Railway auto-sets)

#### 4. **MongoDB Connection Failed**

**Symptom:** Backend can't connect to MongoDB

**Solution:**
- Check MongoDB Atlas Network Access (add `0.0.0.0/0` or specific IPs)
- Verify MONGO_URI is correct in environment variables
- Check MongoDB Atlas cluster is running

#### 5. **Frontend Build Fails**

**Symptom:** Vercel build fails

**Solution:**
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build script
- Verify all dependencies are in `package.json`, not just `package-lock.json`
- Check Node.js version compatibility

#### 6. **API Calls Return 404**

**Symptom:** Frontend can't reach backend endpoints

**Solution:**
- Verify backend URL in `VITE_API_BASE_URL`
- Ensure backend URL ends with `/api` (if that's your base path)
- Check backend is running and accessible
- Test backend URL directly in browser: `https://your-backend.onrender.com/api/health`

---

## Quick Deployment Checklist

### Frontend (Vercel)
- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Import repository to Vercel
- [ ] Set build settings (Framework: Vite)
- [ ] Add environment variable `VITE_API_BASE_URL` (after backend is deployed)
- [ ] Deploy
- [ ] Test deployment

### Backend (Render/Railway)
- [ ] Update CORS configuration
- [ ] Push code to GitHub
- [ ] Create Render/Railway account
- [ ] Create new web service
- [ ] Set root directory to `backend`
- [ ] Add environment variables:
  - [ ] `MONGO_URI`
  - [ ] `JWT_SECRET`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT` (if using Render, set to 10000)
- [ ] Deploy
- [ ] Update MongoDB Atlas Network Access
- [ ] Test backend health endpoint
- [ ] Update frontend `VITE_API_BASE_URL` with backend URL
- [ ] Redeploy frontend

---

## Cost Information

### Free Tier Limits

**Vercel (Frontend):**
- 100GB bandwidth/month
- Unlimited deployments
- Perfect for most projects

**Render (Backend):**
- Free tier: Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 512MB RAM
- Good for development/testing

**Railway (Backend):**
- $5 free credit/month
- Pay-as-you-go after
- No spin-down
- Better for production

**Recommendation:** Use Render for free tier, upgrade to Railway/paid Render for production.

---

## Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **Railway Dashboard:** https://railway.app/dashboard
- **MongoDB Atlas:** https://cloud.mongodb.com

---

## Support

If you encounter issues:
1. Check deployment logs in respective dashboards
2. Verify all environment variables are set correctly
3. Test backend endpoints directly using curl or Postman
4. Check browser console for frontend errors
5. Verify CORS configuration matches your frontend URL

---

**Last Updated:** November 2025

