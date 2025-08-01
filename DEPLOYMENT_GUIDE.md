# 🚀 SCOPE Club Recruitment Website - Deployment Guide

This guide provides step-by-step instructions for deploying your SCOPE Club recruitment website to various platforms.

## 📋 Pre-Deployment Checklist

- [x] ✅ Dependencies installed (`npm install` in backend folder)
- [x] ✅ MongoDB Atlas connection configured
- [x] ✅ Environment variables set up
- [x] ✅ Git repository initialized
- [x] ✅ .gitignore configured

## 🌐 Deployment Options

### Option 1: Render (Recommended - Free & Easy)

**Render** is a modern cloud platform that offers free hosting for Node.js applications.

#### Steps:
1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub account

2. **Connect Repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: `scope-recruitment-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Environment Variables**
   - Add the following environment variables:
     - `NODE_ENV`: `production`
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `CORS_ORIGIN`: `*` (or your domain)
     - `PORT`: `10000` (Render will override this)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Your app will be available at: `https://your-app-name.onrender.com`

### Option 2: Railway (Alternative - Free Tier)

**Railway** is another excellent platform for Node.js deployment.

#### Steps:
1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure**
   - Railway will auto-detect Node.js
   - Set root directory to `backend`
   - Add environment variables in the Variables tab

4. **Environment Variables**
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `*`

### Option 3: Heroku (Paid - Professional)

**Heroku** is a popular platform for production deployments.

#### Steps:
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create scope-recruitment-app
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   heroku config:set NODE_ENV="production"
   heroku config:set CORS_ORIGIN="*"
   ```

5. **Deploy**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

### Option 4: Vercel (Frontend + Backend)

**Vercel** can host both frontend and backend.

#### Steps:
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Configure**
   - Set root directory to `backend`
   - Add environment variables in Vercel dashboard

## 🔧 Environment Variables Setup

### Required Variables:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
CORS_ORIGIN=*
PORT=5000
```

### Optional Variables:
```env
NODE_ENV=development
```

## 📱 Frontend Deployment

Since your backend serves static files, the frontend will be automatically deployed with the backend. However, you can also deploy just the frontend to:

### Netlify (Frontend Only)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your frontend files (index.html, styles.css, script.js)
3. Update API endpoints in script.js to point to your deployed backend

### GitHub Pages (Frontend Only)
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Select source branch (main)
4. Your site will be available at: `https://username.github.io/repository-name`

## 🔒 Security Considerations

### Production Checklist:
- [ ] Use HTTPS (automatic on most platforms)
- [ ] Set proper CORS origins (not `*` in production)
- [ ] Use environment variables for sensitive data
- [ ] Enable MongoDB Atlas network access
- [ ] Set up proper error logging
- [ ] Configure rate limiting (optional)

### CORS Configuration:
```javascript
// For production, specify exact domains
app.use(cors({
    origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
    credentials: true
}));
```

## 📊 Monitoring & Analytics

### Recommended Tools:
1. **Uptime Monitoring**: UptimeRobot (free)
2. **Error Tracking**: Sentry (free tier)
3. **Analytics**: Google Analytics
4. **Performance**: Lighthouse CI

## 🚀 Post-Deployment Steps

1. **Test All Features**
   - Form submission
   - API endpoints
   - Static file serving
   - Error handling

2. **Update Frontend URLs**
   - If deploying frontend separately, update API endpoints
   - Test form submission to new backend URL

3. **Set Up Custom Domain** (Optional)
   - Configure DNS settings
   - Set up SSL certificate
   - Update CORS origins

4. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Set up alerts

## 🔄 Continuous Deployment

### GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

## 📞 Support & Troubleshooting

### Common Issues:
1. **MongoDB Connection Failed**
   - Check connection string
   - Verify network access in MongoDB Atlas
   - Ensure IP whitelist includes deployment platform

2. **CORS Errors**
   - Update CORS_ORIGIN environment variable
   - Check frontend URL matches allowed origins

3. **Static Files Not Loading**
   - Verify file paths in server.js
   - Check if files are included in deployment

4. **Environment Variables Not Working**
   - Restart deployment after adding variables
   - Check variable names match exactly

### Getting Help:
- Check platform-specific documentation
- Review server logs in deployment dashboard
- Test locally with production environment variables

---

## 🎉 Deployment Complete!

Once deployed, your SCOPE Club recruitment website will be accessible worldwide! 

**Next Steps:**
1. Share the deployment URL with your team
2. Test all functionality thoroughly
3. Set up monitoring and analytics
4. Consider setting up a custom domain

**Remember:** Keep your MongoDB connection string and other sensitive data secure by using environment variables! 