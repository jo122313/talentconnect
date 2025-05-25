const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["applied", "review", "interview", "hired", "rejected"],
      default: "applied",
    },
    coverLetter: {
      type: String,
    },
    resume: {
      type: String, // URL to resume file specific to this application
    },
    notes: {
      type: String, // Employer notes about the candidate
    },
    interviewDate: {
      type: Date,
    },
    interviewNotes: {
      type: String,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one application per job per user
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true })
applicationSchema.index({ employer: 1, status: 1 })
applicationSchema.index({ applicant: 1 })

module.exports = mongoose.model("Application", applicationSchema)
