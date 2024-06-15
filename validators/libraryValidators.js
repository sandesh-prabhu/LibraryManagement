const { body } = require("express-validator");

const validateLibraryTransaction = [
  body("bookId")
    .notEmpty()
    .withMessage("bookId is required")
    .if(body("bookId").notEmpty())
    .isString()
    .withMessage("bookId in the form of a string"),
];

module.exports = { validateLibraryTransaction };
