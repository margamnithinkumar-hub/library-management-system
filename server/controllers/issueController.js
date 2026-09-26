const Issue = require("../models/issue");
const Book = require("../models/book");


// =====================================================
// FINE SETTINGS
// =====================================================

const FINE_PER_DAY = 10;


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

const getIssues = async (req, res) => {

    try {

        const issues = await Issue.find()
            .populate("memberId")
            .populate("bookId")
            .sort({ createdAt: -1 });


        // Update overdue status dynamically
        const today = new Date();

        for (const issue of issues) {

            // If book is already returned,
            // don't change its status
            if (issue.status === "Returned") {
                continue;
            }


            const dueDate = new Date(issue.dueDate);


            // Remove time for accurate date comparison
            const todayDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
            );

            const dueDateOnly = new Date(
                dueDate.getFullYear(),
                dueDate.getMonth(),
                dueDate.getDate()
            );


            if (todayDate > dueDateOnly) {

                const difference =
                    todayDate.getTime() -
                    dueDateOnly.getTime();

                const overdueDays =
                    Math.ceil(
                        difference /
                        (1000 * 60 * 60 * 24)
                    );


                issue.status = "Overdue";

                issue.overdueDays = overdueDays;

                issue.fine =
                    overdueDays * FINE_PER_DAY;

            } else {

                issue.status = "Issued";

                issue.overdueDays = 0;

                issue.fine = 0;
            }


            await issue.save();
        }


        // Fetch again after updating statuses
        const updatedIssues = await Issue.find()
            .populate("memberId")
            .populate("bookId")
            .sort({ createdAt: -1 });


        res.status(200).json(updatedIssues);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message
        });

    }
};


// =====================================================
// ISSUE BOOK
// =====================================================

const issueBook = async (req, res) => {

    try {

        const {
            memberId,
            bookId,
            issueDate,
            dueDate
        } = req.body;


        if (
            !memberId ||
            !bookId ||
            !issueDate ||
            !dueDate
        ) {

            return res.status(400).json({
                message: "Please provide all issue details"
            });

        }


        const book = await Book.findById(bookId);


        if (!book) {

            return res.status(404).json({
                message: "Book not found"
            });

        }


        if (book.availableQuantity <= 0) {

            return res.status(400).json({
                message: "This book is currently not available"
            });

        }


        const issue = await Issue.create({

            memberId,

            bookId,

            issueDate,

            dueDate,

            returnDate: null,

            status: "Issued",

            fine: 0,

            overdueDays: 0

        });


        // Decrease available quantity
        book.availableQuantity =
            book.availableQuantity - 1;

        await book.save();


        const populatedIssue =
            await Issue.findById(issue._id)
                .populate("memberId")
                .populate("bookId");


        res.status(201).json({

            message: "Book issued successfully",

            issue: populatedIssue

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to issue book",

            error: error.message

        });

    }
};


// =====================================================
// RETURN BOOK
// =====================================================

const returnBook = async (req, res) => {

    try {

        const { issueId } = req.params;


        const issue =
            await Issue.findById(issueId);


        if (!issue) {

            return res.status(404).json({

                message: "Issue record not found"

            });

        }


        if (issue.status === "Returned") {

            return res.status(400).json({

                message: "This book has already been returned"

            });

        }


        const book =
            await Book.findById(issue.bookId);


        if (!book) {

            return res.status(404).json({

                message: "Book not found"

            });

        }


        // =============================================
        // RETURN DATE
        // =============================================

        const returnDate = new Date();


        // =============================================
        // CALCULATE OVERDUE DAYS
        // =============================================

        const dueDate =
            new Date(issue.dueDate);


        const returnDateOnly = new Date(
            returnDate.getFullYear(),
            returnDate.getMonth(),
            returnDate.getDate()
        );


        const dueDateOnly = new Date(
            dueDate.getFullYear(),
            dueDate.getMonth(),
            dueDate.getDate()
        );


        let overdueDays = 0;


        if (returnDateOnly > dueDateOnly) {

            const difference =
                returnDateOnly.getTime() -
                dueDateOnly.getTime();


            overdueDays =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );

        }


        // =============================================
        // CALCULATE FINE
        // =============================================

        const fine =
            overdueDays * FINE_PER_DAY;


        // =============================================
        // UPDATE ISSUE
        // =============================================

        issue.returnDate = returnDate;

        issue.overdueDays = overdueDays;

        issue.fine = fine;

        issue.status = "Returned";


        await issue.save();


        // =============================================
        // INCREASE AVAILABLE BOOK QUANTITY
        // =============================================

        book.availableQuantity =
            book.availableQuantity + 1;


        await book.save();


        // =============================================
        // RETURN UPDATED DATA
        // =============================================

        const populatedIssue =
            await Issue.findById(issue._id)
                .populate("memberId")
                .populate("bookId");


        res.status(200).json({

            message: "Book returned successfully",

            issue: populatedIssue

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to return book",

            error: error.message

        });

    }
};


// =====================================================
// EXPORT 
// =====================================================

module.exports = {

    getIssues,

    issueBook,

    returnBook

};
