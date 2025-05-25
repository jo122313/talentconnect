const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },
    salary: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "closed", "draft"],
      default: "active",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: String,
      enum: ["Entry Level", "1-3 years", "3-5 years", "5-10 years", "10+ years"],
    },
    education: {
      type: String,
      enum: ["High School", "Associate Degree", "Bachelor Degree", "Master Degree", "PhD"],
    },
    benefits: [
      {
        type: String,
      },
    ],
    applicationDeadline: {
      type: Date,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for search functionality
jobSchema.index({ title: "text", description: "text", location: "text" })
jobSchema.index({ company: 1, status: 1 })
jobSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Job", jobSchema)
