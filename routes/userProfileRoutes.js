const express = require("express");

const {
    createProfile,
    getProfile
} = require("../controllers/UserProfileController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create profile
router.post("/", protect, createProfile);

// Get logged-in user's profile
router.get("/", protect, getProfile);

module.exports = router;