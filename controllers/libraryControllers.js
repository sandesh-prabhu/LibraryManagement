const Book = require("../models/bookModel");
const BorrowingTransaction = require("../models/borrowModel");

const borrowBook = async (req, res) => {
  try {
    const memberId = req?.user?.userId;
    const bookId = req?.body?.bookId;

    const book = await Book.findById(bookId);

    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.numberOfCopies === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Book not available for borrowing" });
    }

    book.numberOfCopies--;
    await book.save();

    const transaction = await new BorrowingTransaction({
      memberId,
      bookId,
    }).save();

    return res.status(200).json({
      success: true,
      message: "Book borrowed successfully",
      transaction,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const memberId = req?.user?.userId;
    const bookId = req?.body?.bookId;

    const transaction = await BorrowingTransaction.findOneAndUpdate(
      { memberId, bookId, returnedAt: null },
      { returnedAt: new Date() },
      { new: true }
    );

    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Borrowing transaction not found" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { numberOfCopies: 1 } },
      { new: true }
    );
    if (!updatedBook) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Book returned successfully",
      transaction,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getBorrowHistory = async (req, res) => {
  try {
    const memberId = req?.user?.userId;

    let history = await BorrowingTransaction.find({ memberId }).populate({
      path: "bookId",
      select: "-numberOfCopies",
      model: "Book",
    });

    history = history.map((transaction) => {
      let data = transaction.toObject();
      const book = data.bookId;
      delete data.bookId;
      return { ...data, book };
    });

    return res.status(200).json({
      success: true,
      message: "History fetched successfully",
      count: history.length,
      history,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getMostBorrowedBooks = async (req, res) => {
  try {
    const mostBorrowedBooks = await BorrowingTransaction.aggregate([
      { $group: { _id: "$bookId", borrowCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      { $unwind: "$book" },
      { $sort: { borrowCount: -1 } },
      {
        $project: {
          _id: 0,
          borrowCount: 1,
          book: {
            _id: 1,
            title: 1,
            author: 1,
            publicationDate: 1,
            genre: 1,
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "",
      count: mostBorrowedBooks.length,
      mostBorrowedBooks,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getActiveMembers = async (req, res) => {
  try {
    const activeMembers = await BorrowingTransaction.aggregate([
      { $group: { _id: "$memberId", activeCount: { $sum: 1 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "member",
        },
      },
      { $unwind: "$member" },
      { $sort: { activeCount: -1 } },
      {
        $project: {
          _id: 0,
          activeCount: 1,
          member: {
            _id: 1,
            name: 1,
            email: 1,
            role: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "",
      count: activeMembers.length,
      activeMembers,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const bookAvailability = async (req, res) => {
  try {
    const borrowedBook = await BorrowingTransaction.aggregate([
      {
        $match: {
          returnedAt: null,
        },
      },
      {
        $group: {
          _id: null,
          borrowedCount: { $sum: 1 },
        },
      },
    ]);

    const availableBooks = await Book.aggregate([
      {
        $group: {
          _id: null,
          availableCount: { $sum: "$numberOfCopies" },
        },
      },
    ]);

    const borrowedBooksCount =
      borrowedBook.length > 0 ? borrowedBook[0].borrowedCount : 0;
    const availableBooksCount =
      availableBooks.length > 0 ? availableBooks[0].availableCount : 0;
    const totalBooksCount = borrowedBooksCount + availableBooksCount;

    return res.status(200).json({
      success: true,
      message: "",
      borrowedBooksCount,
      availableBooksCount,
      totalBooksCount,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getBorrowHistory,
  getMostBorrowedBooks,
  getActiveMembers,
  bookAvailability,
};
