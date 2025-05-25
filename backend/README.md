# Talent Connect Gateway - Backend API

A comprehensive job portal backend built with Express.js, MongoDB, and Node.js.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin, Employer, Job Seeker)
  - Secure password hashing with bcrypt

- **User Management**
  - Job seeker registration with resume upload
  - Employer registration with business license upload
  - Admin approval workflow for employers
  - Profile management and updates

- **Job Management**
  - Create, read, update, delete job postings
  - Job search and filtering
  - Job application system
  - Application status tracking

- **File Upload System**
  - Resume uploads for job seekers
  - Business license uploads for employers
  - Profile picture uploads
  - Secure file storage and validation

- **Admin Dashboard**
  - User management
  - Employer approval system
  - Job posting moderation
  - System statistics

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd talent-connect-gateway/backend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   
   Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - Email service credentials
   - Cloudinary credentials (optional)

4. **Create Admin User**
   \`\`\`bash
   node scripts/createAdmin.js
   \`\`\`

5. **Start the server**
   \`\`\`bash
   # Development
   npm run dev
   
   # Production
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register/jobseeker` - Register job seeker
- `POST /api/auth/register/employer` - Register employer
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs/:id/apply` - Apply for job (job seekers)
- `GET /api/jobs/:id/application-status` - Check application status
- `GET /api/jobs/featured/list` - Get featured jobs
- `GET /api/jobs/stats/overview` - Get job statistics

### Employer Routes
- `GET /api/employer/dashboard/stats` - Get dashboard statistics
- `GET /api/employer/jobs` - Get employer's jobs
- `POST /api/employer/jobs` - Create new job
- `PUT /api/employer/jobs/:id` - Update job
- `PATCH /api/employer/jobs/:id/status` - Toggle job status
- `DELETE /api/employer/jobs/:id` - Delete job
- `GET /api/employer/applications` - Get job applications
- `PATCH /api/employer/applications/:id/status` - Update application status
- `GET /api/employer/applications/:id` - Get application details

### User Routes
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/resume` - Update resume (job seekers)
- `GET /api/user/applications` - Get user's applications
- `GET /api/user/applications/:id` - Get application details
- `DELETE /api/user/applications/:id` - Withdraw application
- `GET /api/user/dashboard/stats` - Get dashboard statistics
- `POST /api/user/change-password` - Change password

### Admin Routes
- `GET /api/admin/dashboard/stats` - Get admin dashboard stats
- `GET /api/admin/employers` - Get all employers
- `PATCH /api/admin/employers/:id/status` - Update employer status
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/jobs` - Get all jobs
- `DELETE /api/admin/jobs/:id` - Delete job
- `PATCH /api/admin/jobs/:id/status` - Update job status

## Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password, role, status)
- Job seeker fields (resume, skills, experience)
- Employer fields (company info, business license)

### Job Model
- Job details (title, description, requirements)
- Company information
- Job metadata (type, location, salary)
- Application tracking

### Application Model
- Job and user references
- Application status tracking
- Interview scheduling
- Employer notes

## File Upload Structure

\`\`\`
uploads/
├── resumes/          # Job seeker resumes
├── licenses/         # Business licenses
└── profiles/         # Profile pictures
\`\`\`

## Security Features

- Helmet.js for security headers
- Rate limiting
- Input validation and sanitization
- File upload restrictions
- JWT token authentication
- Password hashing with bcrypt
- CORS configuration

## Error Handling

The API includes comprehensive error handling:
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- File upload errors

## Development

### Running Tests
\`\`\`bash
npm test
\`\`\`

### Code Structure
\`\`\`
backend/
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── utils/           # Utility functions
├── scripts/         # Database scripts
├── uploads/         # File uploads
└── server.js        # Main server file
\`\`\`

## Deployment

1. Set environment variables
2. Ensure MongoDB is accessible
3. Configure file storage (local or cloud)
4. Set up email service
5. Deploy to your preferred platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
