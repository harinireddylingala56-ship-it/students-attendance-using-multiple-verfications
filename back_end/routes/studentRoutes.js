
const express = require("express");
const bcrypt = require("bcrypt");
const Student = require("../models/Student");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// GET STUDENTS
// Admin and Faculty can VIEW students
// ==========================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin", "faculty"),
    async (req, res) => {

        try {

            const { search, branch, year, section } = req.query;

            const filter = {};

            if (search) {
                filter.$or = [
                    { studentId: { $regex: search, $options: "i" } },
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ];
            }

            if (branch) filter.branch = branch;
            if (year) filter.year = Number(year);
            if (section) filter.section = section;

            const students = await Student.find(filter)
                .select("-password");

            res.status(200).json(students);

        } catch (error) {

            res.status(500).json({
                message: "Error fetching students",
                error: error.message
            });

        }

    }
);


// ==========================================
// ADD STUDENT
// Admin only
// ==========================================

router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const {
                studentId, rollNumber, name, email,
                password, branch, year, section
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

            const existing = await Student.findOne({
                $or: [
                    { studentId },
                    { rollNumber },
                    { email }
                ]
            });

            if (existing) {

                return res.status(409).json({
                    message: "Student ID, roll number, or email already exists"
                });

            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const student = await Student.create({
                studentId,
                rollNumber,
                name,
                email,
                password: hashedPassword,
                branch,
                year,
                section
            });

            res.status(201).json({

                message: "Student added successfully",

                student: {
                    _id: student._id,
                    studentId: student.studentId,
                    rollNumber: student.rollNumber,
                    name: student.name,
                    email: student.email,
                    branch: student.branch,
                    year: student.year,
                    section: student.section
                }

            });

        } catch (error) {

            res.status(500).json({
                message: "Error adding student",
                error: error.message
            });

        }

    }
);


// ==========================================
// EDIT STUDENT
// Admin only
// ==========================================

router.patch(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const allowed = [
                "studentId",
                "rollNumber",
                "name",
                "email",
                "branch",
                "year",
                "section"
            ];

            const updates = {};

            for (const field of allowed) {

                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }

            }

            if (req.body.password) {

                if (req.body.password.length < 6) {

                    return res.status(400).json({
                        message: "Password must contain at least 6 characters"
                    });

                }

                updates.password = await bcrypt.hash(
                    req.body.password,
                    10
                );

            }

            const duplicateConditions = [];

            if (updates.studentId) {
                duplicateConditions.push({
                    studentId: updates.studentId
                });
            }

            if (updates.rollNumber) {
                duplicateConditions.push({
                    rollNumber: updates.rollNumber
                });
            }

            if (updates.email) {
                duplicateConditions.push({
                    email: updates.email
                });
            }

            if (duplicateConditions.length > 0) {

                const duplicate = await Student.findOne({

                    _id: { $ne: req.params.id },

                    $or: duplicateConditions

                });

                if (duplicate) {

                    return res.status(409).json({
                        message: "Student ID, roll number, or email already exists"
                    });

                }

            }

            const student = await Student.findByIdAndUpdate(
                req.params.id,
                { $set: updates },
                { new: true, runValidators: true }
            ).select("-password");

            if (!student) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }

            res.json({
                message: "Student updated successfully",
                student
            });

        } catch (error) {

            res.status(500).json({
                message: "Error updating student",
                error: error.message
            });

        }

    }
);


// ==========================================
// DELETE STUDENT
// Admin only
// ==========================================

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    async (req, res) => {

        try {

            const student = await Student.findByIdAndDelete(
                req.params.id
            );

            if (!student) {

                return res.status(404).json({
                    message: "Student not found"
                });

            }

            res.json({
                message: "Student deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Error deleting student",
                error: error.message
            });

        }

    }
);


module.exports = router;
