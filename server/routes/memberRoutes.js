const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Member Schema
const memberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        membershipId: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

// Member Model
const Member = mongoose.model("Member", memberSchema);

// GET all members
router.get("/", async (req, res) => {
    try {
        const members = await Member.find().sort({ createdAt: -1 });
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch members"
        });
    }
});

// ADD member
router.post("/", async (req, res) => {
    try {
        const { name, email, phone, membershipId } = req.body;

        if (!name || !email || !phone || !membershipId) {
            return res.status(400).json({
                message: "Please fill all member details"
            });
        }

        const existingMember = await Member.findOne({
            membershipId
        });

        if (existingMember) {
            return res.status(400).json({
                message: "Membership ID already exists"
            });
        }

        const member = new Member({
            name,
            email,
            phone,
            membershipId
        });

        const savedMember = await member.save();

        res.status(201).json(savedMember);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to add member"
        });
    }
});

// UPDATE member
router.put("/:id", async (req, res) => {
    try {
        const { name, email, phone, membershipId } = req.body;

        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                membershipId
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedMember) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json(updatedMember);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update member"
        });
    }
});

// DELETE member
router.delete("/:id", async (req, res) => {
    try {
        const deletedMember = await Member.findByIdAndDelete(
            req.params.id
        );

        if (!deletedMember) {
            return res.status(404).json({
                message: "Member not found"
            });
        }

        res.json({
            message: "Member deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete member"
        });
    }
});

module.exports = router;