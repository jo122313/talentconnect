const express = require("express")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const { resumeUpload, licenseUpload } = require("../middleware/upload")
const { auth } = require("../middleware/auth")
const { sendEmail } = require("../utils/emailService")

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  })
}

// Register Job Seeker
router.post(
  "/register/jobseeker",
  resumeUpload.single("resume"),
  [
    body("fullName").trim().isLength({ min: 2 }).withMessage("Full name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phone").isMobilePhone().withMessage("Please provide a valid phone number"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { fullName, email, phone, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" })
      }

      // Create user
      const userData = {
        fullName,
        email,
        phone,
        password,
        role: "jobseeker",
        status: "active",
      }

      if (req.file) {
        userData.resume = req.file.path // Cloudinary URL
      }

      const user = new User(userData)
      await user.save()

      // Send welcome email
      try {
        await sendEmail(user.email, "welcomeJobSeeker", user.fullName)
        console.log(`✅ Welcome email sent to ${user.email}`)
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError)
        // Don't fail registration if email fails
      }

      // Generate token
      const token = generateToken(user._id)

      res.status(201).json({
        message: "Job seeker registered successfully",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
    } catch (error) {
      console.error("Job seeker registration error:", error)
      res.status(500).json({
        message: "Server error during registration",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// Register Employer
router.post(
  "/register/employer",
  licenseUpload.single("businessLicense"),
  [
    body("fullName").trim().isLength({ min: 2 }).withMessage("Company name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("phone").isMobilePhone().withMessage("Please provide a valid phone number"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("location").trim().isLength({ min: 2 }).withMessage("Location is required"),
  ],
  async (req, res) => {
    try {
      console.log("Employer registration attempt:", {
        body: req.body,
        file: req.file ? { originalname: req.file.originalname, mimetype: req.file.mimetype } : null,
      })

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array())
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { fullName, email, phone, password, location } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" })
      }

      // Create employer user
      const userData = {
        fullName,
        email,
        phone,
        password,
        role: "employer",
        status: "pending", // Employers need admin approval
        companyName: fullName,
        location,
      }

      if (req.file) {
        console.log("File uploaded:", req.file.path)
        userData.businessLicense = req.file.path // Cloudinary URL
      }

      console.log("Creating user with data:", { ...userData, password: "[REDACTED]" })

      const user = new User(userData)
      await user.save()

      console.log("User created successfully:", user._id)

      res.status(201).json({
        message: "Employer registration submitted for approval",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
    } catch (error) {
      console.error("Employer registration error:", error)
      res.status(500).json({
        message: "Server error during registration",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { email, password } = req.body

      // Find user
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Check password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" })
      }

      // Check if account is suspended
      if (user.status === "suspended") {
        return res.status(403).json({ message: "Account suspended" })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Generate token
      const token = generateToken(user._id)

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error during login" })
    }
  },
)

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    res.json({
      user: req.user,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Logout (client-side token removal)
router.post("/logout", auth, (req, res) => {
  res.json({ message: "Logged out successfully" })
})

module.exports = router