# SCOPE Club Recruitment Website

A modern, professional recruitment website for the SCOPE Club at MLRIT. This website features a beautiful, responsive design with smooth animations and comprehensive form validation.

## 🚀 Features

- **Modern Design**: Clean, professional UI with gradient backgrounds and glassmorphism effects
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Form Validation**: Real-time validation with helpful error messages
- **Smooth Animations**: Scroll-triggered animations and interactive elements
- **Professional Typography**: Uses Inter font for excellent readability
- **Interactive Elements**: Hover effects, loading states, and success modals
- **Multi-Step Form**: Two-step form process for better user experience
- **Dynamic Department Questions**: Specific questions appear based on department selection
- **Backend Integration**: MongoDB Atlas database storage with Node.js/Express API
- **Data Persistence**: All applications are stored securely in the cloud
- **Admin API**: Endpoints for viewing and managing applications
- **Duplicate Prevention**: Prevents multiple applications from same email/roll number

## 📋 Form Fields Included

The website includes all the same form fields as your original design:

### Personal Information
- Full Name
- Email Address (college email)
- Roll Number

### Academic Information
- Academic Year (1st-4th year)
- Branch (CSE, ECE, EEE, ME, CE, AI&ML, DS)
- Current CGPA
- Number of Backlogs

### Additional Information
- Department Selection (Technical, Graphic Designing, Photography & Videography, External Affairs)
- Department-specific questions (dynamically shown based on selection):
  - **Technical**: WHY_TECHNICAL_TEAM, TECHNICAL_SKILLS, PROJECTS_WORKED_ON, PROJECT_LINKS, TECHNICAL_SKILLS_RATING
  - **Graphic Designing**: WHY_GRAPHIC_DESIGNING_TEAM, GRAPHIC_DESIGNING_SKILLS, GRAPHIC_DESIGNING_PORTFOLIO, GRAPHIC_DESIGNING_LINKS, GRAPHIC_DESIGNING_SKILLS_RATING
  - **Photography & Videography**: WHY_PHOTOGRAPHY_VIDEOGRAPHY_TEAM, PHOTOGRAPHY_VIDEOGRAPHY_SKILLS, PHOTOGRAPHY_VIDEOGRAPHY_PORTFOLIO, PHOTOGRAPHY_VIDEOGRAPHY_LINKS, PHOTOGRAPHY_VIDEOGRAPHY_SKILLS_RATING
  - **External Affairs**: WHY_EXTERNAL_AFFAIRS_TEAM, EXTERNAL_AFFAIRS_SKILLS, EXTERNAL_AFFAIRS_EXPERIENCE, EXTERNAL_AFFAIRS_LINKS, EXTERNAL_AFFAIRS_SKILLS_RATING
- Why SCOPE Club (text area - common for all departments)

## 🛠️ Setup Instructions

### Frontend (Website)
1. **Download Files**: All files are ready to use
2. **Open in Browser**: Simply open `index.html` in any modern web browser
3. **No Server Required**: The website works completely offline

### Backend (Database Integration)
1. **Navigate to Backend**: `cd backend`
2. **Install Dependencies**: `npm install`
3. **Configure MongoDB**: Update `config.env` with your MongoDB Atlas connection string
4. **Start Server**: `npm run dev`
5. **Access Website**: Open `http://localhost:5000` in your browser

For detailed backend setup instructions, see [backend/README.md](backend/README.md)

## 📁 File Structure

```
scope/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and animations
├── script.js               # JavaScript functionality
├── README.md               # This file
└── backend/                # Backend API
    ├── server.js           # Express server setup
    ├── package.json        # Node.js dependencies
    ├── config.env          # Environment variables
    ├── models/             # Database models
    │   └── Application.js  # Application schema
    ├── routes/             # API routes
    │   └── applications.js # Application endpoints
    ├── start.bat           # Windows startup script
    └── README.md           # Backend documentation
```

## 🎨 Customization

### Colors
The website uses a modern color palette. You can customize colors in `styles.css`:

- **Primary Gradient**: `#667eea` to `#764ba2`
- **Secondary Gradient**: `#11998e` to `#38ef7d`
- **Text Colors**: `#2d3748` (dark), `#718096` (medium), `#a0aec0` (light)

### Content
- **Club Information**: Update contact details in the hero section
- **Form Options**: Modify branch and department options in the HTML
- **Validation Rules**: Adjust validation patterns in `script.js`

### Styling
- **Fonts**: Currently uses Inter font from Google Fonts
- **Animations**: Customize animation speeds and effects in CSS
- **Layout**: Adjust spacing and sizing in the CSS variables

## 🔧 Form Submission

The form is now fully integrated with a MongoDB Atlas backend! When users submit applications:

1. **Data Validation**: Server-side validation ensures data integrity
2. **Database Storage**: Applications are stored in MongoDB Atlas
3. **Duplicate Prevention**: Prevents multiple applications from same email/roll number
4. **Success Feedback**: Users receive confirmation with application details
5. **Error Handling**: Clear error messages for validation failures

### API Endpoints Available

- **POST** `/api/applications/submit` - Submit new application
- **GET** `/api/applications/all` - Get all applications (admin)
- **GET** `/api/applications/:id` - Get specific application
- **PATCH** `/api/applications/:id/status` - Update application status
- **GET** `/api/applications/stats/overview` - Get statistics

### Database Features

- **Secure Storage**: All data stored in MongoDB Atlas cloud database
- **Data Validation**: Comprehensive validation rules for all fields
- **Department-specific Questions**: Dynamic handling based on selection
- **Application Tracking**: Status tracking (Pending, Under Review, Accepted, Rejected)
- **Metadata Collection**: IP address, user agent, submission timestamp

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Desktop**: 1200px and above
- **Tablet**: 768px to 1199px
- **Mobile**: Below 768px

## 🎯 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🚀 Performance Features

- **Optimized CSS**: Efficient selectors and minimal reflows
- **Smooth Animations**: Hardware-accelerated transforms
- **Lazy Loading**: Elements animate in as they come into view
- **Minimal JavaScript**: Lightweight and fast

## 📞 Contact Information

The website displays your contact information prominently:
- **Instagram**: @mlrit_scope
- **Email**: scopeclub@mlrit.ac.in

## 🔄 Updates and Maintenance

To keep the website current:
1. Update contact information as needed
2. Modify form fields if requirements change
3. Update validation rules for new formats
4. Refresh content and messaging

## 📄 License

This website is created for SCOPE Club - MLRIT. Feel free to modify and use as needed for your club's recruitment process.

---

**Ready to launch your recruitment campaign?** 🚀

Simply open `index.html` in a web browser and your professional recruitment website is ready to go! 