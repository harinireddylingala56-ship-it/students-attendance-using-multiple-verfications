const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Student = require("../models/Student");
const Staff = require("../models/Staff");

const router = express.Router();

const JWT_SECRET = "student_attendance_secret_key";

router.post("/student-login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                studentId: student.studentId,
                role: "student"
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Student login successful",
            token: token,
            student: {
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                branch: student.branch,
                year: student.year,
                section: student.section,
                role: student.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Student login error",
            error: error.message
        });

    }

});

router.post("/staff-login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const staff = await Staff.findOne({ email });

        if (!staff) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            staff.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: staff._id,
                staffId: staff.staffId,
                role: staff.role
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Faculty login successful",
            token: token,
            staff: {
                staffId: staff.staffId,
                name: staff.name,
                email: staff.email,
                department: staff.department,
                role: staff.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: "Faculty login error",
            error: error.message
        });

    }

});
// ADMIN LOGIN
router.post("/admin-login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const admin = await Admin.findOne({
            email: email.toLowerCase()
        });

        if (!admin) {
            return res.status(401).json({
                message: "Invalid admin email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid admin email or password"
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                adminId: admin.adminId,
                role: "admin"
            },
            JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.status(200).json({
            message: "Admin login successful",
            token: token,
            admin: {
                adminId: admin.adminId,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {

        console.error("Admin login error:", error);

        res.status(500).json({
            message: "Admin login error",
            error: error.message
        });

    }

});

module.exports = router;