const express = require("express");

const {
    getIssues,
    issueBook,
    returnBook
} = require("../controllers/issueController");

const router = express.Router();

// Get all issued books
router.get("/", getIssues);

// Issue a book
router.post("/", issueBook);

// Return a book
router.put("/return/:issueId", returnBook);

module.exports = router;