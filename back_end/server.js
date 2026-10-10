const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const staffRoutes = require("./routes/staffRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const authRoutes = require("./routes/authRoutes");

// ===============================
// Middleware
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// Routes
// ===============================

app.use("/api/staff", staffRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/auth", authRoutes);


// ===============================
// Student Routes
// ===============================

const studentRoutes = require("./routes/studentRoutes");

app.use("/api/students", studentRoutes);


// ===============================
// MongoDB Connection
// ===============================

mongoose.connect("mongodb://localhost:27017/student_attendance")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// ===============================
// Home Route
// ===============================

app.get("/", (req, res) => {
    res.send("Student Attendance Backend is Running");
});


// ===============================
// Start Server
// ===============================

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});