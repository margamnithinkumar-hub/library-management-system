const express = require("express");

const {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController");

const router = express.Router();

// Get all books
router.get("/", getBooks);

// Get one book
router.get("/:id", getBookById);

// Create a new book
router.post("/", createBook);

// Update a book
router.put("/:id", updateBook);

// Delete a book
router.delete("/:id", deleteBook);

module.exports = router;
