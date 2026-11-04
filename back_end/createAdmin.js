const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin = require("./models/Admin");

async function createAdmin() {

    try {

        await mongoose.connect(
            "mongodb://localhost:27017/student_attendance"
        );

        console.log("MongoDB Connected");

        const existingAdmin = await Admin.findOne({
            email: "admin@example.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        const admin = new Admin({

            adminId: "ADMIN001",

            name: "System Admin",

            email: "admin@example.com",

            password: hashedPassword,

            role: "admin"

        });

        await admin.save();

        console.log("Admin created successfully");

    } catch (error) {

        console.log("Error:", error);

    } finally {

        await mongoose.disconnect();

    }

}

createAdmin();