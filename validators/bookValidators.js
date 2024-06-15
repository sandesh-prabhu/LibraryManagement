const { body, validationResult } = require("express-validator");

const isNotInFuture = (value) => {
  const inputDate = new Date(value);
  const currentDate = new Date();
  if (inputDate > currentDate) {
    throw new Error("Publication date cannot be in the future");
  }
  return true;
};

const addBookValidators = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .if(body("title").notEmpty())
    .isString()
    .withMessage("Title must be a string"),

  body("author")
    .notEmpty()
    .withMessage("Author is required")
    .if(body("author").notEmpty())
    .isString()
    .withMessage("Author must be a string"),

  body("isbn")
    .notEmpty()
    .withMessage("ISBN is required")
    .if(body("isbn").notEmpty())
    .isString()
    .withMessage("ISBN must be a string"),

  body("publicationDate")
    .notEmpty()
    .withMessage("Publication date is required in the format YYYY-MM-DD")
    .if(body("publicationDate").notEmpty())
    .isISO8601()
    .withMessage(
      "Publication Date must be a valid date in the format YYYY-MM-DD"
    )
    .bail()
    .custom(isNotInFuture),

  body("genre")
    .notEmpty()
    .withMessage("Genre is required")
    .if(body("genre").notEmpty())
    .isString()
    .withMessage("Genre must be a string"),

  body("numberOfCopies")
    .notEmpty()
    .withMessage("Number of copies is required")
    .if(body("numberOfCopies").notEmpty())
    .isInt({ min: 0 })
    .withMessage("Number of copies must be a non-negative integer"),
];

const editBookValidators = [
  body("title")
    .optional()
    .notEmpty()
    .withMessage("Title is required")
    .if(body("title").notEmpty())
    .isString()
    .withMessage("Title must be a string"),

  body("author")
    .optional()
    .notEmpty()
    .withMessage("Author is required")
    .if(body("author").notEmpty())
    .isString()
    .withMessage("Author must be a string"),

  body("isbn")
    .optional()
    .notEmpty()
    .withMessage("ISBN is required")
    .if(body("isbn").notEmpty())
    .isString()
    .withMessage("ISBN must be a string"),

  body("publicationDate")
    .optional()
    .notEmpty()
    .withMessage("Publication date is required in the format YYYY-MM-DD")
    .if(body("publicationDate").notEmpty())
    .isISO8601()
    .withMessage(
      "Publication Date must be a valid date in the format YYYY-MM-DD"
    )
    .bail()
    .custom(isNotInFuture),

  body("genre")
    .optional()
    .notEmpty()
    .withMessage("Genre is required")
    .if(body("genre").notEmpty())
    .isString()
    .withMessage("Genre must be a string"),

  body("numberOfCopies")
    .optional()
    .notEmpty()
    .withMessage("Number of copies is required")
    .if(body("numberOfCopies").notEmpty())
    .isInt({ min: 0 })
    .withMessage("Number of copies must be a non-negative integer"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, message: "", errors: errors.array() });
  }
  next();
};

module.exports = {
  addBookValidators,
  editBookValidators,
  handleValidationErrors,
};
