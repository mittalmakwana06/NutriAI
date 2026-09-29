const generateAIResponse = async (apiKey, contents, options = {}) => {
  // Current stable Gemini model
  const models = [
    "gemini-3.8-flash",
    "gemini-3.7-flash"
  ];

  for (const modelName of models) {
    try {
      console.log(`🤖 Requesting Gemini via Direct API [${modelName}]...`);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: contents,
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(
          `❌ Model ${modelName} returned status ${response.status}:`,
          data.error?.message
        );

        // Rate limit
        if (response.status === 429) {
          console.warn(
            "⏳ Rate limit reached. Waiting 2 seconds before fallback..."
          );

          await new Promise((res) => setTimeout(res, 2000));
        }

        continue;
      }

      // Extract generated text safely
      const candidateText =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (candidateText) {
        console.log(`✅ Success response received from ${modelName}`);
        return candidateText;
      }

      console.warn(`⚠️ No text returned from ${modelName}`);

    } catch (err) {
      console.error(
        `❌ Network/Server error on ${modelName}:`,
        err.message
      );
    }
  }

  throw new Error(
    "Gemini API request failed. Please try again later or check your API key/quota."
  );
};

module.exports = { generateAIResponse };