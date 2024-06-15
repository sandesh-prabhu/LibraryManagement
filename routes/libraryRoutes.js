const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middlewares/authentication");
const {
  borrowBook,
  returnBook,
  getBorrowHistory,
  getMostBorrowedBooks,
  getActiveMembers,
  bookAvailability,
} = require("../controllers/libraryControllers");
const { handleValidationErrors } = require("../validators/bookValidators");
const {
  validateLibraryTransaction,
} = require("../validators/libraryValidators");

router.post(
  "/borrow-book",
  authenticateToken,
  validateLibraryTransaction,
  handleValidationErrors,
  borrowBook
);
router.post(
  "/return-book",
  authenticateToken,
  validateLibraryTransaction,
  handleValidationErrors,
  returnBook
);
router.get("/borrow-history", authenticateToken, getBorrowHistory);
router.get("/most-borrowed-books", getMostBorrowedBooks);
router.get("/active-members", getActiveMembers);
router.get("/book-availability", bookAvailability);

module.exports = router;
