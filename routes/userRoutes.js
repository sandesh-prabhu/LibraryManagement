const express = require("express");
const router = express.Router();
const { signup, login, logout } = require("../controllers/userControllers");
const { authenticateToken } = require("../middlewares/authentication");
const { newAccessToken } = require("../utils/tokens");
const { handleValidationErrors } = require("../validators/bookValidators");
const {
  validateUserSignup,
  validateUserLogin,
} = require("../validators/userValidators");

router.post("/signup", validateUserSignup, handleValidationErrors, signup);
router.post("/login", validateUserLogin, handleValidationErrors, login);
router.get("/refresh", newAccessToken);
router.get("/logout", authenticateToken, logout);

module.exports = router;
