// routes/nutrition.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Profile = require('../models/UserProfile');

router.get('/recommendation', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Dummy data calculation based on profile (agar AI call fail ho)
    const mockData = {
      dailyTargets: {
        calories: 2100,
        proteinGrams: 110,
        carbsGrams: 230,
        fatGrams: 60
      },
      meals: [
        {
          mealType: "Breakfast",
          title: "Oats with Nuts & Milk",
          portion: "1 bowl oats + 200ml milk + almonds",
          calories: 450,
          protein: 18
        },
        {
          mealType: "Lunch",
          title: "Paneer / Chicken Curry with Roti",
          portion: "2 Rotis + 1 bowl Curry + Salad",
          calories: 650,
          protein: 30
        },
        {
          mealType: "Snacks",
          title: "Sprouted Moong Salad",
          portion: "1 bowl fresh sprouts",
          calories: 200,
          protein: 12
        },
        {
          mealType: "Dinner",
          title: "Dal Rice & Vegetables",
          portion: "1 bowl Dal + 1 cup Rice + Mixed Veg",
          calories: 550,
          protein: 20
        }
      ],
      nutritionTip: "Drink at least 3 liters of water daily to maintain hydration!"
    };

    res.json(mockData);
  } catch (error) {
    console.error("Nutrition route error:", error);
    res.status(500).json({ message: error.message || "Failed to load recommendations." });
  }
});

module.exports = router;