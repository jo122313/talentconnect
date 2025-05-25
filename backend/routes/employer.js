const express = require("express")
const Job = require("../models/Job")
const Application = require("../models/Application")
const User = require("../models/User")
const { auth, authorize, checkEmployerStatus } = require("../middleware/auth")
const { body, validationResult } = require("express-validator")

const router = express.Router()

// All employer routes require authentication and employer role
router.use(auth)
router.use(authorize("employer"))
router.use(checkEmployerStatus)

// Get employer dashboard stats
router.get("/dashboard/stats", async (req, res) => {
  try {
    const employerId = req.user._id

    const stats = await Promise.all([
      Job.countDocuments({ company: employerId, status: "active" }),
      Job.countDocuments({ company: employerId }),
      Application.countDocuments({ employer: employerId }),
      Application.countDocuments({ employer: employerId, status: "interview" }),
    ])

    res.json({
      activeJobs: stats[0],
      totalJobs: stats[1],
      totalApplications: stats[2],
      interviewsScheduled: stats[3],
    })
  } catch (error) {
    console.error("Employer dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get employer's jobs
router.get("/jobs", async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const query = { company: req.user._id }

    if (status) {
      query.status = status
    }

    const jobs = await Job.find(query)
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
    console.error("Get employer jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new job
router.post(
  "/jobs",
  [
    body("title").trim().isLength({ min: 3 }).withMessage("Job title must be at least 3 characters"),
    body("description").trim().isLength({ min: 50 }).withMessage("Job description must be at least 50 characters"),
    body("requirements").trim().isLength({ min: 20 }).withMessage("Requirements must be at least 20 characters"),
    body("location").trim().isLength({ min: 2 }).withMessage("Location is required"),
    body("type").isIn(["Full-time", "Part-time", "Contract", "Internship"]).withMessage("Invalid job type"),
  ],
  async (req, res) => {
    try {
      console.log("Creating job with data:", req.body)
      console.log("User:", req.user._id)

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        console.log("Validation errors:", errors.array())
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const jobData = {
        ...req.body,
        company: req.user._id,
      }

      // Handle salary if provided
      if (req.body.salaryMin && req.body.salaryMax) {
        jobData.salary = {
          min: Number.parseInt(req.body.salaryMin),
          max: Number.parseInt(req.body.salaryMax),
          currency: "USD",
        }
        // Remove the individual salary fields
        delete jobData.salaryMin
        delete jobData.salaryMax
      }

      // Handle skills array
      if (req.body.skills && Array.isArray(req.body.skills)) {
        jobData.skills = req.body.skills
      }

      // Handle benefits array
      if (req.body.benefits && Array.isArray(req.body.benefits)) {
        jobData.benefits = req.body.benefits
      }

      console.log("Final job data:", jobData)

      const job = new Job(jobData)
      await job.save()

      console.log("Job created successfully:", job._id)

      res.status(201).json({
        message: "Job posted successfully",
        job,
      })
    } catch (error) {
      console.error("Create job error:", error)
      res.status(500).json({
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
      })
    }
  },
)

// Update job
router.put(
  "/jobs/:id",
  [
    body("title").trim().isLength({ min: 3 }).withMessage("Job title must be at least 3 characters"),
    body("description").trim().isLength({ min: 50 }).withMessage("Job description must be at least 50 characters"),
    body("requirements").trim().isLength({ min: 20 }).withMessage("Requirements must be at least 20 characters"),
    body("location").trim().isLength({ min: 2 }).withMessage("Location is required"),
    body("type").isIn(["Full-time", "Part-time", "Contract", "Internship"]).withMessage("Invalid job type"),
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

      const { id } = req.params
      const job = await Job.findOne({ _id: id, company: req.user._id })

      if (!job) {
        return res.status(404).json({ message: "Job not found" })
      }

      const updateData = { ...req.body }

      // Handle salary if provided
      if (req.body.salaryMin && req.body.salaryMax) {
        updateData.salary = {
          min: Number.parseInt(req.body.salaryMin),
          max: Number.parseInt(req.body.salaryMax),
          currency: "USD",
        }
        delete updateData.salaryMin
        delete updateData.salaryMax
      }

      const updatedJob = await Job.findByIdAndUpdate(id, updateData, { new: true })

      res.json({
        message: "Job updated successfully",
        job: updatedJob,
      })
    } catch (error) {
      console.error("Update job error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Toggle job status
router.patch("/jobs/:id/status", async (req, res) => {
  try {
    const { id } = req.params
    const job = await Job.findOne({ _id: id, company: req.user._id })

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    job.status = job.status === "active" ? "closed" : "active"
    await job.save()

    res.json({
      message: `Job ${job.status === "active" ? "activated" : "closed"} successfully`,
      job,
    })
  } catch (error) {
    console.error("Toggle job status error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete job
router.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params
    const job = await Job.findOne({ _id: id, company: req.user._id })

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

// Get applications for employer's jobs
router.get("/applications", async (req, res) => {
  try {
    const { status, jobId, page = 1, limit = 10 } = req.query
    const query = { employer: req.user._id }

    if (status) {
      query.status = status
    }

    if (jobId) {
      query.job = jobId
    }

    const applications = await Application.find(query)
      .populate("applicant", "fullName email phone resume skills experience education")
      .populate("job", "title location type")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Application.countDocuments(query)

    res.json({
      applications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get applications error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update application status
router.patch("/applications/:id/status", async (req, res) => {
  try {
    const { status, notes, interviewDate } = req.body
    const { id } = req.params

    if (!["applied", "review", "interview", "hired", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const application = await Application.findOne({
      _id: id,
      employer: req.user._id,
    }).populate("applicant", "fullName email")

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    application.status = status
    if (notes) application.notes = notes
    if (interviewDate) application.interviewDate = new Date(interviewDate)

    await application.save()

    // TODO: Send email notification to applicant about status change

    res.json({
      message: `Application status updated to ${status}`,
      application,
    })
  } catch (error) {
    console.error("Update application status error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single application details
router.get("/applications/:id", async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findOne({
      _id: id,
      employer: req.user._id,
    })
      .populate("applicant", "fullName email phone resume skills experience education")
      .populate("job", "title location type description requirements")

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    res.json({ application })
  } catch (error) {
    console.error("Get application details error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
