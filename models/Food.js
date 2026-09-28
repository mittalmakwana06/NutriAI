const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
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
        "breakfast",
        "lunch",
        "dinner",
        "snack",
        "fruit",
        "vegetable",
        "beverage",
        "other",
      ],
    },

    servingSize: {
      type: String,
      required: true,
    },

    calories: {
      type: Number,
      required: true,
      min: 0,
    },

    protein: {
      type: Number,
      required: true,
      min: 0,
    },

    carbohydrates: {
      type: Number,
      required: true,
      min: 0,
    },

    fats: {
      type: Number,
      required: true,
      min: 0,
    },

    fiber: {
      type: Number,
      default: 0,
      min: 0,
    },

    iron: {
      type: Number,
      default: 0,
      min: 0,
    },

    calcium: {
      type: Number,
      default: 0,
      min: 0,
    },

    vitamins: {
      type: [String],
      default: [],
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

const Food = mongoose.model("Food", foodSchema);

module.exports = Food;