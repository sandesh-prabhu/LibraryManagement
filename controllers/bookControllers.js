const Book = require("../models/bookModel");
const BorrowingTransaction = require("../models/borrowModel");

const addBook = async (req, res) => {
  try {
    if (req?.user?.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "No admin access",
      });
    }

    const title = req?.body?.title;
    const author = req?.body?.author;
    const isbn = req?.body?.isbn;
    const publicationDate = req?.body?.publicationDate;
    const genre = req?.body?.genre;
    const numberOfCopies = req?.body?.numberOfCopies?.toString();

    const book = await new Book({
      title,
      author,
      isbn,
      publicationDate,
      genre,
      numberOfCopies,
    }).save();
    return res
      .status(201)
      .send({ success: true, message: "Book added.", book });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const editBook = async (req, res) => {
  try {
    const bookId = req?.params?.bookId;
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Id params required",
      });
    }

    const book = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).send({
        success: false,
        message: "Book doesn't exist",
      });
    }
    return res
      .status(200)
      .send({ success: true, message: "Book edited.", book });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req?.params?.bookId;
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Id params required",
      });
    }
    const borrowedCopies = await BorrowingTransaction.find({
      bookId,
      returnedAt: null,
    });
    let book;
    if (borrowedCopies.length == 0) {
      book = await Book.findByIdAndDelete(bookId);
    } else {
      book = await Book.findByIdAndUpdate(
        bookId,
        { numberOfCopies: 0 },
        { new: true }
      );
    }
    if (!book) {
      return res.status(404).send({
        success: false,
        message: "Book doesn't exist",
      });
    }
    return res.status(200).send({
      success: true,
      message:
        borrowedCopies.length > 0
          ? `Removed existing copies. ${borrowedCopies.length} copies yet to be returned.`
          : "Book deleted.",
      book,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getAllBooks = async (req, res) => {
  try {
    let page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const title = req?.query?.title;
    const author = req?.query?.author;
    const genre = req?.query?.genre;

    const filter = {};
    if (title) filter.title = { $regex: new RegExp(title, "i") };
    if (genre) filter.genre = { $regex: new RegExp(genre, "i") };
    if (author) filter.author = { $regex: new RegExp(author, "i") };

    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    if (page > totalPages) {
      page = totalPages;
    }
    if (page == 0) {
      page = 1;
    }

    const books = await Book.find(filter)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    return res.send({
      success: true,
      books,
      count: totalBooks,
      totalPages: totalPages == 0 ? 1 : totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = { addBook, editBook, deleteBook, getAllBooks };
