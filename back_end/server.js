const express = require("express");
const mongoose = require("mongoose");
const app = express();
const studentRoutes = require("./routes/studentRoutes");
app.use(express.json());
app.use("/api/students", studentRoutes);

mongoose.connect("mongodb://localhost:27017/student_attendance")
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });
app.get("/", (req, res) => {
    res.send("Student Attendance Backend is Running");
});
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});