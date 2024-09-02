const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    bookId: { type: String, unique: true },
    title: { type: String, required: [true, "title is required"] },
    author: { type: String, required: [true, "Author is required"] },
    availability: { type: Boolean, default: true },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
