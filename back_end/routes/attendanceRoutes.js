const express = require("express");
const Attendance = require("../models/Attendance");
const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();
router.post("/", authenticateToken, authorizeRoles("student", "faculty"), async (req, res) => {
    try {
        const {
            studentId,
            date,
            time,
            verificationMethod,
            status
        } = req.body;

        const attendance = new Attendance({
            studentId,
            date,
            time,
            verificationMethod,
            status
        });

        const savedAttendance = await attendance.save();

        res.status(201).json({
            message: "Attendance added successfully",
            attendance: savedAttendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding attendance",
            error: error.message
        });
    }
});

router.get("/", authenticateToken, async (req, res) => {

    try {

        const attendance = await Attendance.find();

        res.status(200).json(attendance);

    } catch (error) {

        res.status(500).json({
            message: "Error getting attendance",
            error: error.message
        });

    }
});

router.get("/", authenticateToken, async (req, res) => {
    try {

        const attendance = await Attendance.findById(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json(attendance);

    } catch (error) {

        res.status(500).json({
            message: "Error getting attendance",
            error: error.message
        });

    }
});

router.patch("/:id", authenticateToken, authorizeRoles("faculty"), async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found"
            });
        }

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating attendance",
            error: error.message
        });
    }
});
router.delete("/:id", authenticateToken, authorizeRoles("faculty"), async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance not found"
            });
        }

        res.status(200).json({
            message: "Attendance deleted successfully",
            attendance
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting attendance",
            error: error.message
        });
    }
});
module.exports = router;