const router = require('express').Router();
const Application = require('../models/Application');
const auth = require('../middleware/auth');

// Submit application
router.post('/', auth, async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      applicant: req.userId
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user applications
router.get('/my-applications', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.userId })
      .populate('job')
      .sort('-createdAt');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;