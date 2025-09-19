const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to authenticate token
function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from the 'Authorization' header

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = user; // Save the decoded user information into the request object
    next(); // Call the next middleware or route handler
  });
}

module.exports = authMiddleware;
