const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    rollNumber: {
        type: String,
        required: true,
        unique: true
    },

    branch: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["admin", "faculty", "student"],
        default: "student"
    }

});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;