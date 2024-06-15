const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  publicationDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  numberOfCopies: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
