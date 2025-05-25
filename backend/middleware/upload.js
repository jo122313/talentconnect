const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("cloudinary").v2

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure Cloudinary storage for different file types
const createCloudinaryStorage = (folder, allowedFormats) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `talent-connect/${folder}`,
      allowed_formats: allowedFormats,
      resource_type: "auto",
      public_id: (req, file) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        return `${file.fieldname}-${uniqueSuffix}`
      },
    },
  })
}

// Storage configurations for different file types
const resumeStorage = createCloudinaryStorage("resumes", ["pdf", "doc", "docx"])
const licenseStorage = createCloudinaryStorage("licenses", ["pdf", "jpg", "jpeg", "png"])
const profileStorage = createCloudinaryStorage("profiles", ["jpg", "jpeg", "png", "gif"])

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "resume") {
    // Allow PDF and DOC files for resumes
    if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      cb(null, true)
    } else {
      cb(new Error("Only PDF and DOC files are allowed for resumes"), false)
    }
  } else if (file.fieldname === "businessLicense") {
    // Allow PDF and image files for business licenses
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only PDF and image files are allowed for business licenses"), false)
    }
  } else if (file.fieldname === "profilePicture") {
    // Allow only image files for profile pictures
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed for profile pictures"), false)
    }
  } else {
    cb(new Error("Unexpected field"), false)
  }
}

// Create multer instances for different upload types
const resumeUpload = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
})

const licenseUpload = multer({
  storage: licenseStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
})

const profileUpload = multer({
  storage: profileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
})

module.exports = {
  resumeUpload,
  licenseUpload,
  profileUpload,
  cloudinary,
}
