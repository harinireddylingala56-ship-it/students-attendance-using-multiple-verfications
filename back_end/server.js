
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const studentRoutes = require("./routes/studentRoutes");
const staffRoutes = require("./routes/staffRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/authRoutes");

// Register routes
app.use("/api/students", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Student Attendance Management API is running");
});

// MongoDB connection and server startup
const PORT = 5000;
const MONGO_URI = "mongodb://127.0.0.1:27017/student_attendance";

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
