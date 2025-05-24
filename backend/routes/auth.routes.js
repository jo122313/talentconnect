const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { upload, handleMulterError } = require('../middleware/upload');
const { registerJobSeeker, registerEmployer, login } = require('../controllers/auth.controller');

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email !== 'yohanestamirat2023@gmail.com') {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { userId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, role: 'admin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register job seeker route
router.post('/register/jobseeker', 
  upload.single('resume'),
  handleMulterError,
  registerJobSeeker
);

// Register employer route
router.post('/register/employer',
  upload.single('businessLicense'),
  handleMulterError,
  registerEmployer
);

// Login route
router.post('/login', login);

module.exports = router;