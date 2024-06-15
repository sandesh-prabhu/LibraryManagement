const jwt = require("jsonwebtoken");
const { BlackListToken } = require("../models/tokenModel");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const tokenExists = await BlackListToken.findOne({ token });
    if (tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Token has been blacklisted, please login",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, accessTokenSecret);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        console.error("Token has expired");
        return res
          .status(401)
          .json({ success: false, message: "Token has expired" });
      } else if (err.name === "JsonWebTokenError") {
        console.error("Token is invalid");
        return res
          .status(401)
          .json({ success: false, message: "Token is invalid" });
      } else {
        console.error("Token verification failed:", err.message);
        return res
          .status(401)
          .json({ success: false, message: "Token verification failed" });
      }
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const checkAdmin = async (req, res, next) => {
  try {
    if (req?.user?.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "No admin access",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { authenticateToken, checkAdmin };
