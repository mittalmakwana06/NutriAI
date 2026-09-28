const express = require("express");
const router = express.Router();
const { getExerciseRecommendation } = require("../controllers/ExerciseController");

router.post("/recommend", getExerciseRecommendation);

module.exports = router;