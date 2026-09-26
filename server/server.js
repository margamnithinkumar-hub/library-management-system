const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const issueRoutes = require("./routes/issueRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Book Routes
app.use("/api/books", bookRoutes);

// Member Routes
app.use("/api/members", memberRoutes);

// Issue Routes
app.use("/api/issues", issueRoutes);
// Home route
app.get("/", (req, res) => {
    res.send("Library Management System Backend is Running!");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend API is working successfully!"
    });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});