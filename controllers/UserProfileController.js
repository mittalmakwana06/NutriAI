const UserProfile = require("../models/UserProfile");

const createProfile = async (req, res) => {
    try {
        const profile = await UserProfile.create({
            ...req.body,
            userId: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: "Profile created successfully",
            data: profile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create profile",
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({
            userId: req.user.userId
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get profile",
            error: error.message
        });
    }
};

module.exports = {
    createProfile,
    getProfile
};