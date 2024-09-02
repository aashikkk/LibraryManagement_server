const { Book, BorrowedBook } = require("../models");
const {
    sendSuccessResponse,
    sendErrorResponse,
} = require("../utils/responseHandler");

const getAvailableBooks = async (req, res) => {
    try {
        const books = await Book.find({ availability: true });
        sendSuccessResponse(res, books, "Books retrieved successfully", 200);
    } catch (err) {
        sendErrorResponse(res, err, "Failed to retrieve books", 500);
    }
};

const searchBooks = async (req, res) => {
    const { title, author } = req.query;

    if (title === "" && author === "") {
        return sendErrorResponse(
            res,
            null,
            "Please provide a search term",
            400
        );
    }

    try {
        const query = {};
        if (title) query.title = { $regex: title, $options: "i" };
        if (author) query.author = { $regex: author, $options: "i" };

        const books = await Book.find(query);
        sendSuccessResponse(res, books, "Books retrieved successfully");
    } catch (err) {
        sendErrorResponse(res, err, "Failed to retrieve books");
    }
};

const borrowBook = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user._id;

    if (!bookId) {
        return sendErrorResponse(res, null, "Book ID is required", 400);
    }

    try {
        const book = await Book.findById(bookId);
        if (!book || !book.availability) {
            return sendErrorResponse(res, null, "Book is not available", 400);
        }

        book.availability = false;
        await book.save();

        const borrowedBook = await BorrowedBook.create({
            user: userId,
            book: bookId,
            borrowedAt: new Date(),
        });

        sendSuccessResponse(
            res,
            borrowedBook,
            "Book borrowed successfully",
            201
        );
    } catch (err) {
        sendErrorResponse(res, err, "Failed to borrow book");
    }
};

const returnBook = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user._id;

    try {
        const borrowedBook = await BorrowedBook.findOne({
            user: userId,
            book: bookId,
        });
        if (!borrowedBook) {
            return sendErrorResponse(
                res,
                null,
                "No record found for this book borrowing",
                400
            );
        }

        await BorrowedBook.deleteOne({ _id: borrowedBook._id });

        const book = await Book.findById(bookId);
        if (!book) {
            return sendErrorResponse(res, null, "Book not found", 404);
        }
        book.availability = true;
        await book.save();

        sendSuccessResponse(res, null, "Book returned successfully");
    } catch (err) {
        sendErrorResponse(res, err, "Failed to return book");
    }
};

const getBorrowedBooks = async (req, res) => {
    const userId = req.user._id;
    console.log(userId);

    try {
        const borrowedBooks = await BorrowedBook.find({
            user: userId,
        }).populate("book");
        sendSuccessResponse(
            res,
            borrowedBooks,
            "Borrowed books retrieved successfully",
            200
        );
    } catch (err) {
        sendErrorResponse(res, err, "Failed to retrieve borrowed books", 500);
    }
};

module.exports = {
    getAvailableBooks,
    searchBooks,
    borrowBook,
    returnBook,
    getBorrowedBooks,
};
