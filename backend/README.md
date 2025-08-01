# SCOPE Club Recruitment Backend

This is the backend API for the SCOPE Club recruitment website, built with Node.js, Express, and MongoDB Atlas.

## Features

- **Application Submission**: Handle form submissions and store in MongoDB
- **Data Validation**: Server-side validation for all form fields
- **Department-specific Questions**: Dynamic handling of different department requirements
- **Duplicate Prevention**: Check for existing applications by email/roll number
- **Admin API**: Endpoints for viewing and managing applications
- **Statistics**: Get application statistics and analytics

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

## Setup Instructions

### 1. MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**:
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set Up Database Access**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password (save these!)
   - Select "Read and write to any database"
   - Click "Add User"

4. **Set Up Network Access**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

### 2. Environment Configuration

1. **Update config.env**:
   ```bash
   # Open backend/config.env and replace the MONGODB_URI with your actual connection string
   MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/scope_recruitment?retryWrites=true&w=majority
   ```

2. **Replace placeholders**:
   - `your_username`: Your MongoDB Atlas username
   - `your_password`: Your MongoDB Atlas password
   - `your_cluster`: Your cluster name

### 3. Install Dependencies

```bash
cd backend
npm install
```

### 4. Start the Server

**Development mode (with auto-restart)**:
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Application Submission
- **POST** `/api/applications/submit`
  - Submit a new application
  - Body: Application form data

### Admin Endpoints
- **GET** `/api/applications/all`
  - Get all applications with pagination
  - Query params: `page`, `limit`, `department`, `status`, `search`

- **GET** `/api/applications/:id`
  - Get specific application by ID

- **PATCH** `/api/applications/:id/status`
  - Update application status
  - Body: `{ "status": "Pending|Under Review|Accepted|Rejected" }`

- **GET** `/api/applications/stats/overview`
  - Get application statistics

## Database Schema

The application data is stored with the following structure:

```javascript
{
  // Personal Information
  fullName: String,
  rollNumber: String,
  email: String, // @mlrit.ac.in only
  phoneNumber: String,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  
  // Academic Information
  currentSemester: Number,
  currentCGPA: Number,
  numberOfBacklogs: Number,
  
  // Department Selection
  department: String,
  
  // Department-specific Questions (conditional)
  technicalQuestions: Object,
  graphicQuestions: Object,
  photographyQuestions: Object,
  externalAffairsQuestions: Object,
  
  // Common Question
  whyScopeClub: String,
  
  // Metadata
  applicationStatus: String,
  submittedAt: Date,
  ipAddress: String,
  userAgent: String
}
```

## Validation Rules

- **Email**: Must be @mlrit.ac.in domain
- **Phone**: 10-digit number
- **CGPA**: 0-10 range
- **Semester**: 1-8 range
- **Backlogs**: Non-negative number
- **Department Questions**: Required based on department selection
- **Why SCOPE Club**: Minimum 50 characters

## Error Handling

The API returns consistent error responses:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": ["Validation error 1", "Validation error 2"] // For validation errors
}
```

## Security Features

- **Input Validation**: All inputs are validated server-side
- **Duplicate Prevention**: Prevents multiple applications from same email/roll number
- **CORS Configuration**: Configured for frontend access
- **Error Sanitization**: Errors don't expose sensitive information in production

## Deployment

### Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=your_frontend_domain
```

### Recommended Hosting Platforms

- **Heroku**: Easy deployment with MongoDB Atlas add-on
- **Railway**: Simple deployment with automatic environment setup
- **Render**: Free tier available with MongoDB Atlas integration
- **DigitalOcean**: More control with App Platform

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**:
   - Check your connection string
   - Verify username/password
   - Ensure IP is whitelisted in MongoDB Atlas

2. **CORS Errors**:
   - Update CORS_ORIGIN in config.env
   - Check frontend URL matches

3. **Validation Errors**:
   - Check all required fields are filled
   - Verify email format (@mlrit.ac.in)
   - Ensure department-specific questions are answered

### Logs

Check server logs for detailed error information:
```bash
npm run dev
```

## Support

For issues or questions:
- Check the troubleshooting section
- Review MongoDB Atlas documentation
- Contact the development team

## License

This project is for SCOPE Club MLRIT internal use only. 