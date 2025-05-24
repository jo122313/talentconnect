const router = require('express').Router();
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Create job
router.post('/', auth, async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      company: req.userId
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate('company', 'name')
      .sort('-createdAt');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job by id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;