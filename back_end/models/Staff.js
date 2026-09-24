const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({

    staffId: {
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

    department: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["faculty", "admin"],
        default: "faculty"
    }

}, {
    collection: "faculties"
});

const Staff = mongoose.model("Staff", staffSchema);

module.exports = Staff;