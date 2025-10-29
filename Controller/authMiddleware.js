const jwt = require("jsonwebtoken");
require('dotenv').config();

/**
 * Authentication middleware to verify JWT token
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized: Invalid token" });

    // Attach decoded user info to request for further use
    req.user = decoded;
    next();
  });
};

/**
 * Role authorization middleware to check user role
 * @param {Array<string>} allowedRoles - array of roles allowed to access the route
 */
const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles
};
