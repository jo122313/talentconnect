const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.registerJobSeeker = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: 'jobseeker',
      resume: req.file ? req.file.filename : ''
    });

    // Generate token
    const token = createToken(user);

    res.status(201).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (err) {
    console.error('Job seeker registration error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error registering job seeker'
    });
  }
};

exports.registerEmployer = async (req, res) => {
  try {
    const { fullName, email, phone, password, location } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password || !location) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      location,
      role: 'employer',
      businessLicense: req.file ? req.file.filename : '',
      isApproved: false
    });

    res.status(201).json({
      success: true,
      message: 'Employer registered successfully. Pending approval.',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (err) {
    console.error('Employer registration error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error registering employer'
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if employer is approved
    if (user.role === 'employer' && !user.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = createToken(user);

    res.json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error during login'
    });
  }
}; 