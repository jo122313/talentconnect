const express = require("express")
const SavedJob = require("../models/SavedJob")
const Job = require("../models/Job")
const { auth, authorize } = require("../middleware/auth")

const router = express.Router()

// All routes require authentication and jobseeker role
router.use(auth)
router.use(authorize("jobseeker"))

// Save a job - POST /api/saved-jobs/:jobId
router.post("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user._id

    console.log(`Attempting to save job ${jobId} for user ${userId}`)

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: "Job not found" })
    }

    // Check if already saved
    const existingSave = await SavedJob.findOne({ user: userId, job: jobId })
    if (existingSave) {
      return res.status(400).json({ message: "Job already saved" })
    }

    // Save the job
    const savedJob = new SavedJob({ user: userId, job: jobId })
    await savedJob.save()

    console.log(`Job ${jobId} saved successfully for user ${userId}`)

    res.status(201).json({
      message: "Job saved successfully",
      savedJob: {
        id: savedJob._id,
        savedAt: savedJob.createdAt,
      },
    })
  } catch (error) {
    console.error("Save job error:", error)
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Remove saved job - DELETE /api/saved-jobs/:jobId
router.delete("/:jobId", async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user._id

    console.log(`Attempting to remove saved job ${jobId} for user ${userId}`)

    const savedJob = await SavedJob.findOneAndDelete({ user: userId, job: jobId })
    if (!savedJob) {
      return res.status(404).json({ message: "Saved job not found" })
    }

    console.log(`Saved job ${jobId} removed successfully for user ${userId}`)

    res.json({ message: "Job removed from saved list" })
  } catch (error) {
    console.error("Remove saved job error:", error)
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Get all saved jobs for user - GET /api/saved-jobs
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const userId = req.user._id

    console.log(`Getting saved jobs for user ${userId}`)

    const savedJobs = await SavedJob.find({ user: userId })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "fullName companyName location",
        },
      })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await SavedJob.countDocuments({ user: userId })

    console.log(`Found ${savedJobs.length} saved jobs for user ${userId}`)

    res.json({
      savedJobs,
      totalPages: Math.ceil(total / limit),
      currentPage: Number.parseInt(page),
      total,
    })
  } catch (error) {
    console.error("Get saved jobs error:", error)
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

// Check if job is saved - GET /api/saved-jobs/:jobId/status
router.get("/:jobId/status", async (req, res) => {
  try {
    const { jobId } = req.params
    const userId = req.user._id

    const savedJob = await SavedJob.findOne({ user: userId, job: jobId })

    res.json({
      isSaved: !!savedJob,
      savedAt: savedJob?.createdAt || null,
    })
  } catch (error) {
    console.error("Check saved job status error:", error)
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
})

module.exports = router
