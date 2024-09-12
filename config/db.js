const mongoose = require("mongoose");
const UserModel = require("../models/user");

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);

        console.log(
            `Mongo Connected: ${connection.connection.host}`.blue.underline
        );

        const existingAdmin = await UserModel.findOne({ role: "admin" });
        if (!existingAdmin) {
            await UserModel.create({
                firstName: "admin",
                lastName: "admin",
                email: "admin@admin.com",
                password: "12345678",
                role: "admin",
            });
        }
    } catch (error) {
        console.log(`${error}`.red.underline);
    }
};

module.exports = connectDB;
