const express = require("express");
const router = express.Router();

const {
    searchBooks,
    returnBook,
    borrowBook,
    getAvailableBooks,
    getBorrowedBooks,
} = require("../controller/bookController");
const protect = require("../middleware/authMiddleware");

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve available books
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of available books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   availability:
 *                     type: boolean
 *       500:
 *         description: Failed to retrieve books
 */
router.get("/", protect, getAvailableBooks);

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search for books by title or author
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the book to search for
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author of the book to search for
 *     responses:
 *       200:
 *         description: List of books matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   availability:
 *                     type: boolean
 *       400:
 *         description: Please provide a search term
 *       500:
 *         description: Failed to search books
 */
router.get("/search", protect, searchBooks);

/**
 * @swagger
 * /books/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: 60c72b2f9b1e8b001c8b4c88
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 user:
 *                   type: string
 *                 book:
 *                   type: string
 *                 borrowedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Book ID is required or book is not available
 *       500:
 *         description: Failed to borrow book
 */
router.post("/borrow", protect, borrowBook);

/**
 * @swagger
 * /books/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: 60c72b2f9b1e8b001c8b4c88
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: No record found for this book borrowing or book not found
 *       500:
 *         description: Failed to return book
 */
router.post("/return", protect, returnBook);

/**
 * @swagger
 * /books/borrowed:
 *   get:
 *     summary: Retrieve books borrowed by the user
 *     tags: [Books]
 *     security:
 *       - Bearer: []
 *     responses:
 *       200:
 *         description: List of borrowed books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   book:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                   borrowedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to retrieve borrowed books
 */
router.get("/borrowed", protect, getBorrowedBooks);

module.exports = router;
