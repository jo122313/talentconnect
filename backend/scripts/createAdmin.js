const mongoose = require("mongoose")
const User = require("../models/User")
require("dotenv").config()

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/talent-connect")

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" })
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email)
      process.exit(0)
    }

    // Create admin user
    const adminData = {
      fullName: "System Administrator",
      email: "admin@talentconnect.com",
      phone: "+1234567890",
      password: "admin123456", // Change this in production
      role: "admin",
      status: "active",
      isEmailVerified: true,
    }

    const admin = new User(adminData)
    await admin.save()

    console.log("Admin user created successfully!")
    console.log("Email:", admin.email)
    console.log("Password: admin123456")
    console.log("Please change the password after first login.")

    process.exit(0)
  } catch (error) {
    console.error("Error creating admin:", error)
    process.exit(1)
  }
}

createAdmin()
