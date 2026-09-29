
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import ProfileSetup from "./pages/ProfileSetup";
import MyProfile from "./pages/MyProfile";
import Nutrition from "./pages/Nutrition";
import FoodAnalysis from "./pages/FoodAnalysis";
import ExerciseRecommendation from "./pages/ExerciseRecommendation";
import Settings from "./pages/Settings";

function App() {
  const token = localStorage.getItem("token");
useEffect(() => {
  const savedSettings = JSON.parse(localStorage.getItem("appSettings"));
  if (savedSettings?.theme === "light") {
    document.documentElement.classList.add("light");
    document.body.style.backgroundColor = "#f8fafc";
    document.body.style.color = "#0f172a";
  }
}, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Profile Setup */}
        <Route
          path="/profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />

        {/* My Profile */}
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/Nutrition"
          element={
            <Nutrition>
              <MyProfile />
            </Nutrition>
          }
        />
        <Route
          path="/FoodAnalysis"
          element={
            <FoodAnalysis>
              <MyProfile />
            </FoodAnalysis>
          }
        />
        <Route
          path="/ExerciseRecommendation"
          element={
            <ExerciseRecommendation>
              <MyProfile />
            </ExerciseRecommendation>
          }
        />

        <Route
          path="/Settings"
          element={
            <Settings>
              <MyProfile />
            </Settings>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

