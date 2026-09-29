const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    height: {
      type: Number,
     default: null
    },

    weight: {
      type: Number,
      default: null
    },

    activityLevel: {
      type: String,
      enum: [
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
      ],
      required: true,
    },

    fitnessGoal: {
      type: String,
      enum: [
        "weight_loss",
        "weight_gain",
        "muscle_gain",
        "maintain_weight",
        "general_fitness",
      ],
      required: true,
    },

    dietType: {
      type: String,
      enum: [
        "vegetarian",
        "non_vegetarian",
        "vegan",
        "eggetarian",
      ],
      required: true,
    },

    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    workoutDays: {
      type: Number,
      min: 0,
      max: 7,
      default: 3,
    },

    workoutLocation: {
      type: String,
      enum: ["home", "gym", "outdoor"],
      default: "gym",
    },

    allergies: {
      type: [String],
      default: [],
    },

    dietaryRestrictions: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserProfile = mongoose.model("UserProfile", userProfileSchema);

module.exports = UserProfile;