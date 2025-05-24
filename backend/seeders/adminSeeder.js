// const mongoose = require('mongoose');
// const User = require('../models/User');
// const dotenv = require('dotenv');

// dotenv.config();

// const createAdmin = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);

//     const adminExists = await User.findOne({ email: 'yohanestamirat2023@gmail.com' });

//     if (!adminExists) {
//       const admin = new User({
//         fullName: 'Admin User',
//         email: 'yohanestamirat2023@gmail.com',
//         phone: '+251973006245',
//         password: 'yohtam@123',
//         role: 'admin'
//       });

//       await admin.save();
//       console.log('Admin account created successfully');
//     } else {
//       console.log('Admin account already exists');
//     }

//     mongoose.connection.close();
//   } catch (error) {
//     console.error('Error creating admin:', error);
//   }
// };

// createAdmin();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  const adminExists = await User.findOne({ role: "admin" });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    await User.create({
      fullName: "Admin",
      email: "yohanes@gmail.com",
      phone: "0911000000",
      password: hashedPassword,
      role: "admin",
      isApproved: true,
    });
    console.log("Admin user created");
  } else {
    console.log("Admin already exists");
  }

  mongoose.disconnect();
}

seedAdmin();
