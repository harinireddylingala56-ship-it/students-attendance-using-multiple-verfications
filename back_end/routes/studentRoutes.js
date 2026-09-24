const express = require("express");
const bcrypt = require("bcrypt");

const Student = require("../models/Student");

const router = express.Router();


// ===============================
// ADD STUDENT - POST
// ===============================

router.post("/", async (req, res) => {

    try {

        const {
            studentId,
            name,
            email,
            password,
            rollNumber,
            branch,
            year,
            section,
            role
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({

            studentId,
            name,
            email,
            password: hashedPassword,
            rollNumber,
            branch,
            year,
            section,
            role

        });

        const savedStudent = await student.save();

        res.status(201).json({
            message: "Student added successfully",
            student: savedStudent
        });

    } catch (error) {

        res.status(500).json({
            message: "Error adding student",
            error: error.message
        });

    }

});


// ===============================
// GET ALL STUDENTS
// ===============================

router.get("/", async (req, res) => {

    try {

        const students = await Student.find();

        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({
            message: "Error getting students",
            error: error.message
        });

    }

});


// ===============================
// GET ONE STUDENT
// ===============================

router.get("/:id", async (req, res) => {

    try {

        const student = await Student.findById(req.params.id);

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.status(200).json(student);

    } catch (error) {

        res.status(500).json({
            message: "Error getting student",
            error: error.message
        });

    }

});


// ===============================
// UPDATE STUDENT - PATCH
// ===============================

router.patch("/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.status(200).json({
            message: "Student updated successfully",
            student: student
        });

    } catch (error) {

        res.status(500).json({
            message: "Error updating student",
            error: error.message
        });

    }

});


// ===============================
// DELETE STUDENT
// ===============================

router.delete("/:id", async (req, res) => {

    try {

        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });

    }

});


module.exports = router;