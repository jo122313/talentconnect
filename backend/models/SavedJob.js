const mongoose = require("mongoose")

const savedJobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Ensure one save per job per user
savedJobSchema.index({ user: 1, job: 1 }, { unique: true })
savedJobSchema.index({ user: 1 })

module.exports = mongoose.model("SavedJob", savedJobSchema)
