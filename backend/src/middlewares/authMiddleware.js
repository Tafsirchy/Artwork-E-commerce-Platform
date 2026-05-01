const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      
      if (!req.user) {
        console.warn(`AUTH: User ID ${decoded.id} from token not found in DB`);
        res.status(401);
        return next(new Error("User not found in database"));
      }
      
      next();
    } catch (error) {
      console.error("AUTH: Token verification failed:", error.message);
      res.status(401);
      next(new Error("Not authorized, token failed"));
    }
  }

  if (!token) {
    console.warn("AUTH: No token provided in headers");
    res.status(401);
    next(new Error("Not authorized, no token"));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.warn(`AUTH: User ${req.user?.email} attempted admin access but has role: ${req.user?.role}`);
    res.status(401);
    next(new Error("Not authorized as an admin"));
  }
};

module.exports = { protect, admin };
