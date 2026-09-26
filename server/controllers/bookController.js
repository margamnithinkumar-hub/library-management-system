const Book =  require("../models/book");

// Get all books
const getBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch books",
            error: error.message
        });
    }
};

// Get single book
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch book",
            error: error.message
        });
    }
};

// Create book
const createBook = async (req, res) => {
    try {
        const {
            title,
            author,
            category,
            isbn,
            quantity
        } = req.body;

        if (!title || !author || !category || !isbn || quantity === undefined) {
            return res.status(400).json({
                message: "Please provide all required book details"
            });
        }

        const existingBook = await Book.findOne({ isbn });

        if (existingBook) {
            return res.status(400).json({
                message: "A book with this ISBN already exists"
            });
        }

        const book = await Book.create({
            title,
            author,
            category,
            isbn,
            quantity,
            availableQuantity: quantity
        });

        res.status(201).json({
            message: "Book created successfully",
            book
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create book",
            error: error.message
        });
    }
};

// Update book
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        const {
            title,
            author,
            category,
            isbn,
            quantity
        } = req.body;

        book.title = title ?? book.title;
        book.author = author ?? book.author;
        book.category = category ?? book.category;
        book.isbn = isbn ?? book.isbn;

        if (quantity !== undefined) {
            const difference = Number(quantity) - book.quantity;

            book.quantity = Number(quantity);
            book.availableQuantity = Math.max(
                0,
                book.availableQuantity + difference
            );
        }

        const updatedBook = await book.save();

        res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update book",
            error: error.message
        });
    }
};

// Delete book
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        await Book.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete book",
            error: error.message
        });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};