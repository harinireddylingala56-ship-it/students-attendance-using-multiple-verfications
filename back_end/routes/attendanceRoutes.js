const express = require("express");
const Attendance = require("../models/Attendance");

const router = express.Router();


// ==========================
// POST - ADD ATTENDANCE
// ==========================

router.post("/", async (req, res) => {

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


// ==========================
// GET - ALL ATTENDANCE
// ==========================

router.get("/", async (req, res) => {

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


// ==========================
// GET - ONE ATTENDANCE
// ==========================

router.get("/:id", async (req, res) => {

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


// ==========================
// PATCH - UPDATE ATTENDANCE
// ==========================

router.patch("/:id", async (req, res) => {

    try {

        const attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance: attendance
        });

    } catch (error) {

        res.status(500).json({
            message: "Error updating attendance",
            error: error.message
        });

    }
});


// ==========================
// DELETE - DELETE ATTENDANCE
// ==========================

router.delete("/:id", async (req, res) => {

    try {

        const attendance = await Attendance.findByIdAndDelete(
            req.params.id
        );

        if (!attendance) {
            return res.status(404).json({
                message: "Attendance record not found"
            });
        }

        res.status(200).json({
            message: "Attendance deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting attendance",
            error: error.message
        });

    }
});


module.exports = router;