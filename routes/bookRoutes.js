const express = require("express");
const {
  addBook,
  editBook,
  deleteBook,
  getAllBooks,
} = require("../controllers/bookControllers");
const {
  authenticateToken,
  checkAdmin,
} = require("../middlewares/authentication");
const router = express.Router();
const {
  addBookValidators,
  editBookValidators,
  handleValidationErrors,
} = require("../validators/bookValidators");

router.post(
  "/add",
  authenticateToken,
  checkAdmin,
  addBookValidators,
  handleValidationErrors,
  addBook
);
router.put(
  "/edit/:bookId",
  authenticateToken,
  checkAdmin,
  editBookValidators,
  handleValidationErrors,
  editBook
);
router.delete("/delete/:bookId", authenticateToken, checkAdmin, deleteBook);
router.get("/all", authenticateToken, getAllBooks);

module.exports = router;
