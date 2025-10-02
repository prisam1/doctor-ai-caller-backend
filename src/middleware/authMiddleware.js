const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET, COOKIE_NAME } = process.env;

async function authMiddleware(req, res, next) {
  try {
    const token =
      req.cookies?.[COOKIE_NAME] ||
      req.headers.authorization?.split(" ")[1] ||
      (req.header("Authorization") &&
        req.header("Authorization").replace("Bearer ", ""));

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const userData = await User.findById(decoded.id).select("-passwordHash");
    if (!userData) return res.status(401).json({ message: "Unauthorized" });
    req.user = userData;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authMiddleware;
