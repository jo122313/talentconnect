const express = require("express")
const Job = require("../models/Job")
const Application = require("../models/Application")
const { auth, authorize } = require("../middleware/auth")

const router = express.Router()

// Get all jobs (public route)
router.get("/", async (req, res) => {
  try {
    const { search, location, type, page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc" } = req.query

    const query = { status: "active" }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ]
    }

    if (location) {
      query.location = { $regex: location, $options: "i" }
    }

    if (type) {
      query.type = type
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1

    const jobs = await Job.find(query)
      .populate("company", "fullName companyName location")
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Job.countDocuments(query)

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error("Get jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single job
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const job = await Job.findById(id).populate("company", "fullName companyName location website companyDescription")

    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    // Increment view count
    job.viewsCount += 1
    await job.save()

    res.json({ job })
  } catch (error) {
    console.error("Get job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Apply for a job (requires authentication)
router.post("/:id/apply", auth, authorize("jobseeker"), async (req, res) => {
  try {
    const { id } = req.params
    const { coverLetter } = req.body

    const job = await Job.findById(id).populate("company")
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    if (job.status !== "active") {
      return res.status(400).json({ message: "This job is no longer accepting applications" })
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: id,
      applicant: req.user._id,
    })

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" })
    }

    // Create application
    const application = new Application({
      job: id,
      applicant: req.user._id,
      employer: job.company._id,
      coverLetter,
      resume: req.user.resume, // Use user's uploaded resume
      status: "applied",
    })

    await application.save()

    // Update job applications count
    job.applicationsCount += 1
    await job.save()

    res.status(201).json({
      message: "Application submitted successfully",
      application: {
        id: application._id,
        status: application.status,
        appliedDate: application.createdAt,
      },
    })
  } catch (error) {
    console.error("Apply for job error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get job application status for current user
router.get("/:id/application-status", auth, authorize("jobseeker"), async (req, res) => {
  try {
    const { id } = req.params

    const application = await Application.findOne({
      job: id,
      applicant: req.user._id,
    })

    if (!application) {
      return res.json({ hasApplied: false })
    }

    res.json({
      hasApplied: true,
      status: application.status,
      appliedDate: application.createdAt,
    })
  } catch (error) {
    console.error("Get application status error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get featured/recommended jobs
router.get("/featured/list", async (req, res) => {
  try {
    const featuredJobs = await Job.find({ status: "active" })
      .populate("company", "fullName companyName location")
      .sort({ viewsCount: -1, createdAt: -1 })
      .limit(6)

    res.json({ jobs: featuredJobs })
  } catch (error) {
    console.error("Get featured jobs error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get job statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const stats = await Promise.all([
      Job.countDocuments({ status: "active" }),
      Job.distinct("company").then((companies) => companies.length),
      Application.countDocuments(),
      Job.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$location", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ])

    res.json({
      totalJobs: stats[0],
      totalCompanies: stats[1],
      totalApplications: stats[2],
      topLocations: stats[3],
    })
  } catch (error) {
    console.error("Get job stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
