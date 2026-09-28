const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        mobile: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },

        age: {
            type: Number,
            min: 1,
            max: 120
        },

        password: {
            type: String
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        authProvider: {
            type: String,
            enum: ["local", "google"],
            default: "local"
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;