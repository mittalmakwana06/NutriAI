const mongoose = require("mongoose");

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0.1,
    },

    unit: {
      type: String,
      required: true,
      enum: ["g", "ml", "piece", "serving"],
    },

    mealDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;  