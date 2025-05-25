const express = require("express")
const Application = require("../models/Application")
const User = require("../models/User")
const { auth, authorize } = require("../middleware/auth")
const { profileUpload, resumeUpload } = require("../middleware/upload")
const { body, validationResult } = require("express-validator")

const router = express.Router()

// All user routes require authentication
router.use(auth)

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json({ user })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put(
  "/profile",
  profileUpload.single("profilePicture"),
  [
    body("fullName").optional().trim().isLength({ min: 2 }).withMessage("Full name must be at least 2 characters"),
    body("phone").optional().isMobilePhone().withMessage("Please provide a valid phone number"),
    body("location").optional().trim(),
    body("skills").optional().isArray(),
    body("experience").optional().trim(),
    body("education").optional().trim(),
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

      const updateData = { ...req.body }

      // Handle profile picture upload
      if (req.file) {
        updateData.profilePicture = req.file.path // Cloudinary URL
      }

      // Parse skills if it's a string
      if (typeof updateData.skills === "string") {
        updateData.skills = updateData.skills.split(",").map((skill) => skill.trim())
      }

      const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true }).select(
        "-password",
      )

      res.json({
        message: "Profile updated successfully",
        user,
      })
    } catch (error) {
      console.error("Update profile error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update resume (job seekers only)
router.post("/resume", authorize("jobseeker"), resumeUpload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume file provided" })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { resume: req.file.path }, // Cloudinary URL
      { new: true },
    ).select("-password")

    res.json({
      message: "Resume updated successfully",
      resumeUrl: user.resume,
    })
  } catch (error) {
    console.error("Update resume error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's job applications (job seekers only)
router.get("/applications", authorize("jobseeker"), async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { applicant: req.user._id }

    if (status) {
      query.status = status
    }

    const applications = await Application.find(query)
      .populate("job", "title location type company")
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "fullName companyName",
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Application.countDocuments(query)

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error("Get user applications error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single application details
router.get("/applications/:id", authorize("jobseeker"), async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findOne({
      _id: id,
      applicant: req.user._id,
    })
      .populate("job", "title location type description requirements company")
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "fullName companyName location website",
        },
      })

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    res.json({ application })
  } catch (error) {
    console.error("Get application details error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Withdraw application
router.delete("/applications/:id", authorize("jobseeker"), async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findOne({
      _id: id,
      applicant: req.user._id,
    })

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Only allow withdrawal if application is in early stages
    if (["hired", "interview"].includes(application.status)) {
      return res.status(400).json({
        message: "Cannot withdraw application at this stage",
      })
    }

    await Application.findByIdAndDelete(id)

    // Update job applications count
    const Job = require("../models/Job")
    await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } })

    res.json({ message: "Application withdrawn successfully" })
  } catch (error) {
    console.error("Withdraw application error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get dashboard stats for job seekers
router.get("/dashboard/stats", authorize("jobseeker"), async (req, res) => {
  try {
    const userId = req.user._id

    const stats = await Promise.all([
      Application.countDocuments({ applicant: userId }),
      Application.countDocuments({ applicant: userId, status: "interview" }),
      Application.countDocuments({ applicant: userId, status: "hired" }),
      Application.countDocuments({ applicant: userId, status: "rejected" }),
    ])

    res.json({
      totalApplications: stats[0],
      interviews: stats[1],
      hired: stats[2],
      rejected: stats[3],
    })
  } catch (error) {
    console.error("User dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Change password
router.post(
  "/change-password",
  [
    body("currentPassword").exists().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
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

      const { currentPassword, newPassword } = req.body

      const user = await User.findById(req.user._id)
      const isMatch = await user.comparePassword(currentPassword)

      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      user.password = newPassword
      await user.save()

      res.json({ message: "Password changed successfully" })
    } catch (error) {
      console.error("Change password error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

module.exports = router
