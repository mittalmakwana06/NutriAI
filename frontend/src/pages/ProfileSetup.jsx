import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfileSetup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    activityLevel: "",
    fitnessGoal: "",
    fitnessLevel: "",
    workoutDays: "",
    workoutLocation: "",
    dietType: "",
    allergies: "",
    dietaryRestrictions: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      age: formData.age ? Number(formData.age) : null,
      gender: formData.gender || null,
      height: formData.height ? Number(formData.height) : null,
      weight: formData.weight ? Number(formData.weight) : null,
      activityLevel: formData.activityLevel || null,
      fitnessGoal: formData.fitnessGoal || null,
      fitnessLevel: formData.fitnessLevel || null,
      workoutDays: formData.workoutDays ? Number(formData.workoutDays) : null,
      workoutLocation: formData.workoutLocation || null,
      dietType: formData.dietType || null,
      allergies: formData.allergies
        ? formData.allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      dietaryRestrictions: formData.dietaryRestrictions
        ? formData.dietaryRestrictions.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/profiles", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/my-profile");
    } catch (error) {
      console.error("Profile save error:", error.response?.data || error);
      alert("Error saving profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ps-container">
      {/* Component-Level Embedded Styles (No External File Needed) */}
      <style>{`
        .ps-container {
          min-height: 100vh;
          background-color: #0f172a !important;
          color: #f8fafc !important;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          box-sizing: border-box;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .ps-card {
          width: 100%;
          max-width: 650px;
          background-color: #1e293b;
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          box-sizing: border-box;
        }

        .ps-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .ps-header h1 {
          font-size: 26px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #ffffff;
        }

        .ps-header p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        .ps-section-title {
          color: #10b981;
          font-size: 15px;
          font-weight: 600;
          border-bottom: 1px solid #334155;
          padding-bottom: 6px;
          margin-top: 20px;
          margin-bottom: 14px;
        }

        .ps-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .ps-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .ps-field label {
          font-size: 12px;
          color: #cbd5e1;
          font-weight: 500;
        }

        .ps-field input,
        .ps-field select {
          width: 100%;
          background-color: #0f172a;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 10px 12px;
          color: #ffffff;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }

        .ps-field input:focus,
        .ps-field select:focus {
          border-color: #10b981;
        }

        .ps-help {
          font-size: 11px;
          color: #64748b;
        }

        .ps-btn-group {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .ps-btn-cancel {
          width: 35%;
          padding: 12px;
          background-color: #334155;
          color: #e2e8f0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .ps-btn-submit {
          width: 65%;
          padding: 12px;
          background-color: #10b981;
          color: #022c22;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .ps-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="ps-card">
        {/* Header */}
        <div className="ps-header">
          <h1>Complete Your Profile</h1>
          <p>
            Tell us about yourself so NutriAI can create personalized nutrition and fitness recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className="ps-section-title">Personal Information</div>
          <div className="ps-grid">
            <div className="ps-field">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 25 (optional)"
              />
            </div>

            <div className="ps-field">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">Select Gender (optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="ps-field">
              <label>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 170 (optional)"
              />
            </div>

            <div className="ps-field">
              <label>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 65 (optional)"
              />
            </div>
          </div>

          {/* Fitness Information */}
          <div className="ps-section-title">Fitness Information</div>
          <div className="ps-grid">
            <div className="ps-field">
              <label>Activity Level</label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
              >
                <option value="">Select Activity Level (optional)</option>
                <option value="sedentary">Sedentary</option>
                <option value="lightly_active">Lightly Active</option>
                <option value="moderately_active">Moderately Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div className="ps-field">
              <label>Fitness Goal</label>
              <select
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
              >
                <option value="">Select Fitness Goal (optional)</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div className="ps-field">
              <label>Fitness Level</label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
              >
                <option value="">Select Fitness Level (optional)</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="ps-field">
              <label>Workout Days / Week</label>
              <select
                name="workoutDays"
                value={formData.workoutDays}
                onChange={handleChange}
              >
                <option value="">Select Days (optional)</option>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>

            <div className="ps-field">
              <label>Workout Location</label>
              <select
                name="workoutLocation"
                value={formData.workoutLocation}
                onChange={handleChange}
              >
                <option value="">Select Location (optional)</option>
                <option value="gym">Gym</option>
                <option value="home">Home</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>

            <div className="ps-field">
              <label>Diet Type</label>
              <select
                name="dietType"
                value={formData.dietType}
                onChange={handleChange}
              >
                <option value="">Select Diet Type (optional)</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
              </select>
            </div>
          </div>

          {/* Dietary Information */}
          <div className="ps-section-title">Dietary Information</div>
          <div className="ps-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="ps-field">
              <label>Allergies</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. peanuts, milk, soy (optional)"
              />
              <span className="ps-help">Separate multiple allergies with commas.</span>
            </div>

            <div className="ps-field">
              <label>Dietary Restrictions</label>
              <input
                type="text"
                name="dietaryRestrictions"
                value={formData.dietaryRestrictions}
                onChange={handleChange}
                placeholder="e.g. low sugar, low salt (optional)"
              />
              <span className="ps-help">Separate multiple restrictions with commas.</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="ps-btn-group">
            <button
              type="button"
              className="ps-btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ps-btn-submit"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}