const User = require("../models/userModel");
const { RefreshToken, BlackListToken } = require("../models/tokenModel");
const bcrypt = require("bcrypt");
const { createTokens } = require("../utils/tokens");

const signup = async (req, res) => {
  try {
    const name = req?.body?.name;
    const email = req?.body?.email;
    const password = req?.body?.password;

    const existUser = await User.findOne({ email: email.toLowerCase() });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists, please login" });
    }

    const user = await new User({
      name,
      email: email.toLowerCase(),
      password: password,
    }).save();

    const [accessToken, refreshToken] = await createTokens(user);

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User Created Successfully",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const email = req?.body?.email;
    const password = req?.body?.password;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User doesnt exists, please signup" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Incorrect password, please try again" });
    }

    const [accessToken, refreshToken] = await createTokens(user);

    res.cookie("refreshtoken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "User login successful", accessToken });
  } catch (err) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    await new BlackListToken({ token }).save();

    const refreshToken = req?.cookies?.refreshtoken;
    if (refreshToken) {
      const refreshTokenDoc = await RefreshToken.findOne({
        token: refreshToken,
      });
      if (refreshTokenDoc) {
        await refreshTokenDoc.deleteOne();
      }
    }

    res.status(200).json({ message: "User Logout Successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging out" });
  }
};

module.exports = { signup, login, logout };
