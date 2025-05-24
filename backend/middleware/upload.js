const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ['uploads', 'uploads/resumes', 'uploads/licenses'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'resume') {
      uploadPath += 'resumes/';
    } else if (file.fieldname === 'businessLicense') {
      uploadPath += 'licenses/';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Sanitize filename
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + sanitizedFilename);
  }
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = {
    resume: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    businessLicense: [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
  };

  const fieldTypes = {
    resume: 'Resume',
    businessLicense: 'Business License'
  };

  if (!allowedMimeTypes[file.fieldname]) {
    return cb(new Error(`Invalid field name: ${file.fieldname}`), false);
  }

  if (!allowedMimeTypes[file.fieldname].includes(file.mimetype)) {
    return cb(new Error(
      `Invalid file type for ${fieldTypes[file.fieldname]}. ` +
      `Allowed types: ${allowedMimeTypes[file.fieldname].join(', ')}`
    ), false);
  }

  cb(null, true);
};

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 5MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next();
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file per upload
  }
});

module.exports = {
  upload,
  handleMulterError
};