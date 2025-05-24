const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get all companies (approved employers)
router.get('/', async (req, res) => {
  try {
    const companies = await User.find({ 
      role: 'employer',
      status: 'approved'
    }).select('-password -businessLicense');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get company by id
router.get('/:id', async (req, res) => {
  try {
    const company = await User.findOne({
      _id: req.params.id,
      role: 'employer',
      status: 'approved'
    }).select('-password -businessLicense');
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;