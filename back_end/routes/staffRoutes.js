
const express = require("express");
const bcrypt = require("bcrypt");
const Staff = require("../models/Staff");

const authenticateToken = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authenticateToken, authorizeRoles("admin"));

// ADD FACULTY
router.post("/", async (req, res) => {
    try {
        const { staffId, name, email, password, department } = req.body;

        if (!staffId || !name || !email || !password || !department) {
            return res.status(400).json({
                message: "All faculty fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must contain at least 6 characters"
            });
        }

        const existing = await Staff.findOne({
            $or: [{ staffId }, { email }]
        });

        if (existing) {
            return res.status(409).json({
                message: "Staff ID or email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const staff = await Staff.create({
            staffId,
            name,
            email,
            password: hashedPassword,
            department,
            role: "faculty"
        });

        res.status(201).json({
            message: "Faculty added successfully",
            staff: {
                _id: staff._id,
                staffId: staff.staffId,
                name: staff.name,
                email: staff.email,
                department: staff.department,
                role: staff.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding faculty",
            error: error.message
        });
    }
});

// GET FACULTY + SEARCH
router.get("/", async (req, res) => {
    try {
        const { search, department } = req.query;

        const filter = {};

        if (search) {
            filter.$or = [
                { staffId: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (department) {
            filter.department = department;
        }

        const staff = await Staff.find(filter).select("-password");

        res.json({
            message: "Faculty fetched successfully",
            count: staff.length,
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching faculty",
            error: error.message
        });
    }
});

// EDIT FACULTY
router.patch("/:id", async (req, res) => {
    try {
        const allowed = [
            "staffId", "name", "email", "department"
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
                req.body.password, 10
            );
        }

        const duplicate = await Staff.findOne({
            _id: { $ne: req.params.id },
            $or: [
                ...(updates.staffId ? [{ staffId: updates.staffId }] : []),
                ...(updates.email ? [{ email: updates.email }] : [])
            ]
        });

        if (duplicate) {
            return res.status(409).json({
                message: "Staff ID or email already exists"
            });
        }

        const staff = await Staff.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!staff) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        res.json({
            message: "Faculty updated successfully",
            staff
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating faculty",
            error: error.message
        });
    }
});

// DELETE FACULTY
router.delete("/:id", async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);

        if (!staff) {
            return res.status(404).json({
                message: "Faculty not found"
            });
        }

        res.json({
            message: "Faculty deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting faculty",
            error: error.message
        });
    }
});

module.exports = router;
