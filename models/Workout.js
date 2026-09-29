const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "strength",
        "cardio",
        "flexibility",
        "full_body",
        "sports",
      ],
    },

    muscleGroup: {
      type: [String],
      default: [],
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },

    equipment: {
      type: [String],
      default: [],
    },

    instructions: {
      type: [String],
      default: [],
    },

    sets: {
      type: Number,
      default: 3,
      min: 1,
    },

    reps: {
      type: String,
      default: "10-12",
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    suitableFor: {
      type: [String],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;