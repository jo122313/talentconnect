# Talent Connect Gateway - Complete Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Quick Start

### 1. Clone and Setup Backend

\`\`\`bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
\`\`\`

### 2. Configure Environment Variables

Update your `.env` file with:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/talent-connect
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email configuration (optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
\`\`\`

### 3. Setup Database

\`\`\`bash
# Make sure MongoDB is running locally, then create admin user
npm run create-admin
\`\`\`

### 4. Start Backend Server

\`\`\`bash
npm run dev
\`\`\`

Backend will be running on `http://localhost:5000`

### 5. Setup Frontend

\`\`\`bash
# Navigate to frontend directory (from project root)
cd ../

# Install dependencies (if not already done)
npm install

# Add environment variable for API URL
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env.local
\`\`\`

### 6. Start Frontend Server

\`\`\`bash
npm run dev
\`\`\`

Frontend will be running on `http://localhost:3000`

## Default Admin Credentials

After running the create-admin script:
- **Email:** admin@talentconnect.com
- **Password:** admin123456

⚠️ **Important:** Change the admin password after first login!

## API Endpoints Overview

### Authentication
- `POST /api/auth/register/jobseeker` - Register job seeker
- `POST /api/auth/register/employer` - Register employer  
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Jobs (Public)
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs/:id/apply` - Apply for job

### Employer Dashboard
- `GET /api/employer/jobs` - Get employer's jobs
- `POST /api/employer/jobs` - Create new job
- `GET /api/employer/applications` - Get applications

### Admin Dashboard  
- `GET /api/admin/employers` - Get employers for approval
- `PATCH /api/admin/employers/:id/status` - Approve/reject employer
- `GET /api/admin/users` - Get all users

## Testing the Integration

### 1. Test Job Seeker Registration
1. Go to `http://localhost:3000/register`
2. Select "Job Seeker" tab
3. Fill form and upload a resume (PDF/DOC)
4. Submit registration

### 2. Test Employer Registration
1. Go to `http://localhost:3000/register`
2. Select "Employer" tab  
3. Fill form and upload business license
4. Submit - should redirect to pending page

### 3. Test Admin Approval
1. Login as admin at `http://localhost:3000/login`
2. Go to admin dashboard
3. Approve the pending employer
4. Employer can now login and post jobs

### 4. Test Job Application Flow
1. Employer posts a job
2. Job seeker applies for the job
3. Employer reviews application in dashboard
4. Update application status

## File Upload Structure

\`\`\`
backend/uploads/
├── resumes/          # Job seeker resumes
├── licenses/         # Business licenses  
└── profiles/         # Profile pictures
\`\`\`

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
\`\`\`bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talent-connect
\`\`\`

**Port Already in Use:**
\`\`\`bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in .env
PORT=5001
\`\`\`

### Frontend Issues

**API Connection Error:**
- Ensure backend is running on port 5000
- Check REACT_APP_API_URL in .env.local
- Verify CORS settings in backend

**File Upload Issues:**
- Check file size limits (5MB max)
- Verify file types (PDF/DOC for resumes, PDF/JPG for licenses)
- Ensure uploads directory exists and has write permissions

### Common Issues

**CORS Errors:**
- Backend CORS is configured for `http://localhost:3000`
- Update FRONTEND_URL in backend .env if using different port

**Authentication Issues:**
- Check JWT_SECRET is set in backend .env
- Verify token is being stored in localStorage
- Check browser network tab for 401 errors

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use production MongoDB URI
3. Configure email service
4. Set secure JWT secret
5. Deploy to Heroku, AWS, or similar

### Frontend Deployment  
1. Update REACT_APP_API_URL to production backend URL
2. Build production bundle: `npm run build`
3. Deploy to Vercel, Netlify, or similar

## Development Scripts

\`\`\`bash
# Backend
npm run dev          # Start with nodemon
npm run create-admin # Create admin user
npm start           # Production start

# Frontend  
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
\`\`\`

## Next Steps

1. **Email Integration:** Configure email service for notifications
2. **File Storage:** Set up cloud storage (AWS S3, Cloudinary)
3. **Search Enhancement:** Add Elasticsearch for advanced job search
4. **Real-time Features:** Add WebSocket for real-time notifications
5. **Payment Integration:** Add premium job posting features
6. **Analytics:** Add job view tracking and analytics

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check network tab in browser dev tools
5. Review backend logs for API errors

Happy coding! 🚀
\`\`\`
