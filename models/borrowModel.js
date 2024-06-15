const mongoose = require("mongoose");

const borrowingTransactionSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowedAt: {
    type: Date,
    required: true,
    default: new Date(),
  },
  returnedAt: {
    type: Date,
    default: null,
  },
});

const BorrowingTransaction = mongoose.model(
  "BorrowingTransaction",
  borrowingTransactionSchema
);

module.exports = BorrowingTransaction;
