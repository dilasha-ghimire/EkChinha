const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

// Middleware to protect routes
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY || "yoursecretkey");
    req.user = decoded; // Attach decoded token payload to request
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
