const redis = require("../config/redis");
const { generateAIResponse } = require("../services/aiService");

const CACHE_EXPIRATION = 86400 * 7; // 7 Days

const analyzeFood = async (req, res) => {
  try {
    const { foodInput, imageBase64 } = req.body;

    if (!foodInput && !imageBase64) {
      return res.status(400).json({ message: "Khane ka naam ya image hona zaroori hai." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Server error: GEMINI_API_KEY environment variable missing hai." });
    }

    // Cache key generation
    const cacheKey = foodInput ? `food_analysis:${foodInput.trim().toLowerCase()}` : null;

    // 1. Redis Cache Lookup (Safe check)
    if (cacheKey) {
      try {
        if (redis.status === 'ready') {
          const cachedData = await redis.get(cacheKey);
          if (cachedData) {
            console.log("⚡ Fast Response Served from Redis Cache");
            return res.json(JSON.parse(cachedData));
          }
        }
      } catch (redisErr) {
        console.warn("⚠️ Redis cache bypass:", redisErr.message);
      }
    }

    // 2. Format Prompt Payload for Gemini API
    const promptText = `
      Analyze this food item and provide its estimated nutritional breakdown.
      Respond strictly in JSON format matching this schema:
      {
        "foodName": "Identified Dish Name",
        "portionSize": "Estimated Portion (e.g., 1 bowl / 200g)",
        "calories": 350,
        "protein": 12,
        "carbs": 45,
        "fat": 14,
        "healthRating": "Moderate",
        "summary": "Short 1-2 sentence breakdown."
      }
    `;

    const parts = [];

    if (imageBase64) {
      const mimeMatch = imageBase64.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const cleanData = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      parts.push({
        inline_data: {
          mime_type: mimeType,
          data: cleanData
        }
      });
    }

    if (foodInput) {
      parts.push({ text: `Food item description: ${foodInput}` });
    }

    parts.push({ text: promptText });

    const contents = [{ parts: parts }];

    // 3. Call AI REST API Service
    let aiRawResponse;

try {
  aiRawResponse = await generateAIResponse(apiKey, contents);
} catch (aiError) {
  console.warn("⚠️ Gemini unavailable:", aiError.message);

  // Development fallback
  if (process.env.NODE_ENV !== "production") {
    console.log("🧪 Using Mock AI Response for development...");

    aiRawResponse = JSON.stringify({
      foodName: foodInput || "Sample Food",
      portionSize: "1 serving",
      calories: 250,
      protein: 8,
      carbs: 35,
      fat: 9,
      healthRating: "Moderate",
      summary:
        "This is a temporary development response because Gemini is currently unavailable."
    });
  } else {
    throw aiError;
  }
}

    // Clean JSON String
    const cleanJsonText = aiRawResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanJsonText);

    // 4. Save Output to Redis Cache
    if (cacheKey) {
      try {
        if (redis.status === 'ready') {
          await redis.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(parsedData));
        }
      } catch (redisErr) {
        console.warn("⚠️ Redis cache write skipped:", redisErr.message);
      }
    }

    return res.json(parsedData);

  } catch (error) {
    console.error("❌ Controller Error:", error.message);
    return res.status(500).json({ 
      message: error.message || "Food analyze karne me error aaya."
    });
  }
};

module.exports = {
  analyzeFood,
  createFood: async (req, res) => {},
  getAllFoods: async (req, res) => {},
  getFoodById: async (req, res) => {}
};