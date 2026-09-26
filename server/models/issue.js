const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Member"
        },

        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Book"
        },

        issueDate: {
            type: Date,
            required: true
        },

        dueDate: {
            type: Date,
            required: true
        },

        returnDate: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["Issued", "Returned", "Overdue"],
            default: "Issued"
        },

        fine: {
            type: Number,
            default: 0
        },

        overdueDays: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Issue", issueSchema);