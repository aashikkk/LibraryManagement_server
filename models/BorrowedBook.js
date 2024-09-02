const mongoose = require("mongoose");

const BorrowedBookSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    borrowDate: { type: Date, default: Date.now },
});

const BorrowedBook = mongoose.model("BorrowedBook", BorrowedBookSchema);

module.exports = BorrowedBook;
