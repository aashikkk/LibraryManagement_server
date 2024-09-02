const mongoose = require("mongoose");
const { Book, BorrowedBook, User } = require("./models");
const connectDB = require("./connection/db");
const https = require("https");
require("dotenv").config();

const fetchBooks = (numBooks) => {
    return new Promise((resolve, reject) => {
        const url = `https://openlibrary.org/subjects/love.json?limit=${numBooks}`;
        https.get(url, (response) => {
            let data = "";

            response.on("data", (chunk) => {
                data += chunk;
            });

            response.on("end", () => {
                try {
                    const jsonData = JSON.parse(data);
                    const books = jsonData.works.map((work) => ({
                        bookId: work.key.split("/").pop(), // bookId for OpenLibrary
                        title: work.title,
                        author: work.authors
                            .map((author) => author.name)
                            .join(", "),
                        isAvailable: true,
                    }));
                    resolve(books);
                } catch (err) {
                    reject("Error parsing JSON data");
                }
            });

            response.on("error", (err) => {
                reject(`Error fetching data: ${err.message}`);
            });
        });
    });
};

const seedDB = async () => {
    try {
        await connectDB();

        await Book.deleteMany({});
        await BorrowedBook.deleteMany({});

        const books = await fetchBooks(30);
        await Book.insertMany(books);

        console.log("Database seeded successfully");
    } catch (err) {
        console.error("Error seeding database:", err);
    } finally {
        await mongoose.connection.close();
    }
};

seedDB();
