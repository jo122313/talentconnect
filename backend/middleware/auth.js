const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token provided' 
      });
    }

    // Extract token
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User no longer exists' 
      });
    }

    // Add user info to request
    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during authentication' 
    });
  }
};

module.exports = auth;