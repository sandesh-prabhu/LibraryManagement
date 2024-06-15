const { body } = require("express-validator");

const validateUserSignup = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .if(body("name").notEmpty())
    .isString()
    .withMessage("Name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .if(body("email").notEmpty())
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const validateUserLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .if(body("email").notEmpty())
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .if(body("email").notEmpty())
    .isString()
    .withMessage("Password must be a string")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

module.exports = { validateUserSignup, validateUserLogin };
