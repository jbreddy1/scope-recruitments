# 🚀 Complete Setup Guide - SCOPE Club Recruitment Website

This guide will help you set up the complete SCOPE Club recruitment website with MongoDB Atlas backend integration.

## 📋 What You'll Get

✅ **Professional Frontend**: Beautiful, responsive website with modern UI  
✅ **MongoDB Atlas Database**: Cloud database to store all applications  
✅ **Node.js Backend API**: RESTful API for data handling  
✅ **Form Validation**: Both client-side and server-side validation  
✅ **Duplicate Prevention**: Prevents multiple applications from same email/roll number  
✅ **Admin Features**: API endpoints for managing applications  
✅ **Real-time Data**: Applications stored immediately in database  

## 🛠️ Step-by-Step Setup

### Step 1: MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Click "Try Free" and create an account

2. **Create Database Cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider (AWS/Google Cloud/Azure)
   - Choose a region close to you
   - Click "Create"

3. **Set Up Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `scope_admin` (or any username)
   - Password: Create a strong password (save it!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" in left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### Step 2: Configure Backend

1. **Open `backend/config.env`**:
   ```bash
   # Replace the MONGODB_URI line with your actual connection string
   MONGODB_URI=mongodb+srv://scope_admin:your_password@your_cluster.mongodb.net/scope_recruitment?retryWrites=true&w=majority
   ```

2. **Replace the placeholders**:
   - `scope_admin`: Your MongoDB username
   - `your_password`: Your MongoDB password
   - `your_cluster`: Your cluster name (found in the connection string)

### Step 3: Install Dependencies

1. **Open Command Prompt/Terminal**
2. **Navigate to backend folder**:
   ```bash
   cd backend
   ```

3. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

### Step 4: Start the Server

1. **Start the backend server**:
   ```bash
   npm run dev
   ```

2. **You should see**:
   ```
   🚀 Server is running on port 5000
   📱 Frontend: http://localhost:5000
   🔗 API: http://localhost:5000/api
   ✅ Connected to MongoDB Atlas successfully!
   ```

### Step 5: Test the Website

1. **Open your browser**
2. **Go to**: `http://localhost:5000`
3. **Fill out the form** and submit
4. **Check the success message** with application details

## 🔍 Testing the Integration

### Test Form Submission

1. Fill out the complete form
2. Submit the application
3. You should see a success modal with:
   - Application ID
   - Your name
   - Selected department
   - Submission timestamp

### Test Database Storage

1. Go to MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Look for `scope_recruitment` database
4. Check the `applications` collection
5. You should see your submitted application

### Test API Endpoints

You can test the API endpoints using tools like Postman or curl:

```bash
# Get all applications
curl http://localhost:5000/api/applications/all

# Get application statistics
curl http://localhost:5000/api/applications/stats/overview
```

## 📊 Admin Features

Once applications start coming in, you can:

### View All Applications
```
GET http://localhost:5000/api/applications/all
```

### Get Application Statistics
```
GET http://localhost:5000/api/applications/stats/overview
```

### Update Application Status
```
PATCH http://localhost:5000/api/applications/:id/status
Body: { "status": "Accepted" }
```

## 🚨 Troubleshooting

### MongoDB Connection Issues

**Error**: "MongoDB connection error"
**Solution**: 
- Check your connection string in `config.env`
- Verify username and password
- Ensure IP is whitelisted in MongoDB Atlas

### Server Won't Start

**Error**: "Port already in use"
**Solution**:
- Change port in `config.env`: `PORT=5001`
- Or kill the process using port 5000

### Form Submission Fails

**Error**: "Network error"
**Solution**:
- Ensure backend server is running
- Check browser console for errors
- Verify API endpoint is correct

### Validation Errors

**Error**: "Validation failed"
**Solution**:
- Check all required fields are filled
- Ensure email is @mlrit.ac.in format
- Verify department-specific questions are answered

## 🔒 Security Features

- **Email Validation**: Only @mlrit.ac.in emails allowed
- **Duplicate Prevention**: One application per email/roll number
- **Input Sanitization**: All inputs are validated and sanitized
- **Error Handling**: No sensitive information exposed in errors

## 📱 Deployment Options

### For Production Use

1. **Heroku** (Recommended for beginners):
   - Connect your GitHub repository
   - Add MongoDB Atlas add-on
   - Deploy automatically

2. **Railway**:
   - Import from GitHub
   - Add environment variables
   - Deploy with one click

3. **Render**:
   - Connect GitHub repository
   - Set environment variables
   - Free tier available

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

## 🎉 You're All Set!

Your SCOPE Club recruitment website is now fully functional with:

✅ **Professional frontend** with modern UI  
✅ **MongoDB Atlas database** storing all applications  
✅ **Node.js backend API** handling data  
✅ **Form validation** and error handling  
✅ **Duplicate prevention**  
✅ **Admin API endpoints** for management  

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the backend logs: `npm run dev`
3. Check MongoDB Atlas dashboard for connection issues
4. Verify all environment variables are set correctly

## 🚀 Next Steps

1. **Customize the design** in `styles.css`
2. **Add admin panel** for managing applications
3. **Set up email notifications** for new applications
4. **Deploy to production** for live use
5. **Add authentication** for admin access

---

**Happy Recruiting! 🎓** 