const express = require("express");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        console.log("Received body:", req.body);

        const {
            studentId,
            rollNumber,
            name,
            email,
            password,
            branch,
            year,
            section
        } = req.body;

        if (
            !studentId || !rollNumber || !name ||
            !email || !password || !branch ||
            year == null || !section
        ) {
            return res.status(400).json({
                message: "All student fields are required"
            });
        }

        const existingStudent = await Student.findOne({
            $or: [
                { studentId },
                { rollNumber },
                { email }
            ]
        });

        if (existingStudent) {
            return res.status(409).json({
                message: "Student ID, roll number, or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            studentId,
            rollNumber,
            name,
            email,
            password: hashedPassword,
            branch,
            year,
            section
        });

        const savedStudent = await student.save();

        return res.status(201).json({
            message: "Student added successfully",
            student: {
                studentId: savedStudent.studentId,
                rollNumber: savedStudent.rollNumber,
                name: savedStudent.name,
                email: savedStudent.email,
                branch: savedStudent.branch,
                year: savedStudent.year,
                section: savedStudent.section
            }
        });

    } catch (error) {
        console.error("Student error:", error);

        return res.status(500).json({
            message: "Error adding student",
            error: error.message
        });
    }
});
// Get all students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().select("-password");
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
});

module.exports = router;

module.exports = router;