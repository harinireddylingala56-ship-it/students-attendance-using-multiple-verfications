const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    verificationMethod: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true
    }

}, {
    collection: "attendance"
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;