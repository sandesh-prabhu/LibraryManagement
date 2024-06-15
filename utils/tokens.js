require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { RefreshToken } = require("../models/tokenModel");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const createTokens = async (user) => {
  try {
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      accessTokenSecret,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      refreshTokenSecret,
      {
        expiresIn: "7d",
      }
    );

    await new RefreshToken({
      token: refreshToken,
      userId: user._id,
    }).save();

    return [accessToken, refreshToken];
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const newAccessToken = async (req, res) => {
  try {
    const refreshToken = req?.cookies?.refreshtoken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Missing refresh token" });
    }

    let decodedJwt;
    try {
      decodedJwt = await jwt.verify(refreshToken, refreshTokenSecret);
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
    const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken });

    if (!refreshTokenDoc) {
      return res.status(401).json({ success: false, message: "Token expired" });
    } else if (refreshTokenDoc.expiresAt < Date.now()) {
      await refreshTokenDoc.deleteOne();
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    const user = await User.findById(decodedJwt.userId);
    if (!user) {
      await refreshTokenDoc.deleteOne();
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      accessTokenSecret,
      {
        expiresIn: "15m",
      }
    );

    await refreshTokenDoc.updateOne({
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }); // Refresh expiry

    return res.status(200).json({
      success: true,
      message: "accessToken created successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
};

module.exports = { createTokens, newAccessToken };
