const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token provided, access denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    if (user.status === "suspended") {
      return res.status(403).json({ message: "Account suspended" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Token is not valid" })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Access denied" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Insufficient permissions",
        userRole: req.user.role,
        requiredRoles: roles,
      })
    }

    next()
  }
}

const checkEmployerStatus = (req, res, next) => {
  if (req.user.role === "employer") {
    if (req.user.status === "pending") {
      return res.status(403).json({
        message: "Account pending approval",
        status: "pending",
      })
    }

    if (req.user.status !== "approved") {
      return res.status(403).json({
        message: "Account not approved",
        status: req.user.status,
      })
    }
  }
  next()
}

module.exports = { auth, authorize, checkEmployerStatus }