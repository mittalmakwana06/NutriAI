// const path = require("path");
// require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
//require("dotenv").config();
const exerciseRoutes = require("./routes/exerciseRoutes");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const foodRoutes = require("./routes/foodRoutes");
const app = express();
const nutritionRoutes = require('./routes/nutrition');
console.log("🔑 Gemini Key Loaded:", process.env.GEMINI_API_KEY ? "Yes" : "No");
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/profiles", userProfileRoutes);
app.use("/api/foods", foodRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use("/api/exercise", exerciseRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "NutriAI Backend is running..."
    });
});

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});  