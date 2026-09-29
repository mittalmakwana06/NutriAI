const express = require("express");

const {
    createFood,
    getAllFoods,
    getFoodById,
    analyzeFood
} = require("../controllers/FoodController");
if (typeof analyzeFood !== 'function') {
  console.error("❌ ERROR: analyzeFood handler is undefined in foodRoutes.js!");
}

const router = express.Router();
router.post("/analyze", analyzeFood);
// Create Food
router.post("/", createFood);

// Get All Foods
router.get("/", getAllFoods);

// Get Food By ID
router.get("/:id", getFoodById);

module.exports = router;