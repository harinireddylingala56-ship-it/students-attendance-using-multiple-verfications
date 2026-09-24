const express = require("express");
const bcrypt = require("bcrypt");

const Staff = require("../models/Staff");

const router = express.Router();


// ==========================
// POST - ADD STAFF
// ==========================

router.post("/", async (req, res) => {

    try {

        const {
            staffId,
            name,
            email,
            password,
            department,
            role
        } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const staff = new Staff({
            staffId,
            name,
            email,
            password: hashedPassword,
            department,
            role
        });

        const savedStaff = await staff.save();

        res.status(201).json({
            message: "Staff added successfully",
            staff: savedStaff
        });

    } catch (error) {

        res.status(500).json({
            message: "Error adding staff",
            error: error.message
        });

    }
});


// ==========================
// GET - ALL STAFF
// ==========================

router.get("/", async (req, res) => {

    try {

        const staff = await Staff.find();

        res.status(200).json(staff);

    } catch (error) {

        res.status(500).json({
            message: "Error getting staff",
            error: error.message
        });

    }
});


// ==========================
// GET - ONE STAFF
// ==========================

router.get("/:id", async (req, res) => {

    try {

        const staff = await Staff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json(staff);

    } catch (error) {

        res.status(500).json({
            message: "Error getting staff",
            error: error.message
        });

    }
});


// ==========================
// PATCH - UPDATE STAFF
// ==========================

router.patch("/:id", async (req, res) => {

    try {

        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff updated successfully",
            staff: staff
        });

    } catch (error) {

        res.status(500).json({
            message: "Error updating staff",
            error: error.message
        });

    }
});


// ==========================
// DELETE - DELETE STAFF
// ==========================

router.delete("/:id", async (req, res) => {

    try {

        const staff = await Staff.findByIdAndDelete(req.params.id);

        if (!staff) {
            return res.status(404).json({
                message: "Staff not found"
            });
        }

        res.status(200).json({
            message: "Staff deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Error deleting staff",
            error: error.message
        });

    }
});


module.exports = router;