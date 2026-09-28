const { GoogleGenAI } = require("@google/genai");

// Smart Fallback Data when Quota is fully Exhausted
const getFallbackExerciseData = (calories, goal, fitnessLevel) => {
  return {
    workoutTitle: `${goal} Routine (${fitnessLevel})`,
    durationMinutes: 30,
    estimatedCaloriesBurned: Number(calories) || 300,
    exercises: [
      { name: "Jumping Jacks / Bodyweight Warmup", sets: 3, reps: "45 sec", restSeconds: 30 },
      { name: "Bodyweight Squats", sets: 3, reps: "12-15", restSeconds: 45 },
      { name: "Push-ups (Knee or Standard)", sets: 3, reps: "10-12", restSeconds: 45 },
      { name: "Mountain Climbers", sets: 3, reps: "30 sec", restSeconds: 30 },
      { name: "Plank Hold", sets: 3, reps: "45 sec", restSeconds: 45 }
    ],
    tips: "Quota temporarily exceeded. Showing cached standard routine. Keep hydrated and maintain good form!"
  };
};

const generateAIResponse = async (ai, contents, reqBody) => {
  const modelName = "gemini-3.8-flash";
  let retries = 2;

  while (retries > 0) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: { responseMimeType: "application/json" }
      });
      return response;
    } catch (err) {
      const isRateLimit = err.status === 429 || err.message?.includes("Quota exceeded") || err.message?.includes("429");
      console.warn(`[Exercise AI] Attempt failed (${err.status || "Error"}). Retrying...`);

      retries--;

      if (isRateLimit && retries > 0) {
        console.warn("[Exercise AI] Rate limit (429) hit. Waiting 3 seconds before retry...");
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3s for quota reset
      } else {
        break;
      }
    }
  }

  // If retries fail or daily limit ends, return fallback data instead of throwing error
  console.warn("[Exercise AI] Serving fallback workout data due to API quota limits.");
  return null;
};

const getExerciseRecommendation = async (req, res) => {
  try {
    const { calories, goal, fitnessLevel } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Gemini API Key missing." });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      Suggest a workout routine based on:
      - Calories: ${calories || 300} kcal
      - Goal: ${goal || "General Fitness"}
      - Level: ${fitnessLevel || "Beginner"}

      Respond strictly in JSON format matching this schema:
      {
        "workoutTitle": "Routine Name",
        "durationMinutes": 30,
        "estimatedCaloriesBurned": 300,
        "exercises": [
          { "name": "Exercise", "sets": 3, "reps": "12-15", "restSeconds": 45 }
        ],
        "tips": "Short tip."
      }
    `;

    const response = await generateAIResponse(ai, [{ text: prompt }], req.body);

    if (!response) {
      // Fallback response served safely
      const fallbackData = getFallbackExerciseData(calories, goal, fitnessLevel);
      return res.json(fallbackData);
    }

    let cleanText = response.text || "";
    cleanText = cleanText.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(cleanText);
    res.json(data);

  } catch (error) {
    console.error("Exercise AI Error:", error);
    // Fallback on parse error as well
    const fallbackData = getFallbackExerciseData(req.body.calories, req.body.goal, req.body.fitnessLevel);
    res.json(fallbackData);
  }
};

module.exports = { getExerciseRecommendation };