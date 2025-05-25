const express = require("express")
const User = require("../models/User")
const Job = require("../models/Job")
const Application = require("../models/Application")
const { auth, authorize } = require("../middleware/auth")
const { sendEmail } = require("../utils/emailService")

const router = express.Router()

// All admin routes require authentication and admin role
router.use(auth)
router.use(authorize("admin"))

// Get dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments({ role: "jobseeker" }),
      User.countDocuments({ role: "employer", status: "approved" }),
      User.countDocuments({ role: "employer", status: "pending" }),
      Job.countDocuments({ status: "active" }),
      Application.countDocuments(),
    ])

    res.json({
      jobSeekers: stats[0],
      approvedEmployers: stats[1],
      pendingEmployers: stats[2],
      activeJobs: stats[3],
      totalApplications: stats[4],
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all employers for approval
router.get("/employers", async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { role: "employer" }

    if (status) {
      query.status = status
    }

    const employers = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      employers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get employers error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update employer status
router.patch("/employers/:id/status", async (req, res) => {
  try {
    const { status, reason } = req.body
    const { id } = req.params

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const employer = await User.findById(id)
    if (!employer || employer.role !== "employer") {
      return res.status(404).json({ message: "Employer not found" })
    }

    const previousStatus = employer.status
    employer.status = status
    await employer.save()

    // Send email notification if status changed
    if (previousStatus !== status) {
      try {
        if (status === "approved") {
          await sendEmail(employer.email, "employerApproved", employer.fullName || employer.companyName)
          console.log(`✅ Approval email sent to ${employer.email}`)
        } else if (status === "rejected") {
          await sendEmail(employer.email, "employerRejected", employer.fullName || employer.companyName, reason)
          console.log(`✅ Rejection email sent to ${employer.email}`)
        }
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError)
        // Don't fail the request if email fails
      }
    }

    res.json({
      message: `Employer status updated to ${status}`,
      employer: {
        id: employer._id,
        fullName: employer.fullName,
        email: employer.email,
        status: employer.status,
      },
    })
  } catch (error) {
    console.error("Update employer status error:", error)
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// Get all users
router.get("/users", async (req, res) => {
  try {
    const { role, page = 1, limit = 10, search } = req.query
    const query = {}

    if (role) {
      query.role = role
    }

    if (search) {
      query.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Don't allow deleting other admins
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin users" })
    }

    // Delete related data
    if (user.role === "employer") {
      await Job.deleteMany({ company: id })
      await Application.deleteMany({ employer: id })
    } else if (user.role === "jobseeker") {
      await Application.deleteMany({ applicant: id })
    }

    await User.findByIdAndDelete(id)

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

// Get all jobs
router.get("/jobs", async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query
    const query = {}

    if (status) {
      query.status = status
    }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { location: { $regex: search, $options: "i" } }]
    }

    const jobs = await Job.find(query)
      .populate("company", "fullName companyName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Job.countDocuments(query)

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete job
router.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params

    const job = await Job.findById(id)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    // Delete related applications
    await Application.deleteMany({ job: id })
    await Job.findByIdAndDelete(id)

    res.json({ message: "Job deleted successfully" })
  } catch (error) {
    console.error("Delete job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update job status
router.patch("/jobs/:id/status", async (req, res) => {
  try {
    const { status } = req.body
    const { id } = req.params

    if (!["active", "closed", "draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const job = await Job.findByIdAndUpdate(id, { status }, { new: true }).populate(
      "company",
      "fullName companyName email",
    )

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    res.json({
      message: `Job status updated to ${status}`,
      job,
    })
  } catch (error) {
    console.error("Update job status error:", error)
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    })
  }
})

module.exports = router
