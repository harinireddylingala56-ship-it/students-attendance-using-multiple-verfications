const express = require("express");
const mongoose = require("mongoose");

const app = express();
const staffRoutes = require("./routes/staffRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

app.use(express.json());
app.use("/api/staff", staffRoutes);
app.use("/api/attendance", attendanceRoutes);


// MongoDB connection

mongoose.connect("mongodb://localhost:27017/student_attendance")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });


// Student routes

const studentRoutes = require("./routes/studentRoutes");

app.use("/api/students", studentRoutes);


// Home route

app.get("/", (req, res) => {
    res.send("Student Attendance Backend is Running");
});


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});